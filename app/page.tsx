"use client";

import { useMemo, useState } from "react";

type Role = "KAM" | "IST" | "Desk Manager" | "Regional Manager";
type OpportunityTab = "Draft" | "Active" | "Won" | "Lost";
type OpportunityRecord = {
  id: string;
  resellerType: "assigned" | "new";
  reseller: string;
  contact: string;
  stage: string;
  opportunityType: string;
  leadSource: string;
  businessUnit: string;
  vendor: string;
  projectBased: string;
  estimatedAmount: string;
  currency: string;
  expectedClose: string;
  risk: string;
  description: string;
  nextAction: string;
  nextActionDate: string;
  nextActionDescription: string;
};
type Screen = "login" | "dashboard" | "resellers" | "reseller-detail" | "opportunities" | "create-opportunity" | "opportunity-detail" | "kam-requests" | "kam-request-detail" | "request-start" | "create-request" | "request-success" | "kam-quotations" | "kam-quotation-detail" | "revision-request" | "revision-success" | "kam-orders" | "kam-order-detail" | "activities" | "create-activity" | "reports" | "notifications" | "ist-pool" | "assigned" | "request-detail" | "quotation" | "published" | "team-workload" | "sla-escalations" | "regional-pipeline";

const sampleRequests = [
  {
    id: "QR-2026-01842",
    company: "Nexa Systems CI",
    endUser: "Orange Côte d’Ivoire",
    type: "Standard",
    age: "00:12",
    status: "Unassigned",
    value: "€48,600",
  },
  {
    id: "QR-2026-01841",
    company: "DataLink Sénégal",
    endUser: "Ecobank",
    type: "Complex",
    age: "00:24",
    status: "Unassigned",
    value: "€91,250",
  },
  {
    id: "QR-2026-01839",
    company: "TechBridge Ghana",
    endUser: "Ghana Ports",
    type: "Tender",
    age: "00:34",
    status: "SLA breached",
    value: "€184,000",
  },
];

const navByRole: Record<Role, string[]> = {
  KAM: ["Dashboard", "My Resellers", "Opportunities", "Quote Requests", "Quotations", "Orders", "Activities", "Reports"],
  IST: ["Dashboard", "IST Pool", "My Assigned Requests", "Quotations", "Orders", "Activities"],
  "Desk Manager": ["Dashboard", "IST Pool", "Team Workload", "SLA Escalations", "Quotations", "Reports"],
  "Regional Manager": ["Dashboard", "Regional Pipeline", "Opportunities", "Quotations", "Orders", "Reports"],
};

