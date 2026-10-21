// Behavioral tests independent of EHR and database. Run on every pull request.
require('ts-node').register({transpileOnly:true,compilerOptions:{module:'CommonJS',moduleResolution:'node'}});
const test=require('node:test');
const assert=require('node:assert/strict');
const p=require('../lib/navigation-policy.ts');

test('production and non-verified environments always block persistence',()=>{
  assert.equal(p.navigationPersistenceAllowed({vercelEnv:'production',enabled:'true',dbVerified:'true'}),false);
  assert.equal(p.navigationPersistenceAllowed({vercelEnv:'preview',enabled:'true',dbVerified:'false'}),false);
  assert.equal(p.navigationPersistenceAllowed({vercelEnv:'preview',enabled:'true',dbVerified:'true'}),true);
  assert.equal(p.navigationPersistenceAllowed({nodeEnv:'development',enabled:'true',dbVerified:'true'}),true);
  assert.equal(p.navigationPersistenceAllowed({nodeEnv:'production',enabled:'true',dbVerified:'true'}),false);
});

test('only professionals may write operational navigation',()=>{
  for(const role of ['admin','manager','patient','caregiver','unknown'])assert.equal(p.canWriteNavigation(role),false);
  assert.equal(p.canWriteNavigation('professional'),true);
});

test('no answer is always unassessed regardless of client input',()=>{
  assert.equal(p.validContact('no_answer','changed',''),false);
  assert.equal(p.validContact('no_answer','unchanged',''),false);
  assert.equal(p.validContact('no_answer','not_assessed',''),true);
});

test('contact with answer must contain genuine explanatory summary',()=>{
  assert.equal(p.validContact('reached','changed',''),false);
  assert.equal(p.validContact('reached','unchanged','Breve'),false);
  assert.equal(p.validContact('reached','changed','Relatou mudança e revisão humana pendente.'),true);
  assert.equal(p.validContact('reached','not_assessed','Registro de conversa e contexto adequado.'),true);
  assert.equal(p.validContact('invalid','unchanged','Registro adequado e suficiente'),false);
});

test('action cannot be reopened or silently marked done',()=>{
  assert.equal(p.canTransitionNavigationTask('open','in_progress'),true);
  assert.equal(p.canTransitionNavigationTask('open','resolved'),true);
  assert.equal(p.canTransitionNavigationTask('in_progress','open'),false);
  assert.equal(p.canTransitionNavigationTask('resolved','in_progress'),false);
  assert.equal(p.canTransitionNavigationTask('waiting','in_progress'),true);
  assert.equal(p.validTaskOutcome('ok'),false);
  assert.equal(p.validTaskOutcome('Resultado confirmado e documentado.'),true);
});

test('calendar dates are real and honor agreed local end of day',()=>{
  assert.equal(p.parseNavigationDate('2026-02-30'),null);
  assert.equal(p.parseNavigationDate('2026-13-01'),null);
  assert.equal(p.parseNavigationDate('2026-10-20T08:00Z'),null);
  assert.equal(p.parseNavigationDate('2026-10-20')?.toISOString(),'2026-10-21T02:59:59.000Z');
});

test('idempotency token requires real UUID v4 syntax',()=>{
  assert.equal(p.validIdempotencyKey('0'.repeat(36)),false);
  assert.equal(p.validIdempotencyKey('123e4567-e89b-42d3-a456-426614174000'),true);
  assert.equal(p.validIdempotencyKey('123e4567-e89b-12d3-a456-426614174000'),false);
});
