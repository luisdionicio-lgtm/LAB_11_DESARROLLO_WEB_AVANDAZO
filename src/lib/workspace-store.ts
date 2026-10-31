'use client';
import { useSyncExternalStore } from 'react';
import { seed, type Workspace } from './orbita-data';
const KEY='orbita-workspace-v1';
let snapshot: Workspace = seed;
let initialized=false;
const listeners=new Set<()=>void>();
let persistenceError='';
function valid(value: unknown): value is Workspace {
 if(!value || typeof value!=='object')return false;
 const w=value as Workspace;
 return w.version===1 && Array.isArray(w.projects) && Array.isArray(w.members) && Array.isArray(w.tasks) && Array.isArray(w.activity) && !!w.settings && w.projects.every(p=>typeof p.id==='string'&&typeof p.name==='string'&&Array.isArray(p.memberIds)) && w.members.every(m=>typeof m.userId==='string'&&typeof m.name==='string') && w.tasks.every(t=>typeof t.id==='string'&&typeof t.hours==='number'&&typeof t.projectId==='string');
}
function emit(){listeners.forEach(l=>l());}
function subscribe(listener:()=>void) {
 listeners.add(listener);
 if(!initialized && typeof window!=='undefined'){
  initialized=true;
  try { const raw=localStorage.getItem(KEY); if(raw){const parsed=JSON.parse(raw);if(valid(parsed))snapshot=parsed;else persistenceError='No pudimos recuperar los datos guardados. Se cargó el ejemplo inicial.';} } catch { persistenceError='El almacenamiento local no está disponible. Los cambios se conservarán durante esta sesión.'; }
  queueMicrotask(emit);
 }
 return ()=>{listeners.delete(listener);};
}
export function useWorkspace(){return useSyncExternalStore(subscribe,()=>snapshot,()=>seed);}
export function storageNotice(){return persistenceError;}
export function commitWorkspace(update:(w:Workspace)=>Workspace,message:string){
 const next=update(snapshot);
 snapshot={...next,activity:[{id:crypto.randomUUID(),text:message,at:new Date().toISOString()},...next.activity].slice(0,15)};
 try {localStorage.setItem(KEY,JSON.stringify(snapshot));persistenceError='';} catch {persistenceError='Los cambios están en memoria; no se pudieron guardar en este navegador.';}
 emit();
}
export const simulateRequest=()=>new Promise<void>(resolve=>setTimeout(resolve,650));
