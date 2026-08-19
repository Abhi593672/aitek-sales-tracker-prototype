const pages = await fetch("http://127.0.0.1:9223/json/list").then((r) => r.json());
const page = pages.find((item) => item.type === "page");
if (!page) throw new Error("No browser page available for smoke testing");

const ws = new WebSocket(page.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
const loaded = [];

ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
  if (message.method === "Page.loadEventFired") loaded.splice(0).forEach((r) => r());
};
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

function command(method, params = {}) {
  const id = ++sequence;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await command("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(expression, message) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const body = await evaluate(`document.body.innerText`);
  throw new Error(`${message}\nCurrent screen:\n${body.slice(0, 2000)}`);
}

await command("Page.enable");
await command("Runtime.enable");
await command("Page.navigate", { url: "http://localhost:3000/" });
await new Promise((resolve) => loaded.push(resolve));
await waitFor(`document.body.innerText.includes("Sign in")`, "Login screen did not render");

await evaluate(`[...document.querySelectorAll("button")].find((b)=>b.textContent.trim()==="Sign in").click()`);
await waitFor(`document.body.innerText.includes("KAM Dashboard")`, "KAM login did not reach dashboard");

await evaluate(`[...document.querySelectorAll("nav button")].find((b)=>b.textContent.includes("Opportunities")).click()`);
await waitFor(`document.body.innerText.includes("Strategic Reseller opportunities owned by you")`, "Opportunity list did not open");

await evaluate(`[...document.querySelectorAll("button")].find((b)=>b.textContent.includes("Create Opportunity")).click()`);
await waitFor(`document.body.innerText.includes("Create a KAM-owned opportunity")`, "Create Opportunity did not open");

await evaluate(`(() => {
  const setText=(el,value)=>{Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set.call(el,value);el.dispatchEvent(new Event("input",{bubbles:true}));};
  const setSelect=(el,value)=>{Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value").set.call(el,value);el.dispatchEvent(new Event("change",{bubbles:true}));};
  const setInput=(el,value)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(el,value);el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));};
  const textareas=[...document.querySelectorAll("textarea")];
  setText(textareas[0],"Renewal requirement captured during reseller meeting");
  setText(textareas[1],"Call reseller and confirm final quantities");
  const next=[...document.querySelectorAll("select")].find((s)=>[...s.options].some((o)=>o.text==="Customer follow-up"));
  setSelect(next,"Customer follow-up");
  const date=[...document.querySelectorAll('input[type="date"]')].at(-1);
  setInput(date,"2026-08-25");
})()`);

await evaluate(`[...document.querySelectorAll("button")].find((b)=>b.textContent.trim()==="Save Draft").click()`);
await waitFor(`document.body.innerText.includes("DRAFT-0154") && [...document.querySelectorAll(".tabs button")].some((b)=>b.textContent.trim()==="Draft" && b.classList.contains("active"))`, "Save Draft did not return to the Draft tab");

await evaluate(`[...document.querySelectorAll("button")].find((b)=>b.textContent.includes("Create Opportunity")).click()`);
await waitFor(`document.body.innerText.includes("Create a KAM-owned opportunity")`, "Create Opportunity did not reopen");
await evaluate(`(() => {
  const setText=(el,value)=>{Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set.call(el,value);el.dispatchEvent(new Event("input",{bubbles:true}));};
  const setSelect=(el,value)=>{Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value").set.call(el,value);el.dispatchEvent(new Event("change",{bubbles:true}));};
  const setInput=(el,value)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(el,value);el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));};
  const textareas=[...document.querySelectorAll("textarea")];
  setText(textareas[0],"Validated strategic reseller renewal requirement");
  setText(textareas[1],"Confirm final quantities with reseller");
  const next=[...document.querySelectorAll("select")].find((s)=>[...s.options].some((o)=>o.text==="Customer follow-up"));
  setSelect(next,"Customer follow-up");
  const date=[...document.querySelectorAll('input[type="date"]')].at(-1);
  setInput(date,"2026-08-25");
})()`);
await evaluate(`[...document.querySelectorAll("button")].find((b)=>b.textContent.trim()==="Create Opportunity").click()`);
await waitFor(`document.body.innerText.includes("OPP-2026-00418") && document.body.innerText.includes("Validated strategic reseller renewal requirement")`, "Created Opportunity did not open with entered data");

await evaluate(`[...document.querySelectorAll("button")].find((b)=>b.textContent.trim()==="Request Quotation").click()`);
await waitFor(`document.body.innerText.includes("Linked Opportunity OPP-2026-00418")`, "Request Quotation was not linked to the created Opportunity");

console.log("PASS: KAM Opportunity create, draft, detail and quotation handoff journey");
ws.close();
