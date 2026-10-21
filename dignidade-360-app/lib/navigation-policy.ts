// Pure, dependency-free clinical safety guardrails; no medical severity calculation.
export function navigationPersistenceAllowed(cfg:{
  vercelEnv?:string;nodeEnv?:string;enabled?:string;dbVerified?:string
}) {
  const sandbox=cfg.vercelEnv==='preview'||(!cfg.vercelEnv&&cfg.nodeEnv==='development');
  return sandbox && cfg.enabled==='true' && cfg.dbVerified==='true';
}

export function canWriteNavigation(role:string) {
  return role==='professional';
}

export function validContact(result:string,reportedChange:string,summary:string) {
  if(!['reached','no_answer'].includes(result))return false;
  if(!['not_assessed','unchanged','changed'].includes(reportedChange))return false;
  if(result==='no_answer'&&reportedChange!=='not_assessed')return false;
  if(summary.length>1200)return false;
  if(result==='reached'&&summary.trim().length<12)return false;
  return true;
}

export function validIdempotencyKey(key:string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key);
}

export function parseNavigationDate(date:unknown):Date|null {
  if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;
  const midday=new Date(date+'T12:00:00Z');
  if(Number.isNaN(midday.getTime())||midday.toISOString().slice(0,10)!==date)return null;
  // Initial pilot is in Fortaleza UTC-03; future deployments require organization timezone.
  return new Date(date+'T23:59:59-03:00');
}

const allowed:Record<string,string[]>={
  open:['in_progress','waiting','resolved'],
  in_progress:['waiting','resolved'],
  waiting:['in_progress','resolved'],
  resolved:[]
};
export function canTransitionNavigationTask(from:string,to:string) {
  return !!allowed[from]?.includes(to);
}

export function validTaskOutcome(value:string) {
  return value.trim().length>=12 && value.trim().length<=2000;
}
