export type Role = "KAM" | "IST" | "DESK_MANAGER" | "REGIONAL_MANAGER";
export type Reseller = { id:string; name:string; type:"Strategic"|"New"; country:string; status:"Active"|"Onboarding"; kam:string; contact?:string; email?:string; phone?:string; address?:string };
export type Activity = { id:string; opportunityId:string; date:string; kam:string; region:string; country:string; resellerId:string; activityType:string; interactionMode:string; duration:number; contact:string; decisionLevel:string; subject:string; vendor:string; businessUnit:string; notes:string };
export type Opportunity = {
  id:string; name:string; resellerId:string; owner:string; regionalDirector:string; insideSales?:string; country:string;
  source:string; businessUnit:string; vendor:string; description:string; opportunityType:string; stage:string;
  projectBased?:boolean; projectMarkedByRole?:"KAM"|"DEAL_MANAGER"; projectMarkedBy?:string; projectMarkedAt?:string; projectJustification?:string;
  primaryBlockage?:string; probability:number; amount?:number; currency?:string; weightedPipeline:number;
  createdDate:string; lastActivityDate?:string; expectedCloseDate?:string; actualCloseDate?:string;
  nextAction:string; nextDate:string; nextActionDescription:string; risk:string; riskType?:string; comments?:string;
  status:"Active"|"Draft"|"Won"|"Lost"|"Dormant"|"Disqualified"; lostReason?:string; competitor?:string;
};
export type QuoteRequest = { id:string; opportunityId:string; resellerId:string; products:string; quantity:number; status:string; source:"KAM"|"AITEKCenter"|"Outlook / Email"; receivedAt:string; pickupSlaMinutes:number; assignedTo?:string; assignmentHistory?:Array<{from?:string;to:string;reason:string;changedBy:string;changedAt:string}>; classification?:"Standard"|"Complex"|"Tender"; systemClassification?:"Standard"|"Complex"|"Tender"; classificationTriggers?:string[]; classificationOverrideReason?:string; classifiedAt?:string; classificationHistory?:Array<{from?:string;to:string;reason:string;changedBy:string;changedAt:string}>; slaModel?:"Standard issuance"|"Complex qualification"|"Tender governance"; quoteSlaDueAt?:string; qualificationDueAt?:string; targetDeliveryAt?:string; targetDeliveryJustification?:string; tenderOwnerConfirmed?:boolean; tenderResponsePlan?:string; tenderSubmissionDeadline?:string; blocked?:string; version:number; offlineAcceptance?:{recordedBy:string;recordedByRole:"KAM"|"IST"|"DESK_MANAGER";receivedFrom:string;confirmationMode:string;paymentReference:string;proofFileName:string;amount:string;notes:string;recordedAt:string}; orderOnBehalf?:{placedBy:string;placedByRole:"IST"|"DESK_MANAGER";reason:string;authoritySource:string;placedAt:string} };

export const users: Record<Role,{name:string;title:string}> = {
  KAM:{name:"Aminata Koné",title:"Key Account Manager"},
  IST:{name:"Yamin Shaikh",title:"Inside Sales Team"},
  DESK_MANAGER:{name:"Nadia Mensah",title:"IST Desk Manager"},
  REGIONAL_MANAGER:{name:"Koffi Traoré",title:"Regional Manager"},
};

export const seedResellers:Reseller[] = [
  {id:"RES-00241",name:"ABC Technologies",type:"Strategic",country:"Côte d’Ivoire",status:"Active",kam:"Aminata Koné",contact:"Fatou Diarra",email:"fatou@abctech.ci",phone:"+225 07 00 00 00 01"},
  {id:"RES-00319",name:"Delta Distribution",type:"Strategic",country:"Senegal",status:"Active",kam:"Aminata Koné",contact:"Moussa Ndiaye",email:"moussa@delta.sn",phone:"+221 77 000 00 02"},
];

export const seedOpportunities:Opportunity[] = [
  {id:"OPP-2026-0152",name:"Microsoft Licence Renewal",resellerId:"RES-00241",owner:"Aminata Koné",regionalDirector:"Koffi Traoré",insideSales:"Yamin Shaikh",country:"Côte d’Ivoire",source:"Renewal",businessUnit:"Infra & Cloud",vendor:"Microsoft",description:"Renewal of Microsoft licences for the reseller's enterprise customer.",opportunityType:"Renewal licences",stage:"Negotiation",probability:75,amount:180000,currency:"EUR",weightedPipeline:135000,createdDate:"2026-08-03",lastActivityDate:"2026-08-16",expectedCloseDate:"2026-09-15",nextAction:"Customer call",nextDate:"2026-08-20",nextActionDescription:"Confirm final quantity and PO timing",risk:"Medium",riskType:"Commercial",comments:"Strategic renewal",status:"Active"},
  {id:"OPP-2026-0149",name:"Cloud Expansion",resellerId:"RES-00319",owner:"Aminata Koné",regionalDirector:"Koffi Traoré",country:"Senegal",source:"Upsell",businessUnit:"Infra & Cloud",vendor:"Microsoft",description:"Draft opportunity for cloud capacity expansion.",opportunityType:"Capacity extension",stage:"",probability:0,weightedPipeline:0,createdDate:"2026-08-12",nextAction:"",nextDate:"",nextActionDescription:"",risk:"Not assessed",status:"Draft"},
];

