import test from 'node:test';
import assert from 'node:assert/strict';
import {seed,metrics,progress,initials} from '../src/lib/orbita-data.ts';
test('datos iniciales mantienen relaciones válidas',()=>{
 const projects=new Set(seed.projects.map(p=>p.id));const members=new Set(seed.members.map(m=>m.userId));
 for(const t of seed.tasks){assert.ok(projects.has(t.projectId));assert.ok(members.has(t.userId));assert.ok(t.hours>=0);}
 for(const p of seed.projects)for(const id of p.memberIds)assert.ok(members.has(id));
 for(const m of seed.members)assert.ok(projects.has(m.projectId));
});
test('resumen se recalcula al completar una tarea',()=>{
 const before=metrics(seed);const task=seed.tasks.find(t=>t.status!=='Completado');
 const changed={...seed,tasks:seed.tasks.map(t=>t.id===task.id?{...t,status:'Completado'}:t)};
 const after=metrics(changed);assert.equal(after.completed,before.completed+1);assert.equal(after.hours,before.hours+task.hours);
});
test('avance maneja proyectos sin tareas y proyectos completos',()=>{assert.equal(progress('empty',seed.tasks),0);assert.equal(progress('p5',seed.tasks),100);});
test('iniciales omiten espacios adicionales',()=>{assert.equal(initials(' María  García '),'MG');});