export default function Prototype() {
  const [role, setRole] = useState<Role>("KAM");
  const [screen, setScreen] = useState<Screen>("login");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<"" | "duplicate" | "pickup" | "assigned-error" | "publish">("");
  const [oppName, setOppName] = useState("");
  const [endUser, setEndUser] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [product, setProduct] = useState("HP ProBook 450 G10");
  const [quantity, setQuantity] = useState("50");
  const [unitPrice, setUnitPrice] = useState("972");
  const [picked, setPicked] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmedType, setConfirmedType] = useState("Standard");
  const [classificationReason, setClassificationReason] = useState("");
  const [classificationSaved, setClassificationSaved] = useState(false);
  const [createdOpportunityId, setCreatedOpportunityId] = useState("OPP-2026-00417");
  const [opportunityTab, setOpportunityTab] = useState<OpportunityTab>("Active");
  const [createdOpportunity, setCreatedOpportunity] = useState<OpportunityRecord | null>(null);
  const [activitySaved, setActivitySaved] = useState(false);

  const title = useMemo(
    () =>
      ({
        dashboard: `${role} Dashboard`,
        resellers: "My Strategic Resellers",
        "reseller-detail": "Strategic Reseller RSL-000284",
        opportunities: "Opportunities",
        "create-opportunity": "Create Opportunity",
        "opportunity-detail": `Opportunity ${createdOpportunityId}`,
        "kam-requests": "Quote Requests",
        "kam-request-detail": "Quote Request QR-2026-01842",
        "request-start": "Request Quotation",
        "create-request": "Create Quote Request",
        "request-success": "Quote Request Submitted",
        "kam-quotations": "Quotations",
        "kam-quotation-detail": "Quotation QT-2026-00871",
        "revision-request": "Request Quotation Revision",
        "revision-success": "Revision Request Submitted",
        "kam-orders": "Orders",
        "kam-order-detail": "Order OR-2026-02096",
        activities: "Activities",
        "create-activity": "Add Activity",
        reports: "Reports",
        notifications: "Notifications",
        "ist-pool": "IST Pool",
        assigned: "My Assigned Quote Requests",
        "request-detail": "Quote Request QR-2026-01842",
        quotation: "Prepare Quotation",
        published: "Quotation Published",
        "team-workload": "IST Team Workload",
        "sla-escalations": "SLA Escalations",
        "regional-pipeline": "Regional Pipeline",
        login: "Sign in",
      })[screen],
    [screen, role],
  );

  function go(next: Screen) {
    setScreen(next);
    setErrors([]);
    window.scrollTo(0, 0);
  }
  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 2600);
  }
  function selectRole(nextRole: Role) {
    setRole(nextRole);
    go("dashboard");
  }
  function createOpportunity() {
    const validation = [];
    if (!oppName.trim()) validation.push("Opportunity name is required.");
    if (!endUser.trim()) validation.push("End User is required.");
    if (!nextAction.trim()) validation.push("A Current Next Action is mandatory for every active Opportunity.");
    if (validation.length) return setErrors(validation);
    setModal("duplicate");
  }
  function publishQuote() {
    const validation = [];
    if (!product) validation.push("Select a product or create a Z-Article request.");
    if (!quantity || Number(quantity) <= 0) validation.push("Quantity must be greater than zero.");
    if (!unitPrice || Number(unitPrice) <= 0) validation.push("Unit selling price is required.");
    if (validation.length) return setErrors(validation);
    setModal("publish");
  }

  if (screen === "login") return <Login onLogin={selectRole} />;

  return (
    <div className="app-shell">
      <aside>
        <div className="brand">
          <span className="brandmark">A</span>
          <div>
            <strong>AITEK</strong>
            <small>Sales Tracker</small>
          </div>
        </div>
        <nav>
          {navByRole[role].map((item) => (
            <button key={item} className={isActive(item, screen) ? "active" : ""} onClick={() => navigate(item, role, go)}>
              <span className="navicon">□</span>
              {item}
            </button>
          ))}
        </nav>
        <div className="aside-foot">
          <button>⚙ Settings</button>
          <button onClick={() => go("login")}>↪ Sign out</button>
        </div>
      </aside>
      <section className="workspace">
        <header>
          <div className="crumb">
            Sales Tracker / <strong>{title}</strong>
          </div>
          <div className="header-actions">
            <button className="iconbtn" aria-label="Open notifications" onClick={() => go("notifications")}>
              ♢<span>3</span>
            </button>
            <div className="avatar">{role === "KAM" ? "AK" : role === "IST" ? "SI" : role === "Desk Manager" ? "DM" : "KT"}</div>
            <div>
              <strong>{role === "KAM" ? "Aminata Koné" : role === "IST" ? "Samuel Ibrahim" : role === "Desk Manager" ? "Mariam Diallo" : "Koffi Traoré"}</strong>
              <small>{role}</small>
            </div>
          </div>
        </header>
        <main>
          {screen === "dashboard" && <Dashboard role={role} go={go} />}
          {screen === "resellers" && <ResellerList go={go} />}
          {screen === "reseller-detail" && <ResellerDetail go={go} />}
          {screen === "opportunities" && <OpportunityList go={go} initialTab={opportunityTab} />}
          {screen === "create-opportunity" && (
            <SimpleCreateOpportunity
              go={go}
              notify={notify}
              setCreatedOpportunityId={setCreatedOpportunityId}
              onDraftSaved={() => setOpportunityTab("Draft")}
              onOpportunityCreated={(record) => {
                setCreatedOpportunity(record);
                setOpportunityTab("Active");
              }}
            />
          )}
          {screen === "opportunity-detail" && <OpportunityWorkspace go={go} notify={notify} opportunityId={createdOpportunityId} opportunity={createdOpportunity} />}
          {screen === "kam-requests" && <KAMQuoteRequestList go={go} />}
          {screen === "kam-request-detail" && <KAMQuoteRequestDetail go={go} />}
          {screen === "request-start" && <RequestQuotationStart go={go} notify={notify} setOpportunityId={setCreatedOpportunityId} />}
          {screen === "create-request" && <CreateRequest opportunityId={createdOpportunityId} product={product} setProduct={setProduct} quantity={quantity} setQuantity={setQuantity} notify={notify} go={go} />}
          {screen === "request-success" && <RequestSuccess go={go} />}
          {screen === "kam-quotations" && <KAMQuotationList go={go} />}
          {screen === "kam-quotation-detail" && <KAMQuotationWorkspace go={go} notify={notify} />}
          {screen === "revision-request" && <RevisionRequest go={go} notify={notify} />}
          {screen === "revision-success" && <RevisionSuccess go={go} />}
          {screen === "kam-orders" && <KAMOrderList go={go} />}
          {screen === "kam-order-detail" && <KAMOrderDetail go={go} notify={notify} />}
          {screen === "activities" && <Activities go={go} activitySaved={activitySaved} />}
          {screen === "create-activity" && (
            <CreateActivity
              go={go}
              save={() => {
                setActivitySaved(true);
                go("activities");
                notify("Activity ACT-2026-001286 created successfully");
              }}
            />
          )}
          {screen === "reports" && <KAMReports go={go} notify={notify} />}
          {screen === "notifications" && <KAMNotifications go={go} />}
          {screen === "ist-pool" && <ISTPool picked={picked} setModal={setModal} go={go} />}
          {screen === "assigned" && <AssignedList go={go} />}
          {screen === "request-detail" && (
            <RequestDetail
              go={go}
              confirmedType={confirmedType}
              setConfirmedType={(value: string) => {
                setConfirmedType(value);
                setClassificationSaved(false);
              }}
              classificationReason={classificationReason}
              setClassificationReason={setClassificationReason}
              classificationSaved={classificationSaved}
              errors={errors}
              confirmClassification={() => {
                if (confirmedType !== "Standard" && !classificationReason.trim()) {
                  setErrors(["Classification Change Reason is mandatory when Confirmed Type differs from Suggested Type."]);
                  return;
                }
                setErrors([]);
                setClassificationSaved(true);
                notify(`Request classified as ${confirmedType}`);
              }}
            />
          )}
          {screen === "quotation" && <Quotation product={product} setProduct={setProduct} quantity={quantity} setQuantity={setQuantity} unitPrice={unitPrice} setUnitPrice={setUnitPrice} errors={errors} publish={publishQuote} />}
          {screen === "published" && <Published go={go} />}
          {screen === "team-workload" && <DeskTeamWorkload notify={notify} />}
          {screen === "sla-escalations" && <DeskSLAEscalations notify={notify} />}
          {screen === "regional-pipeline" && <RegionalPipeline />}
        </main>
      </section>
      {toast && <div className="toast">✓ {toast}</div>}
      {modal === "duplicate" && (
        <Modal title="Possible duplicate found" tone="warning" close={() => setModal("")}>
          <p>
            A similar Opportunity exists for <strong>Orange Côte d’Ivoire</strong> and reseller <strong>Nexa Systems CI</strong>.
          </p>
          <div className="comparison">
            <span>OPP-2026-00398</span>
            <strong>Endpoint Security Refresh</strong>
            <small>Qualified · €42,000</small>
          </div>
          <div className="modal-actions">
            <button
              className="secondary"
              onClick={() => {
                setModal("");
                go("opportunities");
              }}
            >
              Open existing
            </button>
            <button
              className="primary"
              onClick={() => {
                setCreatedOpportunityId("OPP-2026-00418");
                setModal("");
                go("opportunity-detail");
                notify("Opportunity OPP-2026-00418 created; override recorded");
              }}
            >
              Create as separate
            </button>
          </div>
        </Modal>
      )}
      {modal === "pickup" && (
        <Modal title="Pick up Quote Request?" close={() => setModal("")}>
          <p>
            You will become the Assigned IST Member for <strong>QR-2026-01842</strong>. Pickup ownership will be recorded and the 30-minute pickup SLA will stop. The applicable execution SLA starts after classification.
          </p>
          <label className="check">
            <input type="checkbox" defaultChecked /> I understand ownership will be recorded in the audit trail.
          </label>
          <div className="modal-actions">
            <button className="secondary" onClick={() => setModal("")}>
              Cancel
            </button>
            <button
              className="primary"
              onClick={() => {
                setPicked(true);
                setModal("");
                go("assigned");
                notify("Quote Request assigned successfully");
              }}
            >
              Confirm pickup
            </button>
          </div>
        </Modal>
      )}
      {modal === "assigned-error" && (
        <Modal title="Request already assigned" tone="error" close={() => setModal("")}>
          <p>
            This request was picked by <strong>Awa Traoré</strong> a few seconds ago. It remains visible in the IST Pool but cannot be claimed.
          </p>
          <div className="modal-actions">
            <button className="primary" onClick={() => setModal("")}>
              Return to IST Pool
            </button>
          </div>
        </Modal>
      )}
      {modal === "publish" && (
        <Modal title="Publish quotation?" close={() => setModal("")}>
          <p>Mandatory validations passed. Publishing will synchronize the quotation to AITEKCenter and notify the reseller and associated KAM.</p>
          <div className="summary">
            <span>Net total</span>
            <strong>€{(Number(quantity || 0) * Number(unitPrice || 0)).toLocaleString()}</strong>
          </div>
          <div className="modal-actions">
            <button className="secondary" onClick={() => setModal("")}>
              Return to edit
            </button>
            <button
              className="primary"
              onClick={() => {
                setModal("");
                go("published");
              }}
            >
              Publish now
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Login({ onLogin }: { onLogin: (r: Role) => void }) {
  const [email, setEmail] = useState("aminata.kone@aitek.com");
  const [password, setPassword] = useState("password");
  const [loginRole, setLoginRole] = useState<Role>("KAM");
  const roleProfiles: Record<Role, { email: string; scope: string }> = {
    KAM: { email: "aminata.kone@aitek.com", scope: "Assigned Strategic Resellers and owned Opportunities" },
    IST: { email: "samuel.ibrahim@aitek.com", scope: "Central IST Pool and assigned Quote Requests" },
    "Desk Manager": { email: "mariam.diallo@aitek.com", scope: "Central desk workload, SLA and reassignment" },
    "Regional Manager": { email: "koffi.traore@aitek.com", scope: "Read-only regional pipeline and KAM performance" },
  };
  return (
    <div className="login-page">
      <div className="login-brand">
        <span className="brandmark large">A</span>
        <h1>AITEK Sales Tracker</h1>
        <p>Internal commercial operations platform</p>
        <div className="flowline">
          <span>Opportunity</span>
          <i>→</i>
          <span>Quote Request</span>
          <i>→</i>
          <span>Quotation</span>
          <i>→</i>
          <span>Order</span>
        </div>
      </div>
      <form
        className="login-card"
        onSubmit={(e) => {
          e.preventDefault();
          onLogin(loginRole);
        }}
      >
        <h2>Sign in</h2>
        <p>Use your AITEK account to continue.</p>
        <Field label="Portal role">
          <select
            value={loginRole}
            onChange={(e) => {
              const nextRole = e.target.value as Role;
              setLoginRole(nextRole);
              setEmail(roleProfiles[nextRole].email);
            }}
          >
            <option>KAM</option>
            <option>IST</option>
            <option>Desk Manager</option>
            <option>Regional Manager</option>
          </select>
        </Field>
        <div className="assignment-banner">
          <strong>Access scope</strong>
          <span>{roleProfiles[loginRole].scope}</span>
        </div>
        <Field label="Email address">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <label className="check">
          <input type="checkbox" /> Keep me signed in
        </label>
        <button className="primary full" type="submit">
          Sign in
        </button>
        <button className="linkbtn" type="button">
          Forgot password?
        </button>
      </form>
    </div>
  );
}

function Dashboard({ role, go }: { role: Role; go: (s: Screen) => void }) {
  const kam = role === "KAM";
  const ist = role === "IST";
  const regional = role === "Regional Manager";
  return (
    <>
      <PageHead title={`${role} Dashboard`} subtitle={kam ? "Strategic account pipeline and next actions" : ist ? "Operational request workload and SLA status" : regional ? "Regional pipeline, KAM performance and commercial risk" : "Team allocation, performance and escalations"} />
      {kam && (
        <div className="dashboard-actions">
          <button className="secondary" onClick={() => go("create-opportunity")}>
            + Create Opportunity
          </button>
          <button className="primary" onClick={() => go("request-start")}>
            + Request Quotation
          </button>
        </div>
      )}
      <div className="metrics">
        <Metric label={kam || regional ? "Open Opportunities" : "Unassigned Requests"} value={kam ? "18" : regional ? "64" : "12"} hint={kam ? "€1.42M pipeline" : regional ? "€4.86M regional pipeline" : "3 approaching SLA"} />
        <Metric label={kam || regional ? "Quotes in Progress" : "My Assigned"} value={kam ? "7" : regional ? "21" : "8"} hint={kam ? "2 awaiting response" : regional ? "Across 5 KAMs" : "2 due today"} />
        <Metric label="SLA Compliance" value={kam ? "94%" : "91%"} hint="Rolling 30 days" />
        <Metric label={kam ? "Next Actions Due" : regional ? "At-risk Deals" : "Published This Month"} value={kam ? "5" : regional ? "9" : "34"} hint={kam ? "2 overdue" : regional ? "3 need management attention" : "€486K quoted"} />
      </div>
      <div className="two-col">
        <Panel title={kam ? "My pipeline" : regional ? "Regional pipeline" : "Priority work queue"} link="View all" onLink={() => go(kam ? "opportunities" : regional ? "regional-pipeline" : "ist-pool")}>
          <Pipeline role={role} />
        </Panel>
        <Panel title={kam ? "Upcoming next actions" : regional ? "Management attention" : "SLA attention"}>
          <ul className="tasks">
            <li>
              <span className="dot red" />
              <div>
                <strong>{kam ? "Follow up · Orange CI" : "QR-2026-01839 breached"}</strong>
                <small>{kam ? "Today, 14:00 · Call" : "Unassigned for 02:11"}</small>
              </div>
            </li>
            <li>
              <span className="dot amber" />
              <div>
                <strong>{kam ? "Review technical scope" : "QR-2026-01841 at risk"}</strong>
                <small>{kam ? "Tomorrow · Meeting" : "18 minutes remaining"}</small>
              </div>
            </li>
            <li>
              <span className="dot green" />
              <div>
                <strong>{kam ? "Quotation response" : "QR-2026-01842 received"}</strong>
                <small>{kam ? "Friday · Email" : "Standard · complete data"}</small>
              </div>
            </li>
          </ul>
        </Panel>
      </div>
    </>
  );
}

function OpportunityList({ go, initialTab }: { go: (s: Screen) => void; initialTab: OpportunityTab }) {
  const [tab, setTab] = useState<OpportunityTab>(initialTab);
  return (
    <>
      <PageHead title="Opportunities" subtitle="Strategic Reseller opportunities owned by you" action="+ Create Opportunity" onAction={() => go("create-opportunity")} />
      <div className="toolbar">
        <div className="search">
          ⌕ <input placeholder="Search Opp ID, reseller, vendor or keyword" />
        </div>
        <select>
          <option>All active stages</option>
          <option>Lead Identified</option>
          <option>Qualification</option>
          <option>Quote Requested</option>
          <option>Quote In Progress</option>
          <option>Quote Sent</option>
          <option>Negotiation</option>
          <option>Customer Decision</option>
          <option>PO Expected</option>
        </select>
        <select>
          <option>All opportunity types</option>
          <option>Renewal licences</option>
          <option>Renewal support</option>
          <option>Upsell client existant</option>
          <option>Cross-sell solution</option>
          <option>Nouveau projet client existant</option>
          <option>New</option>
          <option>Upgrade infrastructure</option>
          <option>Extension capacité</option>
        </select>
        <select>
          <option>All assigned resellers</option>
          <option>Nexa Systems CI</option>
          <option>WestTech Ghana</option>
          <option>Digital Afrique SARL</option>
        </select>
        <button className="secondary">Advanced Filters</button>
      </div>
      <div className="info-banner">
        <strong>Clean status model:</strong> Draft is not a commercial stage. Use tabs for Draft, Active, Won and Lost. Stage applies only inside Active opportunities.
      </div>
      <div className="tabs">
        {(["Draft", "Active", "Won", "Lost"] as const).map((x) => (
          <button key={x} className={tab === x ? "active" : ""} onClick={() => setTab(x)}>
            {x}
          </button>
        ))}
      </div>
      <div className="table-card">
        {tab === "Draft" && (
          <table>
            <thead>
              <tr>
                <th>Draft ID</th>
                <th>Reseller</th>
                <th>Opportunity Type</th>
                <th>Last Edited</th>
                <th>Missing Fields</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>DRAFT-0154</td>
                <td>Nexa Systems CI</td>
                <td>Renewal licences</td>
                <td>19 Aug 2026</td>
                <td>Next Action Date</td>
                <td>
                  <button className="small-primary" onClick={() => go("create-opportunity")}>
                    Continue
                  </button>
                  <button className="secondary">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        {tab === "Active" && (
          <table>
            <thead>
              <tr>
                <th>Opportunity ID</th>
                <th>Reseller</th>
                <th>Opportunity Type</th>
                <th>Stage</th>
                <th>Amount</th>
                <th>Weighted Pipeline</th>
                <th>Next Action</th>
                <th>Risk</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <a onClick={() => go("opportunity-detail")}>OPP-2026-00417</a>
                </td>
                <td>Nexa Systems CI</td>
                <td>Renewal licences</td>
                <td>
                  <Badge text="Negotiation" tone="blue" />
                </td>
                <td>€48,600</td>
                <td>€29,160</td>
                <td>Call reseller · Today</td>
                <td>Commercial</td>
                <td>
                  <button className="small-primary" onClick={() => go("opportunity-detail")}>
                    Open
                  </button>
                  <button className="secondary" onClick={() => go("request-start")}>
                    Request Quote
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <a>OPP-2026-00409</a>
                </td>
                <td>WestTech Ghana</td>
                <td>Upgrade infrastructure</td>
                <td>
                  <Badge text="Qualification" tone="amber" />
                </td>
                <td>€126,400</td>
                <td>€31,600</td>
                <td>Meeting · 22 Aug</td>
                <td>Technical</td>
                <td>
                  <button className="small-primary" onClick={() => go("opportunity-detail")}>
                    Open
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        {tab === "Won" && (
          <table>
            <thead>
              <tr>
                <th>Opportunity ID</th>
                <th>Reseller</th>
                <th>Opportunity Type</th>
                <th>Amount</th>
                <th>Won Date</th>
                <th>Quote / Order Ref</th>
                <th>Invoice / Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OPP-2026-00382</td>
                <td>Nexa Systems CI</td>
                <td>Cross-sell solution</td>
                <td>€84,950</td>
                <td>28 Jul 2026</td>
                <td>QT-00830 / OR-02088</td>
                <td>Paid</td>
                <td>
                  <button className="small-primary" onClick={() => go("opportunity-detail")}>
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        {tab === "Lost" && (
          <table>
            <thead>
              <tr>
                <th>Opportunity ID</th>
                <th>Reseller</th>
                <th>Opportunity Type</th>
                <th>Lost Date</th>
                <th>Lost Reason</th>
                <th>Competitor</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OPP-2026-00350</td>
                <td>Digital Afrique SARL</td>
                <td>New</td>
                <td>18 Jul 2026</td>
                <td>Price</td>
                <td>Competitor captured</td>
                <td>€34,000</td>
                <td>
                  <button className="small-primary" onClick={() => go("opportunity-detail")}>
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function CreateOpportunity({ values, setters, errors, onSubmit, onSaveRequest, notify, go }: any) {
  const [step, setStep] = useState(1);
  const [partyType, setPartyType] = useState("assigned");
  const [dealType, setDealType] = useState("Renewal");
  const [origin, setOrigin] = useState("Strategic Reseller Interaction");
  const [productMode, setProductMode] = useState("catalogue");
  const [qualification, setQualification] = useState("In Progress");
  return (
    <>
      <PageHead title="Create Opportunity" subtitle="Record and manage a new commercial opportunity" />
      <FormErrors errors={errors} />
      <div className="opportunity-steps">
        {["1 · Opportunity Details", "2 · Qualification", "3 · Products & Next Action"].map((x, i) => (
          <button key={x} className={step === i + 1 ? "current" : step > i + 1 ? "done" : ""} onClick={() => setStep(i + 1)}>
            {step > i + 1 ? "✓ " : ""}
            {x}
          </button>
        ))}
      </div>
      <div className="form-card">
        {step === 1 && (
          <>
            <SectionTitle n="1" title="Identify Opportunity" />
            <div className="readonly-grid">
              <Info label="Opportunity ID" value="Generated after save" />
              <Info label="Record Source" value="KAM Created" />
              <Info label="Owner" value="Aminata Koné" />
              <Info label="Stage" value="Identified" />
            </div>
            <Field label="Opportunity For *">
              <select value={partyType} onChange={(e) => setPartyType(e.target.value)}>
                <option value="assigned">Assigned Strategic Reseller</option>
                <option value="new">New Reseller Prospect</option>
                <option value="enduser">Direct End User</option>
              </select>
              <small>This choice controls which party details are required. SOFA is not available in this dropdown.</small>
            </Field>
            <div className="form-grid">
              <Field label="Opportunity Name *">
                <input value={values.oppName} onChange={(e) => setters.setOppName(e.target.value)} placeholder="Example: Orange CI — Device Renewal 2026" />
              </Field>
              <Field label="Deal Type *">
                <select value={dealType} onChange={(e) => setDealType(e.target.value)}>
                  <option>New Business</option>
                  <option>Renewal</option>
                  <option>Upsell</option>
                  <option>Cross-sell</option>
                  <option>Project</option>
                  <option>Tender</option>
                </select>
              </Field>
              <Field label="Opportunity Origin *">
                <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                  <option>Strategic Reseller Interaction</option>
                  <option>End Customer Interaction</option>
                  <option>Vendor Referral</option>
                  <option>DBU Referral</option>
                  <option>Management Referral</option>
                  <option>Tender / RFP</option>
                  <option>Event / Campaign</option>
                  <option>Existing Customer Expansion</option>
                  <option>Other</option>
                </select>
              </Field>
              {["Vendor Referral", "DBU Referral", "Management Referral"].includes(origin) && (
                <Field label="Referred By *">
                  <input placeholder="Name and organisation" />
                </Field>
              )}
              {origin === "Tender / RFP" && (
                <>
                  <Field label="Tender Reference *">
                    <input placeholder="Tender/RFP reference" />
                  </Field>
                  <Field label="Submission Deadline *">
                    <input type="datetime-local" />
                  </Field>
                </>
              )}
              {origin === "Other" && (
                <Field label="Origin Details *">
                  <input placeholder="Describe how this Opportunity originated" />
                </Field>
              )}
              {partyType === "assigned" && (
                <>
                  <Field label="Assigned Strategic Reseller *">
                    <select defaultValue="NEXA-CI">
                      <option value="NEXA-CI">Nexa Systems CI · RSL-000284</option>
                      <option value="WEST-GH">WestTech Ghana · RSL-000197</option>
                      <option value="DA-SN">Digital Afrique SARL · RSL-000156</option>
                    </select>
                    <small>Only active annual assignments for Aminata Koné.</small>
                  </Field>
                  <Field label="Reseller Contact *">
                    <select>
                      <option>Fatou Bamba</option>
                      <option>Jean Kouassi</option>
                    </select>
                  </Field>
                </>
              )}
              {partyType === "new" && (
                <>
                  <Field label="New Reseller Company *">
                    <input placeholder="Legal/company name" />
                  </Field>
                  <Field label="Contact Person *">
                    <input placeholder="Full name" />
                  </Field>
                  <Field label="Email *">
                    <input type="email" placeholder="contact@company.com" />
                  </Field>
                  <Field label="Phone *">
                    <input placeholder="Country code and number" />
                  </Field>
                </>
              )}
              {partyType === "enduser" && (
                <>
                  <Field label="Direct End User *">
                    <input value={values.endUser} onChange={(e) => setters.setEndUser(e.target.value)} placeholder="Search or enter End User" />
                  </Field>
                  <Field label="End User Contact *">
                    <input placeholder="Contact name, email or phone" />
                  </Field>
                </>
              )}
              <Field label="End Customer">
                <input value={partyType === "enduser" ? values.endUser : values.endUser} onChange={(e) => setters.setEndUser(e.target.value)} placeholder="Search or enter End Customer" />
              </Field>
              <Field label="Business Unit *">
                <select>
                  <option>Computing & Printing</option>
                  <option>Cybersecurity</option>
                  <option>Cloud & Software</option>
                  <option>Infrastructure & Power</option>
                </select>
              </Field>
              <Field label="Expected Close Date *">
                <input type="date" defaultValue="2026-09-30" />
              </Field>
              <Field label="Estimated Value *">
                <div className="money">
                  <select defaultValue="EUR">
                    <option>EUR</option>
                    <option>USD</option>
                    <option>XOF</option>
                  </select>
                  <input type="number" min="0" defaultValue="48600" />
                </div>
              </Field>
              <Field label="Priority *">
                <select>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                  <option>Low</option>
                </select>
              </Field>
            </div>
            {partyType === "new" && (
              <div className="warning-box">
                <strong>Prospect only</strong>
                <p>The Opportunity can be saved and followed up. Quotation publication remains blocked until the reseller is registered in AITEKCenter and linked.</p>
              </div>
            )}
            {partyType === "enduser" && (
              <div className="warning-box">
                <strong>Direct End User route</strong>
                <p>Before quotation publication, an external reseller must be linked or an authorized user must select SOFA with a mandatory reason and audit record.</p>
              </div>
            )}
            <Field label="Requirement Summary *">
              <textarea defaultValue="Renew 50 business laptops and endpoint security licences for the End User's Abidjan offices." />
            </Field>
            <button className="unavailable-link" type="button" onClick={() => notify("Assignment review request sent")}>
              Assigned Strategic Reseller is not listed?
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <SectionTitle n="2" title="Qualify Opportunity" />
            <div className="classification-note">
              <strong>Progressive qualification</strong>
              <span>These fields can be completed as the KAM learns more. They become mandatory only when moving the Opportunity to Qualified.</span>
            </div>
            <div className="form-grid">
              <Field label="Qualification Status">
                <select value={qualification} onChange={(e) => setQualification(e.target.value)}>
                  <option>In Progress</option>
                  <option>Ready to Qualify</option>
                </select>
              </Field>
              <Field label="Requirement Confirmed? *">
                <select>
                  <option>Partially</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </Field>
              <Field label="Confirmation Method">
                <select>
                  <option>Reseller Email</option>
                  <option>Call</option>
                  <option>Meeting</option>
                  <option>BOQ</option>
                  <option>Tender / RFP</option>
                </select>
              </Field>
              <Field label="Budget Status *">
                <select>
                  <option>Indicative</option>
                  <option>Confirmed</option>
                  <option>Unknown</option>
                  <option>Not Confirmed</option>
                </select>
              </Field>
              <Field label="Expected Decision Date">
                <input type="date" defaultValue="2026-09-15" />
              </Field>
              <Field label="Decision Maker Known? *">
                <select>
                  <option>Partially</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </Field>
              <Field label="Competition Known?">
                <select>
                  <option>Unknown</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </Field>
              <Field label="Primary Risk">
                <select>
                  <option>None identified</option>
                  <option>Budget</option>
                  <option>Competition</option>
                  <option>Product Availability</option>
                  <option>Pricing</option>
                  <option>Technical</option>
                  <option>Tender Deadline</option>
                  <option>Reseller Engagement</option>
                  <option>Payment / Credit</option>
                  <option>Delivery</option>
                </select>
              </Field>
            </div>
            <Field label="Reason for Qualification *">
              <textarea placeholder="What evidence shows that this is an active commercial Opportunity?" />
            </Field>
            <Field label="Plan to Win">
              <textarea placeholder="Required for large, competitive, Project or Tender Opportunities." />
            </Field>
            {qualification === "Ready to Qualify" && <div className="success-hint">✓ Qualification checklist selected. The system will verify mandatory evidence before changing the stage.</div>}
          </>
        )}
        {step === 3 && (
          <>
            <SectionTitle n="3" title="High-level Products and Current Next Action" />
            <div className="classification-note">
              <strong>Opportunity-level product capture</strong>
              <span>Keep this high level. Exact Product lines, quantities, currency, notes and delivery conditions are confirmed in the Quote Request.</span>
            </div>
            <div className="product-line">
              <Field label="Vendor">
                <select>
                  <option>HP</option>
                  <option>Microsoft</option>
                  <option>Kaspersky</option>
                  <option>APC</option>
                </select>
              </Field>
              <Field label="Product / Product Family">
                <select value={productMode} onChange={(e) => setProductMode(e.target.value)}>
                  <option value="catalogue">Business Laptops</option>
                  <option value="security">Endpoint Security</option>
                  <option value="zarticle">Product not found</option>
                </select>
              </Field>
              <Field label="Approximate Quantity">
                <input type="number" min="1" defaultValue="50" />
              </Field>
              <Field label="Product Notes">
                <input defaultValue="Three-year security requirement" />
              </Field>
            </div>
            {productMode === "zarticle" && (
              <div className="warning-box">
                <strong>Product not found</strong>
                <p>The KAM records the requirement only. After Quote Request submission, IST confirms whether the existing Supply Products/Z-Article process is required. No Z-Article is created for stock unavailability.</p>
              </div>
            )}
            <SectionTitle n="4" title="Current Next Action" />
            <div className="form-grid">
              <Field label="Next Action * for Active Opportunity">
                <input value={values.nextAction} onChange={(e) => setters.setNextAction(e.target.value)} placeholder="Confirm technical scope with reseller" />
              </Field>
              <Field label="Activity Type">
                <select>
                  <option>Call</option>
                  <option>Meeting</option>
                  <option>Email</option>
                  <option>Task</option>
                  <option>Follow-up</option>
                </select>
              </Field>
              <Field label="Owner">
                <input value="Aminata Koné" readOnly />
              </Field>
              <Field label="Due Date">
                <input type="date" defaultValue="2026-08-12" />
              </Field>
            </div>
            <div className="info-banner">
              <strong>Draft rule:</strong> Current Next Action is optional for Draft, mandatory for Active or Qualified Opportunities, and automatically creates a linked Activity ID.
            </div>
            <SectionTitle n="5" title="Attachments" />
            <div className="upload">
              ⇧ Upload customer requirement, BOQ, tender/RFP or supporting email
              <small>{dealType === "Tender" ? "Tender/RFP is mandatory before a Tender Quote Request can be submitted." : "PDF, DOCX, XLSX · Maximum 20 MB each"}</small>
            </div>
          </>
        )}
        <div className="form-actions">
          <button className="secondary" onClick={() => go("opportunities")}>
            Cancel
          </button>
          <button className="secondary" onClick={() => notify("Draft saved. Only Opportunity Name and Strategic Reseller were required.")}>
            Save as Draft
          </button>
          {step > 1 && (
            <button className="secondary" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button className="primary" onClick={() => setStep(step + 1)}>
              Save and Continue
            </button>
          ) : (
            <>
              <button className="secondary" onClick={onSubmit}>
                Save Opportunity
              </button>
              <button className="primary" onClick={onSaveRequest}>
                Save and Create Quote Request
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function OpportunityDetail({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <div className="record-head">
        <div>
          <button className="back" onClick={() => go("opportunities")}>
            ← Opportunities
          </button>
          <div className="idline">
            <span>OPP-2026-00417</span>
            <Badge text="Qualified" tone="blue" />
          </div>
          <h1>Cloud & Endpoint Renewal</h1>
          <p>Nexa Systems CI · Orange Côte d’Ivoire</p>
        </div>
        <button className="primary" onClick={() => go("create-request")}>
          Create Quote Request
        </button>
      </div>
      <div className="record-grid">
        <div className="record-main">
          <Panel title="Opportunity overview">
            <div className="detail-grid">
              <Info label="Owner" value="Aminata Koné (KAM)" />
              <Info label="Assigned KAM" value="Aminata Koné" />
              <Info label="Business Unit" value="Computing & Printing" />
              <Info label="Estimated value" value="€48,600" />
              <Info label="Expected close" value="30 Sep 2026" />
              <Info label="Probability" value="25%" />
            </div>
          </Panel>
          <Panel title="Commercial requirement">
            <p>Renew 50 business laptops and endpoint security licences for the End User&apos;s Abidjan offices.</p>
          </Panel>
          <Panel title="Related Quote Requests">
            <div className="empty">
              <strong>No Quote Request yet</strong>
              <span>Create a request when the requirement is ready for IST execution.</span>
              <button className="linkbtn" onClick={() => go("create-request")}>
                Create Quote Request →
              </button>
            </div>
          </Panel>
        </div>
        <div>
          <Panel title="Current Next Action">
            <Badge text="Due today" tone="red" />
            <h3>Confirm technical scope with reseller</h3>
            <p className="muted">Call · 12 Aug 2026 · Aminata Koné</p>
            <button className="secondary full">Complete action</button>
          </Panel>
          <Panel title="Activity timeline">
            <Timeline />
          </Panel>
        </div>
      </div>
    </>
  );
}

function SimpleCreateOpportunity({ go, notify, setCreatedOpportunityId, onDraftSaved, onOpportunityCreated }: { go: (s: Screen) => void; notify: (m: string) => void; setCreatedOpportunityId: (id: string) => void; onDraftSaved: () => void; onOpportunityCreated: (record: OpportunityRecord) => void }) {
  const [party, setParty] = useState("assigned");
  const [assignedReseller, setAssignedReseller] = useState("Nexa Systems CI");
  const [newReseller, setNewReseller] = useState("");
  const [contact, setContact] = useState("Fatou Bamba");
  const [requirement, setRequirement] = useState("");
  const [next, setNext] = useState("");
  const [date, setDate] = useState("");
  const [nextDescription, setNextDescription] = useState("");
  const [stage, setStage] = useState("Lead Identified");
  const [project, setProject] = useState("No");
  const [opportunityType, setOpportunityType] = useState("Renewal licences");
  const [leadSource, setLeadSource] = useState("KAM reseller interaction");
  const [businessUnit, setBusinessUnit] = useState("Computing & Printing");
  const [vendor, setVendor] = useState("HP");
  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [expectedClose, setExpectedClose] = useState("");
  const [risk, setRisk] = useState("None");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const validate = (draft = false) => {
    const e: string[] = [];
    if (!draft && !requirement.trim()) e.push("Opportunity description is required before creating an Active Opportunity.");
    if (!draft && !next.trim()) e.push("Next Action is required for Active Opportunity.");
    if (!draft && !date) e.push("Next Action Date is required for Active Opportunity.");
    if (!draft && !nextDescription.trim()) e.push("Next Action Description is required for Active Opportunity.");
    if (!draft && party === "new" && !newReseller.trim()) e.push("New Reseller Company is required.");
    if (!draft && party === "new" && !contact.trim()) e.push("New Reseller contact details are required.");
    if (!draft && stage !== "Lead Identified" && !estimatedAmount.trim()) e.push("Estimated Amount is required after Lead Identified stage.");
    return e;
  };
  const saveDraft = () => {
    onDraftSaved();
    notify("Draft saved. It appears under the Draft tab and is not counted in pipeline.");
    go("opportunities");
  };
  const submit = () => {
    const e = validate(false);
    if (e.length) {
      setFormErrors(e);
      return;
    }
    const id = "OPP-2026-00418";
    const record: OpportunityRecord = {
      id,
      resellerType: party as "assigned" | "new",
      reseller: party === "assigned" ? assignedReseller : newReseller,
      contact,
      stage,
      opportunityType,
      leadSource,
      businessUnit,
      vendor,
      projectBased: project,
      estimatedAmount,
      currency,
      expectedClose,
      risk,
      description: requirement,
      nextAction: next,
      nextActionDate: date,
      nextActionDescription: nextDescription,
    };
    setCreatedOpportunityId(id);
    onOpportunityCreated(record);
    notify("Opportunity OPP-2026-00418 created successfully");
    go("opportunity-detail");
  };
  return (
    <>
      <PageHead title="Create Opportunity" subtitle="Create a KAM-owned opportunity for Assigned Strategic Reseller or New Reseller" />
      <FormErrors errors={formErrors} />
      <div className="form-card simple-opportunity">
        <div className="info-banner">
          <strong>KAM scope:</strong> KAM creates opportunities for assigned Strategic Resellers. New Reseller can be captured as prospect/onboarding. Direct End User is excluded in this prototype.
        </div>
        <SectionTitle n="1" title="Opportunity information" />
        <div className="readonly-grid">
          <Info label="Opportunity ID" value="Generated after Create" />
          <Info label="Owner" value="Aminata Koné · KAM" />
          <Info label="Region" value="DR CI & WEST" />
          <Info label="Record Source" value="KAM Created" />
        </div>
        <div className="form-grid">
          <Field label="Reseller Type *">
            <select value={party} onChange={(e) => setParty(e.target.value)}>
              <option value="assigned">Assigned Strategic Reseller</option>
              <option value="new">New Reseller</option>
            </select>
          </Field>
          {party === "assigned" && (
            <>
              <Field label="Assigned Strategic Reseller *">
                <select value={assignedReseller} onChange={(e) => setAssignedReseller(e.target.value)}>
                  <option>Nexa Systems CI</option>
                  <option>WestTech Ghana</option>
                  <option>Digital Afrique SARL</option>
                </select>
                <small>Only strategic resellers assigned to this KAM are listed.</small>
              </Field>
              <Field label="Reseller Contact">
                <select value={contact} onChange={(e) => setContact(e.target.value)}>
                  <option>Fatou Bamba</option>
                  <option>Jean Kouassi</option>
                </select>
              </Field>
            </>
          )}
          {party === "new" && (
            <>
              <Field label="New Reseller Company *">
                <input value={newReseller} onChange={(e) => setNewReseller(e.target.value)} placeholder="Company name" />
              </Field>
              <Field label="Contact Person / Email / Phone *">
                <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Basic contact details" />
              </Field>
            </>
          )}
          <Field label="Stage *">
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              <option>Lead Identified</option>
              <option>Qualification</option>
              <option>Quote Requested</option>
              <option>Quote In Progress</option>
              <option>Quote Sent</option>
              <option>Negotiation</option>
              <option>Customer Decision</option>
              <option>PO Expected</option>
              <option>Won</option>
              <option>Lost</option>
              <option>Dormant</option>
              <option>Disqualified</option>
            </select>
            <small>Draft is not shown here because Draft is record status, not commercial stage.</small>
          </Field>
          <Field label="Opportunity Type *">
            <select value={opportunityType} onChange={(e) => setOpportunityType(e.target.value)}>
              <option>Renewal licences</option>
              <option>Renewal support</option>
              <option>Upsell client existant</option>
              <option>Cross-sell solution</option>
              <option>Nouveau projet client existant</option>
              <option>New</option>
              <option>Upgrade infrastructure</option>
              <option>Extension capacité</option>
            </select>
          </Field>
          <Field label="Lead Source *">
            <select value={leadSource} onChange={(e) => setLeadSource(e.target.value)}>
              <option>KAM reseller interaction</option>
              <option>KAM customer meeting</option>
              <option>Vendor referral</option>
              <option>DBU referral</option>
              <option>Management referral</option>
              <option>Renewal follow-up</option>
              <option>Tender / RFP identification</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Business Unit *">
            <select value={businessUnit} onChange={(e) => setBusinessUnit(e.target.value)}>
              <option>Computing & Printing</option>
              <option>Cybersecurity</option>
              <option>Cloud & Software</option>
              <option>Infrastructure & Power</option>
            </select>
          </Field>
          <Field label="Vendor / Manufacturer *">
            <select value={vendor} onChange={(e) => setVendor(e.target.value)}>
              <option>HP</option>
              <option>Microsoft</option>
              <option>Kaspersky</option>
              <option>APC</option>
              <option>Dell</option>
            </select>
          </Field>
          <Field label="Project-based Opportunity?">
            <select value={project} onChange={(e) => setProject(e.target.value)}>
              <option>No</option>
              <option>Yes</option>
            </select>
            <small>If Yes, system suggests Tender/Project classification when Quote Request is created.</small>
          </Field>
          <Field label="Estimated Amount">
            <input type="number" min="0" value={estimatedAmount} onChange={(e) => setEstimatedAmount(e.target.value)} placeholder="Optional at Lead Identified" />
          </Field>
          <Field label="Currency">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option>EUR</option>
              <option>USD</option>
              <option>XOF</option>
            </select>
          </Field>
          <Field label="Expected Closing Date">
            <input type="date" value={expectedClose} onChange={(e) => setExpectedClose(e.target.value)} />
          </Field>
          <Field label="Risk Type">
            <select value={risk} onChange={(e) => setRisk(e.target.value)}>
              <option>None</option>
              <option>Commercial</option>
              <option>Technical</option>
              <option>Pricing</option>
              <option>Stock / Availability</option>
              <option>Payment / Credit</option>
              <option>Delivery</option>
            </select>
          </Field>
        </div>
        {party === "new" && (
          <div className="warning-box">
            <strong>New Reseller rule:</strong> Opportunity can be saved and tracked, but quotation publication is blocked until the reseller is created and linked in AITEKCenter.
          </div>
        )}
        <Field label="Opportunity Description *">
          <textarea value={requirement} onChange={(e) => setRequirement(e.target.value)} placeholder="Customer need, reseller discussion, vendor/product context, expected business value" />
        </Field>
        <SectionTitle n="2" title="Next action" />
        <div className="form-grid">
          <Field label="Next Action *">
            <select value={next} onChange={(e) => setNext(e.target.value)}>
              <option value="">Select next action</option>
              <option>Customer qualification</option>
              <option>Technical-need qualification</option>
              <option>Budget / timing qualification</option>
              <option>Customer call</option>
              <option>Customer follow-up</option>
              <option>Customer meeting</option>
              <option>Solution demo</option>
              <option>Prepare proposal</option>
              <option>Vendor validation</option>
              <option>Send quotation</option>
              <option>Revise quotation</option>
              <option>Commercial negotiation</option>
              <option>Await customer decision</option>
              <option>Prepare order</option>
            </select>
          </Field>
          <Field label="Next Action Date *">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Next Action Description *">
          <textarea value={nextDescription} onChange={(e) => setNextDescription(e.target.value)} placeholder="What exactly must happen next?" />
        </Field>
        <Field label="Attachment">
          <div className="upload">
            Upload email, BOQ, meeting notes or requirement document
            <small>Optional</small>
          </div>
        </Field>
        <div className="form-actions">
          <button className="secondary" onClick={() => go("opportunities")}>
            Cancel
          </button>
          <button className="secondary" onClick={saveDraft}>
            Save Draft
          </button>
          <button className="primary" onClick={submit}>
            Create Opportunity
          </button>
        </div>
      </div>
    </>
  );
}

function OpportunityWorkspace({ go, notify, opportunityId, opportunity }: { go: (s: Screen) => void; notify: (m: string) => void; opportunityId: string; opportunity: OpportunityRecord | null }) {
  const [stage, setStage] = useState(opportunity?.stage || "Lead Identified");
  const [panel, setPanel] = useState<"" | "edit" | "activity" | "close" | "acceptance">("");
  const [estimate, setEstimate] = useState(opportunity?.estimatedAmount || "");
  const [currency, setCurrency] = useState(opportunity?.currency || "EUR");
  const [closeDate, setCloseDate] = useState(opportunity?.expectedClose || "");
  const [nextAction, setNextAction] = useState(opportunity?.nextAction || "Confirm products and quantities with reseller");
  const [nextDate, setNextDate] = useState(opportunity?.nextActionDate || "2026-08-18");
  const [activityDone, setActivityDone] = useState(false);
  const save = () => {
    setPanel("");
    notify("Opportunity updated successfully");
  };
  return (
    <>
      <div className="record-head">
        <div>
          <button className="back" onClick={() => go("opportunities")}>
            ← Opportunities
          </button>
          <div className="idline">
            <span>{opportunityId}</span>
            <Badge text={stage} tone={stage === "Lost" ? "red" : stage === "Negotiation" ? "purple" : "blue"} />
            <Badge text="Active" tone="green" />
          </div>
          <h1>{opportunity?.opportunityType || "Cloud & Endpoint Renewal"}</h1>
          <p>
            {opportunity?.reseller || "Nexa Systems CI"} · {opportunity?.resellerType === "new" ? "New Reseller · Onboarding" : "Strategic Reseller"}
          </p>
        </div>
        <div className="record-actions">
          <button className="secondary" onClick={() => setPanel("edit")}>
            Edit Opportunity
          </button>
          <button className="secondary" onClick={() => setPanel("activity")}>
            + Add Activity
          </button>
          <button className="primary" onClick={() => go("create-request")}>
            Request Quotation
          </button>
          <button className="secondary" onClick={() => setPanel("close")}>
            Close
          </button>
        </div>
      </div>
      <div className="stage-track">
        {["Lead Identified", "Qualification", "Quote Requested", "Quote In Progress", "Quote Sent", "Negotiation", "Customer Decision", "PO Expected", "Won"].map((s) => (
          <span key={s} className={s === stage ? "current" : ""}>
            {s}
          </span>
        ))}
      </div>
      <div className="record-grid">
        <div>
          <Panel title="Basic information">
            <div className="detail-grid">
              <Info label="Opportunity For" value={opportunity?.resellerType === "new" ? "New Reseller" : "Assigned Strategic Reseller"} />
              <Info label={opportunity?.resellerType === "new" ? "New Reseller" : "Strategic Reseller"} value={opportunity?.reseller || "Nexa Systems CI"} />
              <Info label="Reseller Contact" value={opportunity?.contact || "Fatou Bamba"} />
              <Info label="Owner" value="Aminata Koné" />
              <Info label="Business Unit" value={opportunity?.businessUnit || "Computing & Printing"} />
              <Info label="Vendor" value={opportunity?.vendor || "HP"} />
              <Info label="Created" value="12 Aug 2026 · 07:12" />
              <Info label="Status" value="Active" />
            </div>
            <p>
              <strong>Requirement:</strong> {opportunity?.description || "Customer may require laptop and endpoint-security renewal."}
            </p>
          </Panel>
          <Panel title="Commercial information">
            <div className="detail-grid">
              <Info label="Estimated Value" value={estimate ? `${currency} ${Number(estimate).toLocaleString()}` : "Not available"} />
              <Info label="Currency" value={estimate ? currency : "Not selected"} />
              <Info label="Expected Close" value={closeDate || "Not available"} />
              <Info label="Product Interest" value="Not added" />
            </div>
            <button className="secondary" onClick={() => setPanel("edit")}>
              Update commercial information
            </button>
          </Panel>
          <Panel title="Related records">
            <div className="related-cards">
              <button onClick={() => go("kam-requests")}>
                <b>Quote Requests</b>
                <span>0 records</span>
              </button>
              <button onClick={() => go("kam-quotations")}>
                <b>Quotations</b>
                <span>0 records</span>
              </button>
              <button onClick={() => go("kam-orders")}>
                <b>Orders</b>
                <span>0 records</span>
              </button>
              <button>
                <b>Documents</b>
                <span>0 files</span>
              </button>
            </div>
          </Panel>
        </div>
        <div>
          <Panel title="Next action">
            <Badge text={activityDone ? "Completed" : "Upcoming"} tone={activityDone ? "green" : "amber"} />
            <h3>{nextAction}</h3>
            <p className="muted">Due {nextDate} · Aminata Koné</p>
            <button
              className="primary full"
              onClick={() => {
                setActivityDone(true);
                notify("Activity completed");
              }}
            >
              Mark Complete
            </button>
            <button className="secondary full" onClick={() => setPanel("edit")}>
              Reschedule / Change
            </button>
          </Panel>
          <Panel title="Activity and history">
            <ul className="timeline">
              {activityDone && (
                <li>
                  <b />
                  Activity completed<small>Today · Aminata Koné</small>
                </li>
              )}
              <li>
                <b />
                Opportunity created at {opportunity?.stage || "Lead Identified"} stage
                <small>Today, 07:12 · Aminata Koné</small>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
      {panel && (
        <div className="overlay">
          <div className="modal wide">
            <div className="modal-head">
              <h2>{panel === "edit" ? "Update Opportunity" : panel === "activity" ? "Add Activity" : panel === "acceptance" ? "Submit Reseller Order Confirmation" : "Close Opportunity"}</h2>
              <button onClick={() => setPanel("")}>×</button>
            </div>
            {panel === "edit" && (
              <>
                <div className="form-grid">
                  <Field label="Stage">
                    <select value={stage} onChange={(e) => setStage(e.target.value)}>
                      <option>Lead Identified</option>
                      <option>Qualification</option>
                      <option disabled>Quote Requested — system controlled</option>
                      <option disabled>Quote In Progress — system controlled</option>
                      <option disabled>Quote Sent — system controlled</option>
                      <option>Negotiation</option>
                      <option>Customer Decision</option>
                      <option>PO Expected</option>
                      <option>Dormant</option>
                      <option>Disqualified</option>
                    </select>
                  </Field>
                  <Field label="Estimated Value">
                    <input type="number" value={estimate} onChange={(e) => setEstimate(e.target.value)} placeholder="Optional" />
                  </Field>
                  <Field label="Currency">
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option>EUR</option>
                      <option>USD</option>
                      <option>XOF</option>
                    </select>
                  </Field>
                  <Field label="Expected Closing Date">
                    <input type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
                  </Field>
                  <Field label="Next Action *">
                    <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} />
                  </Field>
                  <Field label="Next-action Date *">
                    <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
                  </Field>
                </div>
                <Field label="Update Note">
                  <textarea placeholder="Record what changed and why" />
                </Field>
                <div className="modal-actions">
                  <button className="secondary" onClick={() => setPanel("")}>
                    Cancel
                  </button>
                  <button className="primary" onClick={save}>
                    Save Update
                  </button>
                </div>
              </>
            )}
            {panel === "activity" && (
              <>
                <div className="form-grid">
                  <Field label="Activity Type *">
                    <select>
                      <option>Call</option>
                      <option>Meeting</option>
                      <option>Email</option>
                      <option>Task</option>
                    </select>
                  </Field>
                  <Field label="Date and Time *">
                    <input type="datetime-local" />
                  </Field>
                </div>
                <Field label="Subject *">
                  <input placeholder="Activity subject" />
                </Field>
                <Field label="Notes">
                  <textarea placeholder="Outcome or discussion notes" />
                </Field>
                <div className="modal-actions">
                  <button className="secondary" onClick={() => setPanel("")}>
                    Cancel
                  </button>
                  <button
                    className="primary"
                    onClick={() => {
                      setPanel("");
                      notify("Activity added successfully");
                    }}
                  >
                    Add Activity
                  </button>
                </div>
              </>
            )}
            {panel === "close" && (
              <>
                <Field label="Close As *">
                  <select onChange={(e) => setStage(e.target.value)}>
                    <option value="Lost">Lost</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </Field>
                <Field label="Reason *">
                  <select>
                    <option>Price</option>
                    <option>Competitor selected</option>
                    <option>Budget cancelled</option>
                    <option>Project postponed</option>
                    <option>No response</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Comments">
                  <textarea />
                </Field>
                <div className="modal-actions">
                  <button className="secondary" onClick={() => setPanel("")}>
                    Cancel
                  </button>
                  <button
                    className="primary"
                    onClick={() => {
                      setPanel("");
                      notify(`Opportunity marked ${stage}`);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function KAMQuoteRequestList({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <PageHead title="Quote Requests" subtitle="Quotation requests for your assigned Strategic Resellers" action="+ Request Quotation" onAction={() => go("request-start")} />
      <div className="metrics small">
        <Metric label="In Progress" value="7" hint="Across assigned resellers" />
        <Metric label="Information Required" value="2" hint="KAM action required" />
        <Metric label="SLA Attention" value="1" hint="Approaching breach" />
      </div>
      <Toolbar />
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Quote Request</th>
              <th>Opportunity</th>
              <th>Strategic Reseller / End Customer</th>
              <th>Source</th>
              <th>Classification</th>
              <th>Assigned IST</th>
              <th>Status</th>
              <th>Required By</th>
              <th>SLA</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={() => go("kam-request-detail")}>
              <td>
                <a>QR-2026-01842</a>
                <small>10 Aug 2026 · 10:12</small>
              </td>
              <td>
                <a>OPP-2026-00417</a>
              </td>
              <td>
                Nexa Systems CI<small>Orange Côte d’Ivoire</small>
              </td>
              <td>KAM</td>
              <td>Standard</td>
              <td>Samuel Ibrahim</td>
              <td>
                <Badge text="Quotation Published" tone="green" />
              </td>
              <td>28 Aug 2026</td>
              <td>
                <Badge text="Completed" tone="green" />
              </td>
              <td>›</td>
            </tr>
            <tr>
              <td>
                <a>QR-2026-01831</a>
                <small>08 Aug 2026 · 14:20</small>
              </td>
              <td>OPP-2026-00409</td>
              <td>
                WestTech Ghana<small>Ghana Commercial Bank</small>
              </td>
              <td>KAM</td>
              <td>Complex</td>
              <td>Awa Traoré</td>
              <td>
                <Badge text="Information Required" tone="amber" />
              </td>
              <td>15 Aug 2026</td>
              <td>
                <Badge text="Running" tone="blue" />
              </td>
              <td>›</td>
            </tr>
            <tr>
              <td>
                <a>QR-2026-01816</a>
                <small>05 Aug 2026 · 09:05</small>
              </td>
              <td>OPP-2026-00398</td>
              <td>
                Nexa Systems CI<small>Orange Côte d’Ivoire</small>
              </td>
              <td>KAM</td>
              <td>Tender</td>
              <td>Moussa Diop</td>
              <td>
                <Badge text="Assigned" tone="blue" />
              </td>
              <td>13 Aug 2026</td>
              <td>
                <Badge text="At Risk" tone="red" />
              </td>
              <td>›</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function KAMQuoteRequestDetail({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <div className="record-head">
        <div>
          <button className="back" onClick={() => go("kam-requests")}>
            ← Quote Requests
          </button>
          <div className="idline">
            <span>QR-2026-01842</span>
            <Badge text="Quotation Published" tone="green" />
          </div>
          <h1>Cloud & Endpoint Renewal</h1>
          <p>Nexa Systems CI · Orange Côte d’Ivoire</p>
        </div>
        <div className="record-actions">
          <button className="secondary" onClick={() => go("opportunity-detail")}>
            View Opportunity
          </button>
          <button className="primary" onClick={() => go("kam-quotation-detail")}>
            View Published Quotation
          </button>
        </div>
      </div>
      <div className="info-banner">
        <strong>KAM access:</strong> Track the request, provide requested information and view the resulting quotation. IST owns assignment, classification and quotation preparation.
      </div>
      <div className="record-grid">
        <div>
          <Panel title="Request overview">
            <div className="detail-grid">
              <Info label="Opportunity" value="OPP-2026-00417" />
              <Info label="Request Source" value="KAM" />
              <Info label="Created By" value="Aminata Koné" />
              <Info label="Created" value="10 Aug 2026 · 10:12" />
              <Info label="Entity" value="AITEK Côte d’Ivoire" />
              <Info label="Region" value="Côte d’Ivoire" />
              <Info label="Currency" value="EUR" />
              <Info label="Required By" value="28 Aug 2026" />
              <Info label="Assigned IST" value="Samuel Ibrahim" />
            </div>
          </Panel>
          <Panel title="Requested Products">
            <table className="inner-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Product</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>HP</td>
                  <td>HP ProBook 450 G10</td>
                  <td>50</td>
                </tr>
                <tr>
                  <td>Kaspersky</td>
                  <td>Endpoint Security</td>
                  <td>50</td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <Panel title="Linked Quotation">
            <table className="inner-table">
              <thead>
                <tr>
                  <th>Quotation</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Published</th>
                </tr>
              </thead>
              <tbody>
                <tr onClick={() => go("kam-quotation-detail")}>
                  <td>
                    <a>QT-2026-00871</a>
                  </td>
                  <td>Version 1</td>
                  <td>
                    <Badge text="Published" tone="green" />
                  </td>
                  <td>10 Aug 2026 · 15:42</td>
                </tr>
              </tbody>
            </table>
          </Panel>
        </div>
        <div>
          <Panel title="IST Classification">
            <Info label="Classification" value="Standard" />
            <Info label="Confirmed By" value="Samuel Ibrahim · IST" />
            <Info label="Confirmed On" value="10 Aug 2026 · 10:14" />
          </Panel>
          <Panel title="SLA and blocker">
            <Info label="Pickup SLA" value="Completed in 00:01" />
            <Info label="Execution SLA" value="Completed within SLA" />
            <Info label="Current Blocker" value="None" />
          </Panel>
          <Panel title="History">
            <ul className="timeline">
              <li>
                <b />
                Quotation published<small>10 Aug · 15:42</small>
              </li>
              <li>
                <b />
                IST classified request as Standard<small>10 Aug · 10:14</small>
              </li>
              <li>
                <b />
                Picked up by Samuel Ibrahim<small>10 Aug · 10:13</small>
              </li>
              <li>
                <b />
                Submitted as Unclassified<small>10 Aug · 10:12</small>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}

function RequestQuotationStart({ go, notify, setOpportunityId }: { go: (s: Screen) => void; notify: (m: string) => void; setOpportunityId: (id: string) => void }) {
  const [stage, setStage] = useState(1);
  const [choice, setChoice] = useState<"existing" | "new" | "">("");
  const [quickName, setQuickName] = useState("");
  const continueFlow = () => {
    if (choice === "existing") {
      setOpportunityId("OPP-2026-00417");
      go("create-request");
      return;
    }
    if (!quickName.trim()) {
      notify("Enter an Opportunity Name before continuing");
      return;
    }
    setOpportunityId("OPP-2026-00418");
    go("create-request");
    notify("Minimum Opportunity OPP-2026-00418 created with Qualification Pending");
  };
  return (
    <>
      <PageHead title="Request Quotation" subtitle="Start from an existing Opportunity or create the minimum Opportunity in this guided flow" />
      <div className="opportunity-steps">
        <button className={stage === 1 ? "current" : "done"}>1 · Reseller & Customer</button>
        <button className={stage === 2 ? "current" : stage > 2 ? "done" : ""}>2 · Find Opportunity</button>
        <button className={stage === 3 ? "current" : ""}>3 · Minimum Opportunity</button>
      </div>
      <div className="form-card">
        {stage === 1 && (
          <>
            <SectionTitle n="1" title="Strategic Reseller and End Customer" />
            <div className="form-grid">
              <Field label="Reseller Type · Read-only">
                <input value="Strategic Reseller" readOnly />
              </Field>
              <Field label="Assigned Strategic Reseller *">
                <select>
                  <option>Nexa Systems CI · RSL-000284</option>
                  <option>WestTech Ghana · RSL-000197</option>
                  <option>Digital Afrique SARL · RSL-000156</option>
                </select>
                <small>Only active annual assignments for Aminata Koné.</small>
              </Field>
              <Field label="Reseller Contact *">
                <select>
                  <option>Fatou Bamba</option>
                  <option>Jean Kouassi</option>
                </select>
              </Field>
              <Field label="End Customer *">
                <select>
                  <option>Orange Côte d’Ivoire · CUS-001824</option>
                  <option>Search another End Customer…</option>
                </select>
              </Field>
            </div>
            <div className="detail-grid compact inherited">
              <Info label="Entity" value="AITEK Côte d’Ivoire" />
              <Info label="Region" value="Côte d’Ivoire" />
              <Info label="Preferred Currency" value="EUR" />
              <Info label="Assigned KAM" value="Aminata Koné" />
            </div>
          </>
        )}
        {stage === 2 && (
          <>
            <SectionTitle n="2" title="Find a matching active Opportunity" />
            <div className="classification-note">
              <strong>Duplicate prevention</strong>
              <span>The system searches by Strategic Reseller, End Customer, active stage, Vendor/Product when known, and recent requirement similarity. It will not silently link an uncertain match.</span>
            </div>
            <label className={`opportunity-choice ${choice === "existing" ? "selected" : ""}`}>
              <input type="radio" name="opp-choice" checked={choice === "existing"} onChange={() => setChoice("existing")} />
              <div>
                <strong>OPP-2026-00417 · Cloud & Endpoint Renewal</strong>
                <span>Qualified · €48,600 · Expected close 30 Sep 2026</span>
                <small>Current Next Action: Confirm technical scope · Due today</small>
              </div>
              <Badge text="Strong match" tone="green" />
            </label>
            <label className={`opportunity-choice ${choice === "new" ? "selected" : ""}`}>
              <input type="radio" name="opp-choice" checked={choice === "new"} onChange={() => setChoice("new")} />
              <div>
                <strong>No suitable Opportunity — create a new minimum record</strong>
                <span>Use when this is a separate commercial requirement.</span>
              </div>
            </label>
          </>
        )}
        {stage === 3 && (
          <>
            <SectionTitle n="3" title="Create Minimum Opportunity" />
            <div className="info-banner">
              <strong>Quotation must not be delayed by incomplete qualification.</strong> The new Opportunity will be created with Qualification Pending and can be completed by the KAM while IST begins work.
            </div>
            <div className="readonly-grid">
              <Info label="Record Source" value="KAM Created" />
              <Info label="Opportunity Origin" value="Strategic Reseller Direct Quote Request" />
              <Info label="Owner" value="Aminata Koné" />
              <Info label="Stage after submission" value="Quote Requested" />
            </div>
            <div className="form-grid">
              <Field label="Opportunity Name *">
                <input value={quickName} onChange={(e) => setQuickName(e.target.value)} placeholder="Example: Orange CI — Urgent Device Quote" />
              </Field>
              <Field label="Deal Type *">
                <select>
                  <option>New Business</option>
                  <option>Renewal</option>
                  <option>Upsell</option>
                  <option>Cross-sell</option>
                  <option>Project</option>
                  <option>Tender</option>
                </select>
              </Field>
              <Field label="Business Unit *">
                <select>
                  <option>Computing & Printing</option>
                  <option>Cybersecurity</option>
                  <option>Cloud & Software</option>
                </select>
              </Field>
              <Field label="Currency">
                <input value="EUR" readOnly />
              </Field>
              <Field label="Estimated Value">
                <input type="number" placeholder="Optional until quotation value is known" />
              </Field>
              <Field label="Expected Close Date">
                <input type="date" />
              </Field>
            </div>
            <Field label="Requirement Summary *">
              <textarea defaultValue="Strategic Reseller requested an immediate quotation for the End Customer requirement." />
            </Field>
            <div className="classification-note">
              <strong>Automatic Next Action</strong>
              <span>Follow up with Strategic Reseller after quotation publication. A linked Activity ID will be generated.</span>
            </div>
          </>
        )}
        <div className="form-actions">
          <button className="secondary" onClick={() => go("dashboard")}>
            Cancel
          </button>
          {stage > 1 && (
            <button className="secondary" onClick={() => setStage(stage - 1)}>
              Back
            </button>
          )}
          {stage === 1 && (
            <button className="primary" onClick={() => setStage(2)}>
              Find Opportunity
            </button>
          )}
          {stage === 2 && (
            <button className="primary" disabled={!choice} onClick={() => (choice === "existing" ? continueFlow() : setStage(3))}>
              {choice === "existing" ? "Link and Continue" : "Create Minimum Opportunity"}
            </button>
          )}
          {stage === 3 && (
            <button className="primary" onClick={continueFlow}>
              Create and Continue to Quote Request
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function CreateRequest({ opportunityId, product, setProduct, quantity, setQuantity, notify, go }: any) {
  return (
    <>
      <PageHead title="Request Quotation" subtitle={`Linked Opportunity ${opportunityId} · Cloud & Endpoint Renewal`} />
      <div className="info-banner">
        <strong>Reuse of existing AITEKCenter template:</strong> Reseller and Customer context is inherited from the Opportunity. Sales Representative is intentionally not used in Sales Tracker.
      </div>
      <div className="form-card">
        <div className="detail-grid compact inherited">
          <Info label="Opportunity · Read-only" value={`${opportunityId} · Cloud & Endpoint Renewal`} />
          <Info label="Request Source · System" value="KAM — Aminata Koné" />
          <Info label="Record Status" value="Draft" />
          <Info label="Quote Request ID" value="Generated after submission" />
        </div>
        <SectionTitle n="1" title="Reseller Information" />
        <div className="form-grid">
          <Field label="Contact person *">
            <select defaultValue="fatou">
              <option value="fatou">Fatou Bamba · Nexa Systems CI</option>
              <option value="jean">Jean Kouassi · Nexa Systems CI</option>
            </select>
          </Field>
          <Field label="Currency *">
            <select defaultValue="EUR">
              <option>EUR</option>
              <option>USD</option>
              <option>XOF</option>
            </select>
          </Field>
          <Field label="Entity *">
            <input value="AITEK Côte d’Ivoire" readOnly />
          </Field>
          <Field label="Region *">
            <input value="Côte d’Ivoire" readOnly />
          </Field>
        </div>
        <SectionTitle n="2" title="Products" />
        <div className="product-line">
          <Field label="Vendor *">
            <select defaultValue="HP">
              <option>HP</option>
              <option>Kaspersky</option>
              <option>Microsoft</option>
              <option>APC</option>
            </select>
          </Field>
          <Field label="Customer (End Customer)">
            <input value="Orange Côte d’Ivoire" readOnly />
          </Field>
          <Field label="Products *">
            <select value={product} onChange={(e) => setProduct(e.target.value)}>
              <option>HP ProBook 450 G10</option>
              <option>Kaspersky Endpoint Security</option>
              <option value="Z-ARTICLE">Product not listed — request Z-Article</option>
            </select>
          </Field>
          <Field label="Quantity *">
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </Field>
        </div>
        <div className="form-grid">
          <Field label="Active Currency · System">
            <input value="EUR" readOnly />
          </Field>
          <div className="field add-product-action">
            <span>&nbsp;</span>
            <button className="primary" type="button" onClick={() => notify("Additional product row added")}>
              ADD PRODUCT
            </button>
          </div>
        </div>
        {product === "Z-ARTICLE" && (
          <div className="warning-box">
            <strong>Z-Article path</strong>
            <p>The requested Product does not exist in the catalogue. The line will follow the existing AITEKCenter Supply Products process. An existing Product with no stock must use procurement/availability handling and must not create a Z-Article.</p>
          </div>
        )}
        <Field label="Would you like to add notes to provide additional details about the product quotation?">
          <input defaultValue="Quote devices and three-year endpoint security licences as separate product lines." />
        </Field>
        <Field label="Delivery conditions">
          <textarea defaultValue="Delivery to the End Customer's Abidjan offices. Include expected delivery lead time." />
        </Field>
        <SectionTitle n="3" title="Sales Tracker workflow information" />
        <div className="form-grid">
          <Field label="Customer required-by date">
            <input type="date" defaultValue="2026-08-28" />
          </Field>
          <Field label="Classification · Read-only">
            <input value="Pending IST Review" readOnly />
            <small>KAM cannot select Standard, Complex or Tender.</small>
          </Field>
        </div>
        <div className="classification-note">
          <strong>Classification ownership</strong>
          <span>The request enters the IST Pool as Unclassified. After pickup and review, IST alone classifies it as Standard, Complex or Tender.</span>
        </div>
        <SectionTitle n="4" title="Attachments" />
        <div className="upload">
          ⇧ Drop customer requirement, BOQ, tender/RFP or technical documents here, or <u>browse files</u>
          <small>PDF, DOCX, XLSX · Maximum 20 MB each</small>
        </div>
        <div className="form-actions">
          <button className="secondary" onClick={() => go("opportunity-detail")}>
            Cancel
          </button>
          <button className="secondary" onClick={() => notify("Quote Request draft saved")}>
            Save as Draft
          </button>
          <button className="primary" onClick={() => go("request-success")}>
            Submit to IST Pool
          </button>
        </div>
      </div>
    </>
  );
}

function RequestSuccess({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="success-page">
      <div className="success-icon">✓</div>
      <h1>Quote Request submitted</h1>
      <p>
        <strong>QR-2026-01842</strong> has entered the IST Pool as <strong>Unclassified</strong>. The 30-minute IST pickup SLA has started.
      </p>
      <div className="success-flow">
        <span>
          <b>10:12</b>Submitted
        </span>
        <i>→</i>
        <span>
          <b>Now</b>IST Pool
        </span>
        <i>→</i>
        <span className="muted">
          <b>Pending</b>IST pickup and classification
        </span>
      </div>
      <div>
        <button className="secondary" onClick={() => go("opportunity-detail")}>
          Return to Opportunity
        </button>
        <button
          className="primary"
          onClick={() => {
            go("kam-requests");
          }}
        >
          View Quote Requests
        </button>
      </div>
    </div>
  );
}

function KAMQuotationList({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <PageHead title="Quotations" subtitle="Published quotations for your assigned Strategic Resellers" action="+ Request Quotation" onAction={() => go("request-start")} />
      <div className="info-banner">
        <strong>Direct Request Quotation rule:</strong> If KAM starts here and no matching Opportunity exists, the system first creates a minimum controlled Opportunity and links the Quote Request to it.
      </div>
      <div className="metrics small">
        <Metric label="Published" value="7" hint="Current portfolio" />
        <Metric label="Awaiting Reseller" value="3" hint="1 expires soon" />
        <Metric label="Revision Requested" value="1" hint="Assigned to IST" />
      </div>
      <Toolbar />
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Quotation</th>
              <th>Strategic Reseller / End Customer</th>
              <th>Opportunity</th>
              <th>Version</th>
              <th>Total</th>
              <th>Status</th>
              <th>Valid Until</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={() => go("kam-quotation-detail")}>
              <td>
                <a>QT-2026-00871</a>
                <small>Published 10 Aug 2026</small>
              </td>
              <td>
                Nexa Systems CI<small>Orange Côte d’Ivoire</small>
              </td>
              <td>OPP-2026-00417</td>
              <td>Version 1</td>
              <td>€48,600</td>
              <td>
                <Badge text="Awaiting Reseller" tone="amber" />
              </td>
              <td>25 Aug 2026</td>
              <td>›</td>
            </tr>
            <tr>
              <td>
                <a>QT-2026-00854</a>
              </td>
              <td>
                WestTech Ghana<small>Ghana Commercial Bank</small>
              </td>
              <td>OPP-2026-00409</td>
              <td>Version 2</td>
              <td>€126,400</td>
              <td>
                <Badge text="Accepted" tone="green" />
              </td>
              <td>20 Aug 2026</td>
              <td>›</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function KAMQuotationDetail({ go, notify }: { go: (s: Screen) => void; notify: (m: string) => void }) {
  return (
    <>
      <div className="record-head">
        <div>
          <button className="back" onClick={() => go("kam-quotations")}>
            ← Quotations
          </button>
          <div className="idline">
            <span>QT-2026-00871 · Version 1</span>
            <Badge text="Published" tone="green" />
          </div>
          <h1>Cloud & Endpoint Renewal</h1>
          <p>Nexa Systems CI · Orange Côte d’Ivoire</p>
        </div>
        <div className="record-actions">
          <button className="secondary" onClick={() => notify("Quotation PDF download started")}>
            Download
          </button>
          <button className="secondary" onClick={() => go("create-activity")}>
            + Negotiation Activity
          </button>
          <button className="primary" onClick={() => go("revision-request")}>
            Request Revision
          </button>
        </div>
      </div>
      <div className="info-banner">
        <strong>KAM access is read-only.</strong> Request Revision is available because the reseller assignment is active, Version 1 is current and published, no Order is confirmed, and the version limit has not been reached.
      </div>
      <div className="record-grid">
        <div>
          <Panel title="Quotation summary">
            <div className="detail-grid">
              <Info label="Quote Request" value="QR-2026-01842" />
              <Info label="Opportunity" value="OPP-2026-00417" />
              <Info label="Assigned IST" value="Samuel Ibrahim" />
              <Info label="Currency" value="EUR" />
              <Info label="Published" value="10 Aug 2026, 15:42" />
              <Info label="Valid Until" value="25 Aug 2026" />
            </div>
            <table className="inner-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>HP</td>
                  <td>HP ProBook 450 G10</td>
                  <td>50</td>
                  <td>€972</td>
                  <td>€48,600</td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <Panel title="Version history">
            <table className="inner-table">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Published By</th>
                  <th>Published Date</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Version 1</td>
                  <td>
                    <Badge text="Current" tone="green" />
                  </td>
                  <td>Samuel Ibrahim · IST</td>
                  <td>10 Aug 2026, 15:42</td>
                  <td>Initial publication</td>
                </tr>
              </tbody>
            </table>
            <small className="muted">Prototype rule: supports versions V1–V6. At V6, Request Revision is disabled and the Desk Manager must determine whether a new Quote Request is required.</small>
          </Panel>
        </div>
        <div>
          <Panel title="Reseller response">
            <Badge text="Awaiting Reseller" tone="amber" />
            <p className="muted">No formal response has been received in AITEKCenter.</p>
          </Panel>
          <Panel title="Notification history">
            <ul className="timeline">
              <li>
                <b />
                Assigned KAM notified<small>10 Aug · 15:43</small>
              </li>
              <li>
                <b />
                Quotation available in AITEKCenter<small>10 Aug · 15:42</small>
              </li>
              <li>
                <b />
                Quotation published by IST<small>10 Aug · 15:42</small>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}

function KAMQuotationWorkspace({ go, notify }: { go: (s: Screen) => void; notify: (m: string) => void }) {
  const [acceptance, setAcceptance] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState("v1");
  return (
    <>
      <div className="record-head">
        <div>
          <button className="back" onClick={() => go("kam-quotations")}>
            ← Quotations
          </button>
          <div className="idline">
            <span>Quote 820</span>
            <Badge text={submitted ? "Order Confirmation Submitted" : "Received"} tone={submitted ? "blue" : "green"} />
          </div>
          <h1>Cloud & Endpoint Renewal</h1>
          <p>Nexa Systems CI · Orange Côte d’Ivoire</p>
        </div>
        <div className="record-actions">
          <button className="secondary" onClick={() => notify("Quotation PDF download started")}>
            Download
          </button>
          <button className="secondary" onClick={() => go("create-activity")}>
            + Activity
          </button>
          <button className="secondary" onClick={() => go("revision-request")}>
            Re-request
          </button>
          <button className="primary" disabled={submitted} onClick={() => setAcceptance(true)}>
            {submitted ? "Submitted to IST" : "Submit Reseller Order Confirmation"}
          </button>
        </div>
      </div>
      <div className="tabs">
        <button className={tab === "v2" ? "active" : ""} onClick={() => setTab("v2")}>
          Quote 2
        </button>
        <button className={tab === "v1" ? "active" : ""} onClick={() => setTab("v1")}>
          Quote 1
        </button>
        <button onClick={() => setTab("fap")}>FAP Simulator</button>
      </div>
      {tab !== "fap" ? (
        <>
          <Panel title={tab === "v1" ? "Quotation Version 1" : "Quotation Version 2"}>
            <table className="inner-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>AITEK Price</th>
                  <th>Converted Price</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>HP</td>
                  <td>HP ProBook 450 G10</td>
                  <td>Orange CI</td>
                  <td>HP-9G2X5EA</td>
                  <td>50</td>
                  <td>€48,600</td>
                  <td>€48,600</td>
                  <td>{tab === "v2" ? "Revised delivery" : "Initial quote"}</td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <Panel title="Price Break-up from AITEK">
            <p>
              <b>Subtotal (Converted):</b> €48,600
            </p>
            <p>
              <b>TVA:</b> Calculated by AITEKCenter
            </p>
            <p>
              <b>AIRSI:</b> Calculated by AITEKCenter
            </p>
            <p>
              <b>Total converted price:</b> €48,600
            </p>
          </Panel>
        </>
      ) : (
        <Panel title="FAP Simulator · Read-only">
          <p className="muted">Existing AITEKCenter Freight Audit and Payment calculations are shown here without KAM editing access.</p>
        </Panel>
      )}
      <div className="record-grid">
        <Panel title="Linked records">
          <div className="detail-grid">
            <Info label="Opportunity" value="OPP-2026-00417" />
            <Info label="Quote Request" value="QR-2026-01842" />
            <Info label="Assigned IST" value="Samuel Ibrahim" />
            <Info label="Valid Until" value="25 Aug 2026" />
          </div>
        </Panel>
        <Panel title="Reseller response">
          <Badge text={submitted ? "Offline acceptance submitted" : "Awaiting Reseller"} tone={submitted ? "blue" : "amber"} />
          <p className="muted">The reseller can accept, reject or re-request directly in AITEKCenter. If acceptance is communicated to KAM offline, KAM submits evidence for IST/Desk Manager verification.</p>
        </Panel>
      </div>
      {acceptance && (
        <div className="overlay">
          <div className="modal wide">
            <div className="modal-head">
              <h2>Submit Reseller Order Confirmation</h2>
              <button onClick={() => setAcceptance(false)}>×</button>
            </div>
            <p>This does not place the Order. An authorized IST member or Desk Manager will verify the reseller evidence and create the manual Order.</p>
            <div className="form-grid">
              <Field label="Strategic Reseller">
                <input value="Nexa Systems CI" readOnly />
              </Field>
              <Field label="Accepted Quotation Version *">
                <select>
                  <option>Quote 1</option>
                  <option>Quote 2</option>
                </select>
              </Field>
              <Field label="Reseller Contact *">
                <select>
                  <option>Fatou Bamba</option>
                  <option>Jean Kouassi</option>
                </select>
              </Field>
              <Field label="Confirmation Channel *">
                <select>
                  <option>Email</option>
                  <option>Signed Purchase Order</option>
                  <option>Meeting</option>
                  <option>Other approved channel</option>
                </select>
              </Field>
              <Field label="Confirmation Date *">
                <input type="date" defaultValue="2026-08-12" />
              </Field>
              <Field label="Purchase Order Reference">
                <input placeholder="Optional if not applicable" />
              </Field>
            </div>
            <Field label="Reseller Confirmation / Comment *">
              <textarea placeholder="Record what the reseller confirmed" />
            </Field>
            <Field label="Authorization Evidence *">
              <div className="upload">Upload reseller email or signed Purchase Order</div>
            </Field>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setAcceptance(false)}>
                Cancel
              </button>
              <button
                className="primary"
                onClick={() => {
                  setAcceptance(false);
                  setSubmitted(true);
                  notify("Order confirmation submitted to authorized IST/Desk Manager");
                }}
              >
                Submit for Order Creation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RevisionRequest({ go, notify }: { go: (s: Screen) => void; notify: (m: string) => void }) {
  const [reason, setReason] = useState("Pricing Negotiation");
  const [details, setDetails] = useState("");
  const [revisionErrors, setRevisionErrors] = useState<string[]>([]);
  const submit = () => {
    if (!details.trim()) {
      setRevisionErrors(["Requested Changes are mandatory."]);
      return;
    }
    setRevisionErrors([]);
    go("revision-success");
    notify("Assigned IST member notified");
  };
  return (
    <>
      <PageHead title="Request Quotation Revision" subtitle="On behalf of Nexa Systems CI · QT-2026-00871 Version 1" />
      <FormErrors errors={revisionErrors} />
      <div className="info-banner">
        <strong>This does not create a new Quote Request.</strong> IST will review the negotiation request and, if accepted, prepare Version 2 under the same quotation and Quote Request.
      </div>
      <div className="form-card">
        <div className="detail-grid compact inherited">
          <Info label="Quotation · Read-only" value="QT-2026-00871 · Version 1" />
          <Info label="Quote Request" value="QR-2026-01842" />
          <Info label="Opportunity" value="OPP-2026-00417" />
          <Info label="Current Total" value="€48,600" />
        </div>
        <SectionTitle n="1" title="Authority and reseller instruction" />
        <div className="form-grid">
          <Field label="Requested On Behalf Of · Read-only">
            <input value="Nexa Systems CI · Strategic Reseller" readOnly />
          </Field>
          <Field label="Request Initiator · Read-only">
            <input value="Aminata Koné · Assigned KAM" readOnly />
          </Field>
          <Field label="Reseller Contact *">
            <select>
              <option>Fatou Bamba</option>
              <option>Jean Kouassi</option>
            </select>
          </Field>
          <Field label="Negotiation Channel *">
            <select>
              <option>Call</option>
              <option>Meeting</option>
              <option>Email</option>
              <option>In-person Discussion</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Reseller Confirmation *">
            <select>
              <option>Email Received</option>
              <option>Meeting Confirmed</option>
              <option>Call Confirmed</option>
              <option>AITEKCenter Request</option>
              <option>Other Evidence</option>
            </select>
          </Field>
          <Field label="Assigned IST Member · Read-only">
            <input value="Samuel Ibrahim" readOnly />
          </Field>
        </div>
        <SectionTitle n="2" title="Requested revision" />
        <div className="form-grid">
          <Field label="Revision Reason *">
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option>Pricing Negotiation</option>
              <option>Quantity Change</option>
              <option>Product Change</option>
              <option>Configuration Change</option>
              <option>Delivery Condition Change</option>
              <option>Payment Term Change</option>
              <option>Validity Extension</option>
              <option>Customer Requirement Change</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Priority *">
            <select>
              <option>Normal</option>
              <option>Urgent</option>
            </select>
          </Field>
          <Field label="Required-by Date *">
            <input type="date" defaultValue="2026-08-15" />
          </Field>
          {reason === "Other" && (
            <Field label="Other Reason *">
              <input placeholder="Specify the revision reason" />
            </Field>
          )}
        </div>
        <Field label="Requested Changes *">
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe exactly what the Strategic Reseller has asked to change." />
        </Field>
        <Field label="Commercial context">
          <textarea placeholder="Record negotiation background, target position and any agreed constraints." />
        </Field>
        <SectionTitle n="3" title="Supporting evidence" />
        <div className="upload">
          ⇧ Upload reseller email, revised BOQ, meeting notes or negotiation evidence
          <small>Evidence, channel, user and timestamp will be retained in audit history.</small>
        </div>
        <div className="form-actions">
          <button className="secondary" onClick={() => go("kam-quotation-detail")}>
            Cancel
          </button>
          <button className="secondary" onClick={() => notify("Revision Request draft saved")}>
            Save Draft
          </button>
          <button className="primary" onClick={submit}>
            Submit Revision Request
          </button>
        </div>
      </div>
    </>
  );
}

function RevisionSuccess({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="success-page">
      <div className="success-icon">✓</div>
      <h1>Revision Request submitted</h1>
      <p>
        <strong>REV-2026-00142</strong> was submitted to Samuel Ibrahim on behalf of Nexa Systems CI.
      </p>
      <div className="notification-list">
        <span>✓ Linked to QT-2026-00871 Version 1</span>
        <span>✓ Linked to QR-2026-01842 and OPP-2026-00417</span>
        <span>✓ Assigned IST member notified</span>
        <span>✓ Negotiation Activity created</span>
        <span>✓ Audit event recorded</span>
      </div>
      <div>
        <button className="secondary" onClick={() => go("kam-quotation-detail")}>
          Return to Quotation
        </button>
        <button className="primary" onClick={() => go("kam-quotations")}>
          View Quotations
        </button>
      </div>
    </div>
  );
}

function ISTPool({ setModal, go }: any) {
  return (
    <>
      <PageHead title="IST Pool" subtitle="Unified queue of unassigned Quote Requests" />
      <div className="sla-banner">
        <strong>30-minute pickup SLA</strong>
        <span>12 unassigned · 3 approaching SLA · 1 breached</span>
      </div>
      <Toolbar />
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Request</th>
              <th>Reseller / End User</th>
              <th>System suggestion</th>
              <th>Age</th>
              <th>Value</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sampleRequests.map((r, i) => (
              <tr key={r.id}>
                <td>
                  <a onClick={() => go("request-detail")}>{r.id}</a>
                  <small>{i === 0 ? "KAM · Aminata Koné" : i === 1 ? "AITEKCenter" : "Outlook intake"}</small>
                </td>
                <td>
                  {r.company}
                  <small>{r.endUser}</small>
                </td>
                <td>
                  <Badge text={`${r.type} · unconfirmed`} tone={r.type === "Tender" ? "purple" : r.type === "Complex" ? "amber" : "blue"} />
                  <small>{r.type === "Tender" ? "Tender reference/deadline trigger" : r.type === "Complex" ? "Multi-vendor/technical trigger" : "No complex or tender trigger"}</small>
                </td>
                <td className={r.status === "SLA breached" ? "danger-text" : ""}>{r.age}</td>
                <td>{r.value}</td>
                <td>
                  <Badge text={r.status} tone={r.status === "SLA breached" ? "red" : "gray"} />
                </td>
                <td>
                  <button className="small-primary" onClick={() => setModal(i === 1 ? "assigned-error" : "pickup")}>
                    Pick up
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AssignedList({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <PageHead title="My Assigned Quote Requests" subtitle="Requests currently owned by Samuel Ibrahim" />
      <div className="metrics small">
        <Metric label="Assigned" value="8" hint="2 due today" />
        <Metric label="Within SLA" value="6" hint="75%" />
        <Metric label="Blocked" value="1" hint="Awaiting reseller" />
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Request</th>
              <th>Reseller / End User</th>
              <th>Type</th>
              <th>Quote SLA</th>
              <th>Readiness</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={() => go("request-detail")}>
              <td>
                <a>QR-2026-01842</a>
                <small>Assigned just now</small>
              </td>
              <td>
                Nexa Systems CI<small>Orange Côte d’Ivoire</small>
              </td>
              <td>
                <Badge text="Standard" tone="blue" />
              </td>
              <td>01:59 remaining</td>
              <td>
                <Badge text="Ready" tone="green" />
              </td>
              <td>›</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function RequestDetail({ go, confirmedType, setConfirmedType, classificationReason, setClassificationReason, classificationSaved, errors, confirmClassification }: any) {
  const changed = confirmedType !== "Standard";
  const [tenderReference, setTenderReference] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [targetDelivery, setTargetDelivery] = useState("");
  const [classificationErrors, setClassificationErrors] = useState<string[]>([]);
  function validateAndConfirm() {
    const nextErrors: string[] = [];
    if (changed && !classificationReason.trim()) nextErrors.push("Manual classification override reason is mandatory.");
    if (confirmedType === "Complex" && !targetDelivery) nextErrors.push("Complex Quote target delivery date and time is mandatory.");
    if (confirmedType === "Tender" && !tenderReference.trim()) nextErrors.push("Tender/RFP reference is mandatory.");
    if (confirmedType === "Tender" && !submissionDeadline) nextErrors.push("Official submission deadline is mandatory.");
    setClassificationErrors(nextErrors);
    if (!nextErrors.length) confirmClassification();
  }
  return (
    <>
      <div className="record-head">
        <div>
          <button className="back" onClick={() => go("assigned")}>
            ← My Assigned Requests
          </button>
          <div className="idline">
            <span>QR-2026-01842</span>
            <Badge text="Assigned" tone="green" />
            <Badge text={classificationSaved ? confirmedType : "Classification pending"} tone={classificationSaved ? "blue" : "amber"} />
          </div>
          <h1>Cloud & Endpoint Renewal</h1>
          <p>Nexa Systems CI · Orange Côte d’Ivoire</p>
        </div>
        <div className="sla-clock">
          <small>QUOTE SLA</small>
          <strong>01:47:18</strong>
          <span>Within SLA</span>
        </div>
      </div>
      <div className="tabs">
        <button className="active">Overview</button>
        <button>
          Products <span>2</span>
        </button>
        <button>
          Attachments <span>1</span>
        </button>
        <button>Clarifications</button>
        <button>History</button>
      </div>
      <FormErrors errors={[...errors, ...classificationErrors]} />
      <div className="classification-card">
        <div className="classification-head">
          <div>
            <span className="eyebrow">IST CLASSIFICATION REVIEW</span>
            <h2>Confirm the operational request type</h2>
            <p>Classification controls the execution path and SLA. It does not change IST Pool visibility or pickup timing.</p>
          </div>
          {classificationSaved && <Badge text="Confirmed" tone="green" />}
        </div>
        <div className="classification-grid">
          <Info label="System-suggested Type" value="Standard · No Complex or Tender trigger detected" />
          <Field label="Confirmed Type *">
            <select value={confirmedType} onChange={(e) => setConfirmedType(e.target.value)}>
              <option>Standard</option>
              <option>Complex</option>
              <option>Tender</option>
            </select>
          </Field>
          <Field label="Classification Status">
            <input value={classificationSaved ? "Confirmed" : "Pending Review"} readOnly />
          </Field>
        </div>
        <div className="criteria">
          <strong>Classification evidence</strong>
          <label>
            <input type="checkbox" defaultChecked /> Products/SKUs are known and eligible
          </label>
          <label>
            <input type="checkbox" defaultChecked /> Scope and quantity are clear
          </label>
          <label>
            <input type="checkbox" /> Material technical/vendor/cross-team coordination required
          </label>
          <label>
            <input type="checkbox" /> Formal tender/RFP and official deadline provided
          </label>
        </div>
        {changed && (
          <Field label="Classification Change Reason *">
            <textarea value={classificationReason} onChange={(e) => setClassificationReason(e.target.value)} placeholder={confirmedType === "Complex" ? "Describe the technical, vendor or cross-team complexity." : "Record tender reference, official deadline and required submission format."} />
          </Field>
        )}
        {confirmedType === "Complex" && (
          <div className="form-grid">
            <Field label="Justified target delivery *">
              <input type="datetime-local" value={targetDelivery} onChange={(e) => setTargetDelivery(e.target.value)} />
            </Field>
            <Info label="SLA rule" value="Qualify within 2 business hours; track the justified delivery target" />
          </div>
        )}
        {confirmedType === "Tender" && (
          <div className="form-grid">
            <Field label="Tender reference *">
              <input value={tenderReference} onChange={(e) => setTenderReference(e.target.value)} placeholder="Example: RFP-CI-2026-109" />
            </Field>
            <Field label="Official submission deadline *">
              <input type="datetime-local" value={submissionDeadline} onChange={(e) => setSubmissionDeadline(e.target.value)} />
            </Field>
            <Info label="SLA rule" value="Confirm ownership and response plan; track the formal submission deadline" />
          </div>
        )}
        <div className="classification-actions">
          <small>Any change records the previous value, new value, IST user, reason and timestamp.</small>
          <button className="primary" onClick={validateAndConfirm}>
            {classificationSaved ? "Update classification" : "Confirm classification"}
          </button>
        </div>
      </div>
      <div className="record-grid">
        <div className="record-main">
          <Panel title="Customer information">
            <div className="detail-grid">
              <Info label="Strategic Reseller" value="Nexa Systems CI" />
              <Info label="End User" value="Orange Côte d’Ivoire" />
              <Info label="Contact" value="Fatou Bamba · fatou@nexa.ci" />
              <Info label="Assigned KAM" value="Aminata Koné" />
            </div>
          </Panel>
          <Panel title="Requested products">
            <table className="inner-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Qty</th>
                  <th>Product state</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>HP ProBook 450 G10</td>
                  <td>HP-9G2X5EA</td>
                  <td>50</td>
                  <td>
                    <Badge text="Eligible" tone="green" />
                  </td>
                </tr>
                <tr>
                  <td>Kaspersky Endpoint Security</td>
                  <td>KL4863X</td>
                  <td>50</td>
                  <td>
                    <Badge text="Eligible" tone="green" />
                  </td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <Panel title="Requirement notes">
            <p>Delivery to Abidjan. Quote devices and 3-year endpoint security licences as separate lines.</p>
          </Panel>
        </div>
        <div>
          <Panel title="Readiness check">
            <Check text="Reseller active and linked" />
            <Check text="End User captured" />
            <Check text="Eligible products identified" />
            <Check text="Mandatory information complete" />
            <div className={classificationSaved ? "" : "blocked-action"}>
              <button className="primary full" disabled={!classificationSaved} onClick={() => go("quotation")}>
                Prepare Quotation →
              </button>
              {!classificationSaved && <small>Confirm Request Type before quotation preparation.</small>}
            </div>
          </Panel>
          <Panel title="Ownership">
            <Info label="Assigned IST" value="Samuel Ibrahim" />
            <Info label="Picked" value="10 Aug 2026 · 10:13" />
            <Info label="Classification owner" value="Assigned IST Member" />
          </Panel>
        </div>
      </div>
    </>
  );
}

function Quotation({ product, setProduct, quantity, setQuantity, unitPrice, setUnitPrice, errors, publish }: any) {
  const total = Number(quantity || 0) * Number(unitPrice || 0);
  return (
    <>
      <PageHead title="Prepare Quotation" subtitle="QT-2026-00871 · From QR-2026-01842" />
      <FormErrors errors={errors} />
      <div className="quote-layout">
        <div className="form-card">
          <div className="quote-meta">
            <Info label="Reseller" value="Nexa Systems CI" />
            <Info label="End User" value="Orange Côte d’Ivoire" />
            <Info label="Currency" value="EUR" />
            <Info label="Validity" value="30 days" />
          </div>
          <SectionTitle n="1" title="Quotation lines" />
          <table className="edit-table">
            <thead>
              <tr>
                <th>Product / SKU</th>
                <th>Qty</th>
                <th>Unit cost</th>
                <th>Margin</th>
                <th>Unit selling price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select value={product} onChange={(e) => setProduct(e.target.value)}>
                    <option>HP ProBook 450 G10</option>
                    <option value="">Select product</option>
                  </select>
                  <small>HP-9G2X5EA</small>
                </td>
                <td>
                  <input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </td>
                <td>€840.00</td>
                <td>
                  <Badge text="15.7%" tone="green" />
                </td>
                <td>
                  <input value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                </td>
                <td>
                  <strong>€{total.toLocaleString()}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <button className="secondary addline">+ Add quotation line</button>
          <SectionTitle n="2" title="Commercial terms" />
          <div className="form-grid">
            <Field label="Payment terms *">
              <select>
                <option>100% prepayment / bank transfer</option>
                <option>Approved credit terms</option>
              </select>
            </Field>
            <Field label="Delivery lead time *">
              <input defaultValue="4–6 weeks, subject to stock availability" />
            </Field>
            <Field label="Quotation validity *">
              <select>
                <option>30 days</option>
                <option>15 days</option>
              </select>
            </Field>
            <Field label="Incoterm">
              <select>
                <option>Delivered Abidjan</option>
                <option>EXW</option>
              </select>
            </Field>
          </div>
          <Field label="Terms and notes">
            <textarea defaultValue="Prices exclude local taxes unless stated. Delivery timing is subject to final stock confirmation at Order stage." />
          </Field>
          <div className="form-actions">
            <button className="secondary">Save draft</button>
            <button className="secondary">Preview PDF</button>
            <button className="primary" onClick={publish}>
              Validate & Publish
            </button>
          </div>
        </div>
        <aside className="quote-summary">
          <h3>Quotation summary</h3>
          <div>
            <span>Subtotal</span>
            <strong>€{total.toLocaleString()}</strong>
          </div>
          <div>
            <span>Discount</span>
            <strong>€0</strong>
          </div>
          <div className="grand">
            <span>Net total</span>
            <strong>€{total.toLocaleString()}</strong>
          </div>
          <small>No human approval is required. Publishing occurs after mandatory system validations pass.</small>
          <hr />
          <Check text="Pricing complete" />
          <Check text="Margin calculated" />
          <Check text="Commercial terms complete" />
          <Check text="Reseller active and linked" />
        </aside>
      </div>
    </>
  );
}

function Published({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="success-page">
      <div className="success-icon">✓</div>
      <h1>Quotation published</h1>
      <p>
        <strong>QT-2026-00871 · Version 1</strong> is available to Nexa Systems CI in AITEKCenter.
      </p>
      <div className="notification-list">
        <span>✓ AITEKCenter synchronization completed</span>
        <span>✓ Reseller notification generated</span>
        <span>✓ Associated KAM notified</span>
        <span>✓ Opportunity stage updated to Quotation Published (60%)</span>
        <span>✓ Audit event recorded</span>
      </div>
      <div>
        <button className="secondary" onClick={() => go("assigned")}>
          My Assigned Requests
        </button>
        <button className="primary" onClick={() => go("request-detail")}>
          View Quote Request
        </button>
      </div>
    </div>
  );
}

function PageHead({ title, subtitle, action, onAction }: { title: string; subtitle: string; action?: string; onAction?: () => void }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action && (
        <button className="primary" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}
function Panel({ title, children, link, onLink }: { title: string; children: React.ReactNode; link?: string; onLink?: () => void }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>{title}</h2>
        {link && <button onClick={onLink}>{link} →</button>}
      </div>
      {children}
    </section>
  );
}
function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Badge({ text, tone }: { text: string; tone: string }) {
  return <span className={`badge ${tone}`}>{text}</span>;
}
function SectionTitle({ n, title }: { n: string; title: string }) {
  return (
    <h3 className="section-title">
      <span>{n}</span>
      {title}
    </h3>
  );
}
function Check({ text }: { text: string }) {
  return (
    <div className="checkrow">
      <b>✓</b>
      {text}
    </div>
  );
}
function FormErrors({ errors }: { errors: string[] }) {
  return errors.length ? (
    <div className="error-box">
      <strong>Correct the following before continuing:</strong>
      {errors.map((e) => (
        <span key={e}>• {e}</span>
      ))}
    </div>
  ) : null;
}
function Modal({ title, children, close, tone = "" }: { title: string; children: React.ReactNode; close: () => void; tone?: string }) {
  return (
    <div className="overlay">
      <div className={`modal ${tone}`}>
        <div className="modal-head">
          <h2>
            {tone === "error" ? "! " : tone === "warning" ? "△ " : ""}
            {title}
          </h2>
          <button onClick={close}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Toolbar() {
  return (
    <div className="toolbar">
      <div className="search">
        ⌕ <input placeholder="Search by ID, reseller or End User" />
      </div>
      <select>
        <option>All statuses</option>
        <option>Qualified</option>
        <option>Published</option>
      </select>
      <select>
        <option>All request types</option>
        <option>Standard</option>
        <option>Complex</option>
        <option>Tender</option>
      </select>
      <button className="secondary">More filters</button>
    </div>
  );
}
function Timeline() {
  return (
    <ul className="timeline">
      <li>
        <b />
        Opportunity qualified<small>Today · 09:40</small>
      </li>
      <li>
        <b />
        Next Action created<small>Yesterday · 16:12</small>
      </li>
      <li>
        <b />
        Opportunity created<small>08 Aug · 11:28</small>
      </li>
    </ul>
  );
}
function Pipeline({ role }: { role: Role }) {
  return (
    <div className="pipeline">
      {(role === "KAM"
        ? [
            ["Qualified", "6", "€280K"],
            ["Quote Request", "4", "€314K"],
            ["Published", "5", "€486K"],
            ["Order Pending", "3", "€340K"],
          ]
        : [
            ["Unassigned", "12", "3 at risk"],
            ["Assigned", "28", "6 due today"],
            ["Blocked", "5", "External input"],
            ["Published", "34", "This month"],
          ]
      ).map((x, i) => (
        <div key={x[0]}>
          <span style={{ width: `${82 - i * 12}%` }} />
          <strong>{x[0]}</strong>
          <b>{x[1]}</b>
          <small>{x[2]}</small>
        </div>
      ))}
    </div>
  );
}
function isActive(item: string, screen: Screen) {
  return (item === "Dashboard" && screen === "dashboard") || (["My Resellers", "My Strategic Resellers"].includes(item) && ["resellers", "reseller-detail"].includes(screen)) || (item === "Opportunities" && ["opportunities", "create-opportunity", "opportunity-detail"].includes(screen)) || (item === "Quote Requests" && ["kam-requests", "kam-request-detail", "request-start", "create-request", "request-success"].includes(screen)) || (item === "Quotations" && ["kam-quotations", "kam-quotation-detail", "revision-request", "revision-success"].includes(screen)) || (item === "Orders" && ["kam-orders", "kam-order-detail"].includes(screen)) || (item === "Activities" && ["activities", "create-activity"].includes(screen)) || (item === "Reports" && screen === "reports") || (item === "IST Pool" && screen === "ist-pool") || (item === "My Assigned Requests" && ["assigned", "request-detail", "quotation", "published"].includes(screen)) || (item === "Team Workload" && screen === "team-workload") || (item === "SLA Escalations" && screen === "sla-escalations") || (item === "Regional Pipeline" && screen === "regional-pipeline");
}
function KAMOrderList({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <PageHead title="Orders" subtitle="Orders connected to your assigned Strategic Resellers" />
      <div className="metrics small">
        <Metric label="Open Orders" value="9" hint="€412,600 total" />
        <Metric label="Pending Payment" value="3" hint="Commercial follow-up" />
        <Metric label="In Fulfilment" value="4" hint="Operational visibility" />
      </div>
      <Toolbar />
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Opportunity / Quotation</th>
              <th>Customer / Reseller</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Sage</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={() => go("kam-order-detail")}>
              <td>
                <a>OR-2026-02096</a>
              </td>
              <td>
                OPP-2026-00409<small>QT-2026-00854 · V2</small>
              </td>
              <td>
                Ghana Commercial Bank<small>WestTech Ghana</small>
              </td>
              <td>
                <Badge text="Confirmed" tone="green" />
              </td>
              <td>€126,400</td>
              <td>
                <Badge text="Pending" tone="amber" />
              </td>
              <td>Pending release</td>
              <td>10 Aug 2026</td>
              <td>›</td>
            </tr>
            <tr>
              <td>
                <a>OR-2026-02088</a>
              </td>
              <td>
                OPP-2026-00382<small>QT-2026-00830 · V1</small>
              </td>
              <td>
                NSIA Banque<small>Nexa Systems CI</small>
              </td>
              <td>
                <Badge text="In Fulfilment" tone="blue" />
              </td>
              <td>€84,950</td>
              <td>
                <Badge text="Paid" tone="green" />
              </td>
              <td>Created</td>
              <td>28 Jul 2026</td>
              <td>›</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function KAMOrderDetail({ go, notify }: { go: (s: Screen) => void; notify: (m: string) => void }) {
  const [tab, setTab] = useState("overview");
  return (
    <>
      <div className="record-head">
        <div>
          <button className="back" onClick={() => go("kam-orders")}>
            ← Orders
          </button>
          <div className="idline">
            <span>OR-2026-02096</span>
            <Badge text="Confirmed" tone="green" />
          </div>
          <h1>Datacenter Modernisation</h1>
          <p>WestTech Ghana · Ghana Commercial Bank</p>
        </div>
        <div className="record-actions">
          <button className="secondary" onClick={() => notify("Order PDF download started")}>
            Download Order
          </button>
          <button className="primary" onClick={() => go("create-activity")}>
            + Add Follow-up
          </button>
        </div>
      </div>
      <div className="info-banner">
        <strong>KAM access is read-only.</strong> Finance validates payment, authorized operations release to Sage, and SCM manages fulfilment.
      </div>
      <div className="tabs">
        {[
          ["overview", "Order with AITEK"],
          ["products", "Products"],
          ["billing", "Billing & Payment"],
          ["comments", "Internal Comments"],
          ["history", "Audit History"],
        ].map(([id, label]) => (
          <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      {tab === "overview" && (
        <Panel title="Order summary">
          <div className="detail-grid">
            <Info label="Opportunity" value="OPP-2026-00409" />
            <Info label="Quote Request" value="QR-2026-01831" />
            <Info label="Accepted Quotation" value="QT-2026-00854 · Version 2" />
            <Info label="Order Date" value="10 Aug 2026" />
            <Info label="Reseller" value="WestTech Ghana" />
            <Info label="End Customer" value="Ghana Commercial Bank" />
            <Info label="Subtotal" value="€110,000" />
            <Info label="Tax" value="€16,400" />
            <Info label="Order Total" value="€126,400" />
          </div>
        </Panel>
      )}
      {tab === "products" && (
        <Panel title="Products · Read-only">
          <table className="inner-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Vendor SKU</th>
                <th>Sage SKU</th>
                <th>Qty</th>
                <th>AITEK Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>APC Smart-UPS SRT 10kVA</td>
                <td>SRT10KXLI</td>
                <td>APC-SRT-10000</td>
                <td>4</td>
                <td>€110,000</td>
              </tr>
            </tbody>
          </table>
          <p className="muted">KAM cannot modify SKU mapping, quantities or prices.</p>
        </Panel>
      )}
      {tab === "billing" && (
        <Panel title="Billing and payment">
          <div className="detail-grid">
            <Info label="Payment Mode" value="Bank transfer" />
            <Info label="Payment Status" value="Pending verification" />
            <Info label="Payable Date" value="20 Aug 2026" />
            <Info label="Invoice" value="Not generated" />
            <Info label="Sage Status" value="Pending release" />
            <Info label="Fulfilment" value="Not started" />
          </div>
        </Panel>
      )}
      {tab === "comments" && (
        <Panel title="Internal comments">
          <p className="muted">Visible only to authorized internal users. External resellers cannot see this section.</p>
          <Field label="Add commercial follow-up note">
            <textarea placeholder="Add an internal note without changing the Order" />
          </Field>
          <button className="primary" onClick={() => notify("Internal note saved and audit event recorded")}>
            Save Note
          </button>
        </Panel>
      )}
      {tab === "history" && (
        <Panel title="Audit history">
          <ul className="timeline">
            <li>
              <b />
              Order confirmed<small>10 Aug 2026 · System</small>
            </li>
            <li>
              <b />
              Quotation Version 2 accepted
              <small>10 Aug 2026 · WestTech Ghana</small>
            </li>
            <li>
              <b />
              Order record created<small>10 Aug 2026 · AITEKCenter</small>
            </li>
          </ul>
        </Panel>
      )}
    </>
  );
}

function KAMReports({ go, notify }: { go: (s: Screen) => void; notify: (m: string) => void }) {
  return (
    <>
      <PageHead title="Reports" subtitle="Performance visibility restricted to your assigned Strategic Reseller portfolio" action="Export Current View" onAction={() => notify("Portfolio report exported")} />
      <div className="toolbar">
        <select>
          <option>All assigned Strategic Resellers</option>
          <option>Nexa Systems CI</option>
          <option>WestTech Ghana</option>
        </select>
        <select>
          <option>Current year · 2026</option>
          <option>Current quarter</option>
          <option>Current month</option>
        </select>
        <button className="primary">Apply Filters</button>
      </div>
      <div className="metrics">
        <Metric label="Qualified Pipeline" value="€1.08M" hint="Excludes unqualified records" />
        <Metric label="Quotation Conversion" value="38%" hint="Published to Order" />
        <Metric label="Order Value" value="€684K" hint="Year to date" />
        <Metric label="Overdue Actions" value="2" hint="KAM attention" />
      </div>
      <div className="two-col">
        <Panel title="Pipeline by stage">
          <Pipeline role="KAM" />
        </Panel>
        <Panel title="Portfolio shortcuts">
          <ul className="tasks">
            <li onClick={() => go("opportunities")}>
              <span className="dot blue" />
              <div>
                <strong>Opportunity pipeline</strong>
                <small>Stage, vendor and reseller analysis</small>
              </div>
            </li>
            <li onClick={() => go("kam-requests")}>
              <span className="dot amber" />
              <div>
                <strong>Quote Request turnaround</strong>
                <small>Pickup, classification and execution</small>
              </div>
            </li>
            <li onClick={() => go("kam-orders")}>
              <span className="dot green" />
              <div>
                <strong>Orders and payments</strong>
                <small>Confirmed value and payment visibility</small>
              </div>
            </li>
          </ul>
        </Panel>
      </div>
    </>
  );
}

function KAMNotifications({ go }: { go: (s: Screen) => void }) {
  const [read, setRead] = useState<string[]>([]);
  const items = [
    {
      id: "n1",
      title: "Quotation published",
      detail: "QT-2026-00871 · Nexa Systems CI",
      time: "12 minutes ago",
      target: "kam-quotation-detail" as Screen,
    },
    {
      id: "n2",
      title: "Clarification required",
      detail: "QR-2026-01831 · Product specification missing",
      time: "1 hour ago",
      target: "kam-request-detail" as Screen,
    },
    {
      id: "n3",
      title: "Order confirmed",
      detail: "OR-2026-02096 · WestTech Ghana",
      time: "Yesterday",
      target: "kam-order-detail" as Screen,
    },
    {
      id: "n4",
      title: "Next action overdue",
      detail: "OPP-2026-00398 · Technical workshop",
      time: "Yesterday",
      target: "opportunity-detail" as Screen,
    },
  ];
  return (
    <>
      <PageHead title="Notifications" subtitle="Commercial and operational events requiring your attention" />
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Notification</th>
              <th>Related record</th>
              <th>Received</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((n) => (
              <tr
                key={n.id}
                className={read.includes(n.id) ? "" : "unread"}
                onClick={() => {
                  setRead([...read, n.id]);
                  go(n.target);
                }}
              >
                <td>
                  <Badge text={read.includes(n.id) ? "Read" : "New"} tone={read.includes(n.id) ? "gray" : "blue"} />
                </td>
                <td>
                  <strong>{n.title}</strong>
                </td>
                <td>{n.detail}</td>
                <td>{n.time}</td>
                <td>Open ›</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function navigate(item: string, role: Role, go: (s: Screen) => void) {
  if (item === "Dashboard") go("dashboard");
  else if (item === "My Resellers" || item === "My Strategic Resellers") go("resellers");
  else if (item === "Opportunities" && role === "KAM") go("opportunities");
  else if (item === "Opportunities" && role === "Regional Manager") go("regional-pipeline");
  else if (item === "Quotations" && role === "KAM") go("kam-quotations");
  else if (item === "Quotations" && role === "IST") go("assigned");
  else if (item === "Quotations" && role === "Desk Manager") go("team-workload");
  else if (item === "Quotations" && role === "Regional Manager") go("regional-pipeline");
  else if (item === "Orders" && role === "KAM") go("kam-orders");
  else if (item === "Orders" && role === "Regional Manager") go("regional-pipeline");
  else if (item === "Activities") go("activities");
  else if (item === "Reports" && role === "KAM") go("reports");
  else if (item === "Reports" && role === "Regional Manager") go("regional-pipeline");
  else if (item === "Reports" && role === "Desk Manager") go("sla-escalations");
  else if (item === "Notifications" && role === "KAM") go("notifications");
  else if (item === "IST Pool") go("ist-pool");
  else if (item === "My Assigned Requests") go("assigned");
  else if (item === "Quote Requests") go("kam-requests");
  else if (item === "Team Workload") go("team-workload");
  else if (item === "SLA Escalations") go("sla-escalations");
  else if (item === "Regional Pipeline") go("regional-pipeline");
  else go("dashboard");
}

function DeskTeamWorkload({ notify }: { notify: (message: string) => void }) {
  const [assignee, setAssignee] = useState("Samuel Ibrahim");
  const members = ["Samuel Ibrahim", "Awa Traoré", "Yamin Shaikh", "Fatou Diop", "Jean Kouassi"];
  return (
    <>
      <PageHead title="IST Team Workload" subtitle="Central desk supervision — workflow ownership only, not commercial ownership" />
      <div className="assignment-banner">
        <strong>Desk Manager rule</strong>
        <span>The Desk Manager monitors flow and may reassign operational ownership. The assigned KAM remains the account and revenue owner.</span>
      </div>
      <div className="metrics small">
        <Metric label="IST Members" value="5" hint="Central team" />
        <Metric label="Open Requests" value="31" hint="Across the desk" />
        <Metric label="At Risk" value="4" hint="Action required" />
      </div>
      <div className="table-card">
        <table>
          <thead><tr><th>Request</th><th>Classification</th><th>Current IST</th><th>SLA</th><th>Reassign to</th><th>Action</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>QR-2026-01839</strong><small>TechBridge Ghana · Outlook</small></td>
              <td><Badge text="Tender / Project" tone="purple" /></td>
              <td>Awa Traoré</td>
              <td><Badge text="Breached" tone="red" /><small>Response plan overdue</small></td>
              <td><select value={assignee} onChange={(e) => setAssignee(e.target.value)}>{members.map((member) => <option key={member}>{member}</option>)}</select></td>
              <td><button className="small-primary" onClick={() => notify(`QR-2026-01839 reassigned to ${assignee}; audit event recorded`)}>Reassign</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function DeskSLAEscalations({ notify }: { notify: (message: string) => void }) {
  return (
    <>
      <PageHead title="SLA Escalations" subtitle="Requests that need operational intervention" />
      <div className="table-card">
        <table>
          <thead><tr><th>Request</th><th>Source</th><th>Classification</th><th>SLA event</th><th>Operational owner</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td>QR-2026-01839</td><td>Outlook</td><td>Tender / Project</td><td><Badge text="Response plan overdue" tone="red" /></td><td>Awa Traoré</td><td><button className="small-primary" onClick={() => notify("Escalation acknowledged; audit event recorded")}>Acknowledge</button></td></tr>
            <tr><td>QR-2026-01841</td><td>AITEKCenter</td><td>Complex</td><td><Badge text="Qualification at risk" tone="amber" /></td><td>Yamin Shaikh</td><td><button className="secondary" onClick={() => notify("Reminder sent to assigned IST member")}>Send reminder</button></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function RegionalPipeline() {
  return (
    <>
      <PageHead title="Regional Pipeline" subtitle="West Africa — read-only commercial supervision across assigned KAMs" />
      <div className="assignment-banner"><strong>Regional access</strong><span>Data is limited to the Regional Manager’s region. Regional Managers monitor and coach; they do not replace KAM ownership.</span></div>
      <div className="metrics"><Metric label="Pipeline" value="€4.86M" hint="64 active Opportunities" /><Metric label="Weighted Pipeline" value="€2.31M" hint="Stage probability applied" /><Metric label="Won YTD" value="€1.74M" hint="Across 5 KAMs" /><Metric label="At Risk" value="€620K" hint="9 Opportunities" /></div>
      <div className="table-card">
        <table>
          <thead><tr><th>KAM</th><th>Strategic Resellers</th><th>Active Opportunities</th><th>Pipeline</th><th>Next Actions Overdue</th><th>Risk</th></tr></thead>
          <tbody>
            <tr><td>Aminata Koné</td><td>12</td><td>18</td><td>€1.42M</td><td>2</td><td><Badge text="Attention" tone="amber" /></td></tr>
            <tr><td>Jean Kouassi</td><td>10</td><td>15</td><td>€1.18M</td><td>0</td><td><Badge text="On track" tone="green" /></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function ResellerList({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <PageHead title="My Strategic Resellers" subtitle="Active annual Strategic Reseller assignments for Aminata Koné" />
      <div className="assignment-banner">
        <strong>Assignment year: 2026</strong>
        <span>Only resellers assigned to the logged-in KAM are visible.</span>
      </div>
      <Toolbar />
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Reseller ID</th>
              <th>Strategic Reseller</th>
              <th>Entity / Region</th>
              <th>Primary Contact</th>
              <th>Open Opportunities</th>
              <th>Assignment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a onClick={() => go("reseller-detail")}>RSL-000284</a>
              </td>
              <td>
                <strong>Nexa Systems CI</strong>
                <small>Strategic · Active</small>
              </td>
              <td>
                AITEK Côte d’Ivoire<small>West Africa</small>
              </td>
              <td>
                Fatou Bamba<small>fatou@nexa.ci</small>
              </td>
              <td>6 · €312,400</td>
              <td>
                <Badge text="Assigned to me" tone="green" />
                <small>01 Jan–31 Dec 2026</small>
              </td>
              <td>
                <button className="small-primary" onClick={() => go("reseller-detail")}>
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td>RSL-000197</td>
              <td>
                <strong>WestTech Ghana</strong>
                <small>Strategic · Active</small>
              </td>
              <td>
                AITEK Ghana<small>West Africa</small>
              </td>
              <td>
                Kwame Mensah<small>kwame@westtech.gh</small>
              </td>
              <td>4 · €228,900</td>
              <td>
                <Badge text="Assigned to me" tone="green" />
                <small>01 Jan–31 Dec 2026</small>
              </td>
              <td>
                <button className="small-primary" onClick={() => go("reseller-detail")}>
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td>RSL-000341</td>
              <td>
                <strong>Digital Afrique SARL</strong>
                <small>Strategic · Active</small>
              </td>
              <td>
                AITEK Sénégal<small>West Africa</small>
              </td>
              <td>
                Aïssatou Ndiaye<small>aissatou@digitalafrique.sn</small>
              </td>
              <td>3 · €164,000</td>
              <td>
                <Badge text="Assigned to me" tone="green" />
                <small>01 Jan–31 Dec 2026</small>
              </td>
              <td>
                <button className="small-primary" onClick={() => go("reseller-detail")}>
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function ResellerDetail({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <div className="record-head">
        <div>
          <button className="back" onClick={() => go("resellers")}>
            ← My Strategic Resellers
          </button>
          <div className="idline">
            <span>RSL-000284</span>
            <Badge text="Strategic · Active" tone="green" />
          </div>
          <h1>Nexa Systems CI</h1>
          <p>AITEK Côte d’Ivoire · Assigned to Aminata Koné for 2026</p>
        </div>
        <div className="record-actions">
          <button className="secondary" onClick={() => go("create-activity")}>
            + Add Activity
          </button>
          <button className="primary" onClick={() => go("create-opportunity")}>
            + Create Opportunity
          </button>
        </div>
      </div>
      <div className="record-grid">
        <div>
          <Panel title="Reseller information">
            <div className="detail-grid">
              <Info label="Reseller ID" value="RSL-000284" />
              <Info label="Primary contact" value="Fatou Bamba" />
              <Info label="Email" value="fatou@nexa.ci" />
              <Info label="Country" value="Côte d’Ivoire" />
              <Info label="Entity" value="AITEK Côte d’Ivoire" />
              <Info label="Credit status" value="Active" />
            </div>
          </Panel>
          <Panel title="Related Opportunities">
            <table className="inner-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Opportunity</th>
                  <th>Stage</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr onClick={() => go("opportunity-detail")}>
                  <td>
                    <a>OPP-2026-00417</a>
                  </td>
                  <td>Cloud & Endpoint Renewal</td>
                  <td>
                    <Badge text="Qualified" tone="blue" />
                  </td>
                  <td>€48,600</td>
                </tr>
                <tr>
                  <td>OPP-2026-00398</td>
                  <td>Endpoint Security Refresh</td>
                  <td>
                    <Badge text="Qualified" tone="blue" />
                  </td>
                  <td>€42,000</td>
                </tr>
              </tbody>
            </table>
          </Panel>
        </div>
        <div>
          <Panel title="Annual assignment">
            <Info label="Assigned KAM" value="Aminata Koné" />
            <Info label="Effective period" value="01 Jan–31 Dec 2026" />
            <Info label="Assigned by" value="Regional Sales Administration" />
          </Panel>
          <Panel title="Recent activities">
            <ul className="timeline">
              <li>
                <b />
                Call · Confirmed renewal scope
                <small>ACT-2026-001271 · Today, 09:40</small>
              </li>
              <li>
                <b />
                Meeting · Quarterly account review
                <small>ACT-2026-001244 · 05 Aug 2026</small>
              </li>
            </ul>
            <button className="linkbtn" onClick={() => go("activities")}>
              View all activities →
            </button>
          </Panel>
        </div>
      </div>
    </>
  );
}

function Activities({ go, activitySaved }: { go: (s: Screen) => void; activitySaved: boolean }) {
  return (
    <>
      <PageHead title="Activities" subtitle="Calls, meetings, emails, tasks and follow-ups owned by Aminata Koné" action="+ Add Activity" onAction={() => go("create-activity")} />
      <div className="metrics small">
        <Metric label="Due Today" value={activitySaved ? "4" : "3"} hint="1 overdue" />
        <Metric label="Upcoming" value="8" hint="Next 7 days" />
        <Metric label="Completed" value="42" hint="This month" />
      </div>
      <Toolbar />
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Activity ID</th>
              <th>Type / Subject</th>
              <th>Related To</th>
              <th>Due</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activitySaved && (
              <tr>
                <td>
                  <a>ACT-2026-001286</a>
                </td>
                <td>
                  <strong>Call</strong>
                  <small>Confirm final technical scope</small>
                </td>
                <td>
                  Nexa Systems CI<small>OPP-2026-00417</small>
                </td>
                <td>12 Aug 2026 · 14:00</td>
                <td>Aminata Koné</td>
                <td>
                  <Badge text="Open" tone="blue" />
                </td>
                <td>
                  <button className="secondary">Complete</button>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <a>ACT-2026-001271</a>
              </td>
              <td>
                <strong>Call</strong>
                <small>Follow up on renewal scope</small>
              </td>
              <td>
                Nexa Systems CI<small>OPP-2026-00417</small>
              </td>
              <td>Today · 14:00</td>
              <td>Aminata Koné</td>
              <td>
                <Badge text="Due today" tone="amber" />
              </td>
              <td>
                <button className="secondary">Complete</button>
              </td>
            </tr>
            <tr>
              <td>
                <a>ACT-2026-001263</a>
              </td>
              <td>
                <strong>Meeting</strong>
                <small>Review technical requirements</small>
              </td>
              <td>
                WestTech Ghana<small>OPP-2026-00409</small>
              </td>
              <td>13 Aug 2026 · 10:30</td>
              <td>Aminata Koné</td>
              <td>
                <Badge text="Scheduled" tone="blue" />
              </td>
              <td>
                <button className="secondary">Edit</button>
              </td>
            </tr>
            <tr>
              <td>
                <a>ACT-2026-001244</a>
              </td>
              <td>
                <strong>Email</strong>
                <small>Send quarterly account summary</small>
              </td>
              <td>Digital Afrique SARL</td>
              <td>05 Aug 2026</td>
              <td>Aminata Koné</td>
              <td>
                <Badge text="Completed" tone="green" />
              </td>
              <td>
                <button className="secondary">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function CreateActivity({ go, save }: { go: (s: Screen) => void; save: () => void }) {
  return (
    <>
      <PageHead title="Add Activity" subtitle="Record a customer interaction, follow-up or next action" />
      <div className="system-id-banner">
        <span>ACTIVITY ID</span>
        <strong>Generated automatically after Save</strong>
        <small>Unique, read-only and searchable. The ID is retained in audit history.</small>
      </div>
      <div className="form-card">
        <SectionTitle n="1" title="Activity information" />
        <div className="form-grid">
          <Field label="Activity type *">
            <select>
              <option>Call</option>
              <option>Meeting</option>
              <option>Email</option>
              <option>Task</option>
              <option>Follow-up</option>
              <option>Note</option>
            </select>
          </Field>
          <Field label="Subject *">
            <input defaultValue="Confirm final technical scope" />
          </Field>
          <Field label="Related record type *">
            <select>
              <option>Strategic Reseller</option>
              <option>Opportunity</option>
              <option>Quote Request</option>
              <option>End User</option>
            </select>
          </Field>
          <Field label="Related record *">
            <select>
              <option>Nexa Systems CI · RSL-000284</option>
              <option>Cloud & Endpoint Renewal · OPP-2026-00417</option>
              <option>Quote Request · QR-2026-01842</option>
            </select>
          </Field>
          <Field label="Due date *">
            <input type="date" defaultValue="2026-08-12" />
          </Field>
          <Field label="Due time">
            <input type="time" defaultValue="14:00" />
          </Field>
          <Field label="Owner · Read-only">
            <input value="Aminata Koné" readOnly />
          </Field>
          <Field label="Status">
            <select>
              <option>Open</option>
              <option>Scheduled</option>
              <option>Completed</option>
            </select>
          </Field>
        </div>
        <Field label="Notes">
          <textarea defaultValue="Confirm device configuration, licence term and delivery location with the reseller." />
        </Field>
        <label className="check">
          <input type="checkbox" defaultChecked /> Set this as the related Opportunity&apos;s Current Next Action
        </label>
        <div className="form-actions">
          <button className="secondary" onClick={() => go("activities")}>
            Cancel
          </button>
          <button className="primary" onClick={save}>
            Save Activity
          </button>
        </div>
      </div>
    </>
  );
}