export const seedActivities:Activity[] = [
  {id:"ACT-2026-0041",opportunityId:"OPP-2026-0152",date:"2026-08-16",kam:"Aminata Koné",region:"DR CI & WEST",country:"Côte d’Ivoire",resellerId:"RES-00241",activityType:"Customer call",interactionMode:"Telephone",duration:0.5,contact:"IT Manager",decisionLevel:"Influencer",subject:"Licence renewal",vendor:"Microsoft",businessUnit:"Infra & Cloud",notes:"Customer confirmed quantities; PO timing remains to be confirmed."},
];

export const seedQuotes:QuoteRequest[] = [
  {id:"QR-2026-00820",opportunityId:"OPP-2026-0152",resellerId:"RES-00241",products:"Microsoft 365 Business Premium",quantity:100,status:"Published",source:"KAM",receivedAt:"2026-08-18T08:20:00",pickupSlaMinutes:0,assignedTo:"Yamin Shaikh",classification:"Standard",version:2},
  {id:"QR-2026-00841",opportunityId:"OPP-2026-0152",resellerId:"RES-00241",products:"Microsoft 365 Business Premium",quantity:100,status:"In IST Pool",source:"KAM",receivedAt:"2026-08-18T09:10:00",pickupSlaMinutes:12,version:0},
  {id:"QR-2026-00842",opportunityId:"OPP-2026-0149",resellerId:"RES-00319",products:"APC UPS — specification to confirm",quantity:20,status:"In IST Pool",source:"Outlook / Email",receivedAt:"2026-08-18T08:42:00",pickupSlaMinutes:-6,version:0},
  {id:"QR-2026-00843",opportunityId:"OPP-2026-0152",resellerId:"RES-00241",products:"HP ProBook laptops",quantity:25,status:"In IST Pool",source:"AITEKCenter",receivedAt:"2026-08-18T09:24:00",pickupSlaMinutes:26,version:0},
];

export const stages=["Lead Identified","Qualification","Quote Sent","Negotiation","Customer Decision","Won","Lost","Dormant","Disqualified"];
export const stageProbability:Record<string,number>={"Lead Identified":10,"Identified":10,"Qualification":25,"Quote Requested":40,"Quote In Progress":50,"Quote Sent":60,"Customer Review":70,"Negotiation":75,"Customer Decision":90,"PO Expected":90,"Won":100,"Won Pending Invoice":100,"Invoiced":100,"Recovered / Paid":100,"Lost":0,"Dormant":0,"Disqualified":0};
export const leadSources=["Cross-sell","Inbound","New","Renewal","Tender","Upsell","Vendor lead"];
export const businessUnits=["HP","Cyber","Device & Print","Energy","Infra & Cloud"];
export const vendors=["Acronis","Altair","Allot","APC","Arista","Afristorm","Asus","BeyondTrust","Canon","D-Link","Epson","Exabeam","Gatewatcher","HP","HYCU","Infoblox","Kaspersky","Lenovo","Lenovo ISG","Microsoft","Nitram","Nutanix","PRTG","Qualys","Symantec","Transcend","Tufin","Ubika","Varonis","Veritas","Wallix","Whalebone"];
export const currencies=["EUR","AED","MAD","USD","XOF"];
export const opportunityTypes=["Renewal licences","Renewal support","Upsell client existant","Cross-sell solution","Nouveau projet client existant","New","Upgrade infrastructure","Extension capacité","Projet cybersécurité","Projet datacenter","Projet cloud / virtualisation","Projet réseau","Projet énergie / UPS"];
export const nextActions=["Customer qualification","Technical-need qualification","Budget / timing qualification","Customer call","Customer follow-up","Customer meeting","Solution demo / presentation","Prepare proposal","Internal pricing validation","Technical / architecture validation","Vendor validation","Send quotation","Revise quotation","Commercial negotiation","Await customer decision","Follow up customer decision","Administrative closing","Prepare order","Prepare deployment","Upsell / opportunity extension"];
export const riskLevels=["Not assessed","Low","Medium","High","Critical"];
export const riskTypes=["Commercial","Financial","Logistics"];
export const activityTypes=["Customer visit","Customer call","Customer meeting","Solution demo","Prospecting","Vendor meeting","Partner meeting","Event / trade show"];
export const interactionModes=["In person","Video call","Telephone"];
export const decisionLevels=["Decision maker","Influencer","Technical","Procurement"];
export const activitySubjects=["Outbound","AITEK presentation","Cybersecurity project","Licence renewal","Pipeline follow-up","Infrastructure upgrade"];
export const lostReasons=["Price","Competitor","Budget","Delay","No decision","Wrong specification","Stock issue","Vendor issue","Customer cancellation"];
