const pages = await fetch("http://127.0.0.1:9223/json/list").then((r) => r.json());
const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000/";
const page = pages.find((item) => item.type === "page");
if (!page) throw new Error("No browser page available for smoke testing");

const ws = new WebSocket(page.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
};
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
const command = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  ws.send(JSON.stringify({ id, method, params }));
  pending.set(id, { resolve, reject });
});
async function evaluate(expression) {
  const result = await command("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression, message) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`${message}\n${(await evaluate("document.body.innerText")).slice(0, 2500)}`);
}
async function loadLogin() {
  await command("Page.navigate", { url: baseUrl });
  await waitFor(`document.body.innerText.includes("Sign in")`, "Login did not load");
  await new Promise((resolve) => setTimeout(resolve, 350));
}
async function loginAs(role) {
  await loadLogin();
  await evaluate(`(() => {
    const select=[...document.querySelectorAll("select")].find(s=>[...s.options].some(o=>o.textContent.trim()==="Regional Manager"));
    const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value").set;
    setter.call(select,${JSON.stringify(role)});select.dispatchEvent(new Event("change",{bubbles:true}));
  })()`);
  await evaluate(`[...document.querySelectorAll("button")].find(b=>b.textContent.trim()==="Sign in").click()`);
  await waitFor(`document.body.innerText.includes(${JSON.stringify(`${role} Dashboard`)})`, `${role} login failed`);
}
async function nav(label) {
  await evaluate(`[...document.querySelectorAll("nav button")].find(b=>b.textContent.includes(${JSON.stringify(label)})).click()`);
}

await command("Page.enable");
await command("Runtime.enable");

await loginAs("KAM");
await nav("My Resellers");
await waitFor(`document.body.innerText.includes("Only resellers assigned to the logged-in KAM are visible")`, "KAM reseller scope missing");

await loginAs("IST");
await nav("IST Pool");
await waitFor(`document.body.innerText.includes("30-minute pickup SLA") && document.body.innerText.includes("System suggestion")`, "IST Pool SLA/classification display is incorrect");
await evaluate(`[...document.querySelectorAll("button")].find(b=>b.textContent.trim()==="Pick up").click()`);
await waitFor(`document.body.innerText.includes("The applicable execution SLA starts after classification")`, "Pickup SLA explanation is incorrect");

await loginAs("Desk Manager");
await nav("Team Workload");
await waitFor(`document.body.innerText.includes("workflow ownership only") && [...document.querySelectorAll("select")].some(s=>s.options.length===5)`, "Desk Manager workload/reassignment failed");
await nav("SLA Escalations");
await waitFor(`document.body.innerText.includes("Response plan overdue")`, "Desk Manager SLA escalation failed");

await loginAs("Regional Manager");
await nav("Regional Pipeline");
await waitFor(`document.body.innerText.includes("West Africa") && document.body.innerText.includes("read-only commercial supervision")`, "Regional Manager pipeline failed");

console.log("PASS: role-based login, KAM scope, IST SLA, Desk Manager reassignment and Regional Manager access");
ws.close();
