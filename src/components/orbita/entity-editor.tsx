'use client';
import { useState } from 'react';
import { AlertCircle, CalendarDays, Check, ImageIcon, Plus, Save, UserRound } from 'lucide-react';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { categories, covers, dateLabel, initials, priorities, projectStatuses, taskStatuses, type Member, type Priority, type Project, type ProjectStatus, type Task, type TaskStatus, type Workspace } from '@/lib/orbita-data';
import { commitWorkspace, simulateRequest } from '@/lib/workspace-store';
export type Editor = {kind:'project';item?:Project}|{kind:'member';item?:Member}|{kind:'task';item?:Task};
export function Choice({id,label,value,options,onChange,required=false}:{id:string;label:string;value:string;options:{value:string;label:string}[];onChange:(value:string)=>void;required?:boolean}){
 return <div className="field"><Label htmlFor={id}>{label}{required&&<span className="required">*</span>}</Label><Select value={value} onValueChange={onChange}><SelectTrigger id={id} aria-label={label} className="w-full"><SelectValue placeholder="Seleccionar"/></SelectTrigger><SelectContent>{options.map(o=><SelectItem value={o.value} key={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></div>;
}
export function DateField({id,label,value,onChange,birthday=false}:{id:string;label:string;value:string;onChange:(value:string)=>void;birthday?:boolean}){
 const [open,setOpen]=useState(false);
 const selected=value?new Date(value+'T12:00:00'):undefined;
 return <div className="field"><Label htmlFor={id}>{label}<span className="required">*</span></Label><Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><Button id={id} variant="outline" className="date-trigger"><CalendarDays size={16}/>{selected?`${dateLabel(value)} ${selected.getFullYear()}`:'Selecciona una fecha'}</Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" locale={es} selected={selected} defaultMonth={selected??(birthday?new Date(1998,0,1):new Date())} captionLayout="dropdown" startMonth={new Date(birthday?1920:2020,0)} endMonth={new Date(birthday?new Date().getFullYear():2040,11)} disabled={birthday?{after:new Date()}:undefined} onSelect={day=>{if(day){onChange(`${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`);setOpen(false);}}}/></PopoverContent></Popover></div>;
}
function initial(editor:Editor):Record<string,string>{
 const item=editor.item;
 if(editor.kind==='project'){const p=item as Project|undefined;return {name:p?.name??'',description:p?.description??'',category:p?.category??'',priority:p?.priority??'Media',status:p?.status??'Planificado',dueDate:p?.dueDate??'',image:p?.image??covers[0]};}
 if(editor.kind==='member'){const m=item as Member|undefined;return {name:m?.name??'',email:m?.email??'',role:m?.role??'',position:m?.position??'',birthdate:m?.birthdate??'',phone:m?.phone??'',projectId:m?.projectId||'none'};}
 const t=item as Task|undefined;return {description:t?.description??'',projectId:t?.projectId??'',status:t?.status??'Pendiente',priority:t?.priority??'Media',userId:t?.userId||'none',dateline:t?.dateline??'',hours:String(t?.hours??1)};
}
export function EntityEditor({editor,workspace,onClose,onSaved}:{editor:Editor;workspace:Workspace;onClose:()=>void;onSaved:(text:string)=>void}){
 const [form,setForm]=useState(()=>initial(editor));const [members,setMembers]=useState<string[]>(editor.kind==='project'?editor.item?.memberIds??[]:[]);const [active,setActive]=useState(editor.kind==='member'?editor.item?.isActive??true:true);const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 const editing=!!editor.item;const names={project:'proyecto',member:'integrante',task:'tarea'};const noun=names[editor.kind];
 function set(key:string,value:string){setForm(f=>({...f,[key]:value}));setError('');}
 function field(key:string,label:string,type='text',required=true){return <div className="field"><Label htmlFor={key}>{label}{required&&<span className="required">*</span>}</Label><Input id={key} type={type} value={form[key]} onChange={e=>set(key,e.target.value)} maxLength={key==='description'?500:120} autoComplete="off" required={required}/></div>;}
 const opts=(values:string[])=>values.map(v=>({value:v,label:v}));
 async function submit(e:React.FormEvent){e.preventDefault();setError('');
  const required=editor.kind==='project'?['name','description','category','priority','status','dueDate']:editor.kind==='member'?['name','email','role','position','birthdate','phone']:['description','projectId','status','priority','dateline','hours'];
  if(required.some(k=>!form[k]?.trim())){setError('Completa todos los campos obligatorios antes de guardar.');return;}
  if(editor.kind==='project'&&form.name.trim().length<3){setError('El nombre del proyecto debe tener al menos 3 caracteres.');return;}
  if(editor.kind==='member'){
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){setError('Ingresa un correo electrónico válido.');return;}
   if(workspace.members.some(m=>m.email.toLowerCase()===form.email.trim().toLowerCase()&&m.userId!==(editor.item as Member|undefined)?.userId)){setError('Ya existe un integrante con este correo.');return;}
   if(!/^[+\d\s()-]{7,20}$/.test(form.phone)){setError('Ingresa un teléfono válido, de 7 a 20 caracteres.');return;}
   if(new Date(form.birthdate+'T12:00:00')>new Date()){setError('La fecha de nacimiento no puede estar en el futuro.');return;}
  }
  if(editor.kind==='task'&&(!Number.isFinite(Number(form.hours))||Number(form.hours)<0||Number(form.hours)>1000)){setError('Las horas deben estar entre 0 y 1000.');return;}
  setBusy(true);await simulateRequest();const id=crypto.randomUUID();
  if(editor.kind==='project'){
   const prior=editor.item;const p:Project={id:prior?.id??id,name:form.name.trim(),description:form.description.trim(),category:form.category,priority:form.priority as Priority,status:form.status as ProjectStatus,dueDate:form.dueDate,memberIds:members,image:form.image,color:prior?.color??['peach','lilac','mint','blue','pink','sand'][workspace.projects.length%6]};
   commitWorkspace(w=>({...w,projects:editing?w.projects.map(x=>x.id===p.id?p:x):[...w.projects,p]}),`${editing?'Se actualizó':'Se creó'} el proyecto ${p.name}.`);
  }else if(editor.kind==='member'){
   const prior=editor.item;const m:Member={userId:prior?.userId??id,name:form.name.trim(),email:form.email.trim(),role:form.role.trim(),position:form.position.trim(),birthdate:form.birthdate,phone:form.phone.trim(),projectId:form.projectId==='none'?'':form.projectId,isActive:active};
   commitWorkspace(w=>({...w,members:editing?w.members.map(x=>x.userId===m.userId?m:x):[...w.members,m],projects:w.projects.map(p=>({...p,memberIds:p.id===m.projectId?Array.from(new Set([...p.memberIds,m.userId])):p.id===prior?.projectId?p.memberIds.filter(x=>x!==m.userId):p.memberIds}))}),`${editing?'Se actualizó':'Se incorporó'} a ${m.name}.`);
  }else{
   const prior=editor.item;const t:Task={id:prior?.id??id,description:form.description.trim(),projectId:form.projectId,status:form.status as TaskStatus,priority:form.priority as Priority,userId:form.userId==='none'?'':form.userId,dateline:form.dateline,hours:Number(form.hours)};
   commitWorkspace(w=>({...w,tasks:editing?w.tasks.map(x=>x.id===t.id?t:x):[...w.tasks,t]}),`${editing?'Se actualizó':'Se creó'} la tarea ${t.description}.`);
  }
  onSaved(`${noun[0].toUpperCase()+noun.slice(1)} ${editing?'actualizado':'guardado'} correctamente.`);onClose();
 }
 return <Dialog open onOpenChange={v=>{if(!v&&!busy)onClose();}}><DialogContent className="entity-dialog sm:max-w-[660px]" showCloseButton={!busy}><DialogHeader><div className="dialog-icon">{editor.kind==='member'?<UserRound size={23}/>:<Plus size={23}/>}</div><DialogTitle>{editing?'Editar':editor.kind==='member'?'Nuevo':'Nuevo'} {noun}</DialogTitle><DialogDescription>{editing?'Actualiza la información y guarda los cambios.':'Cada gran resultado empieza con un pequeño paso.'}</DialogDescription></DialogHeader><form onSubmit={submit} noValidate><fieldset disabled={busy} className="editor-fields">
 {editor.kind==='project'&&<>{field('name','Nombre del proyecto')}<div className="field"><Label htmlFor="description">Descripción<span className="required">*</span></Label><Textarea id="description" value={form.description} onChange={e=>set('description',e.target.value)} maxLength={500} rows={3}/></div><div className="form-grid"><Choice id="category" label="Categoría" required value={form.category} onChange={v=>set('category',v)} options={opts(categories)}/><Choice id="priority" label="Prioridad" required value={form.priority} onChange={v=>set('priority',v)} options={opts(priorities)}/><Choice id="status" label="Estado" required value={form.status} onChange={v=>set('status',v)} options={opts(projectStatuses)}/><DateField id="dueDate" label="Fecha de entrega" value={form.dueDate} onChange={v=>set('dueDate',v)}/></div><div className="field"><Label>Miembros del equipo</Label><div className="member-picks">{workspace.members.length?workspace.members.map(m=><label key={m.userId} className="member-pick"><Checkbox checked={members.includes(m.userId)} onCheckedChange={v=>setMembers(xs=>v?[...xs,m.userId]:xs.filter(x=>x!==m.userId))}/><span className="mini-avatar">{initials(m.name)}</span><span>{m.name}</span></label>):<p className="muted">Agrega integrantes desde Equipo.</p>}</div></div><div className="field"><Label><ImageIcon size={15}/>Imagen de referencia</Label><div className="cover-picks">{covers.map((cover,i)=><button type="button" aria-label={`Portada ${i+1}`} aria-pressed={form.image===cover} key={cover} onClick={()=>set('image',cover)} className={form.image===cover?'selected':''} style={{backgroundImage:`url(${cover})`}}>{form.image===cover&&<Check size={16}/>}</button>)}</div></div></>}
 {editor.kind==='member'&&<>{field('name','Nombre completo')}<div className="form-grid">{field('email','Correo electrónico','email')}{field('phone','Teléfono','tel')}{field('role','Rol')}{field('position','Cargo')}<DateField id="birthdate" label="Fecha de nacimiento" birthday value={form.birthdate} onChange={v=>set('birthdate',v)}/><Choice id="projectId" label="Proyecto principal" value={form.projectId} onChange={v=>set('projectId',v)} options={[{value:'none',label:'Sin proyecto'},...workspace.projects.map(p=>({value:p.id,label:p.name}))]}/></div><label className="switch-row"><span><strong>Integrante activo</strong><small>Su estado se refleja en las métricas del resumen.</small></span><Switch checked={active} onCheckedChange={setActive} aria-label="Integrante activo"/></label></>}
 {editor.kind==='task'&&<><div className="field"><Label htmlFor="description">Descripción de la tarea<span className="required">*</span></Label><Textarea id="description" value={form.description} onChange={e=>set('description',e.target.value)} rows={3} maxLength={500}/></div><div className="form-grid"><Choice id="projectId" label="Proyecto" required value={form.projectId} onChange={v=>set('projectId',v)} options={workspace.projects.map(p=>({value:p.id,label:p.name}))}/><Choice id="userId" label="Responsable" value={form.userId} onChange={v=>set('userId',v)} options={[{value:'none',label:'Sin asignar'},...workspace.members.map(m=>({value:m.userId,label:m.name}))]}/><Choice id="status" label="Estado" required value={form.status} onChange={v=>set('status',v)} options={opts(taskStatuses)}/><Choice id="priority" label="Prioridad" required value={form.priority} onChange={v=>set('priority',v)} options={opts(priorities)}/><DateField id="dateline" label="Fecha límite" value={form.dateline} onChange={v=>set('dateline',v)}/>{field('hours','Horas estimadas','number')}</div><p className="form-hint">Las horas se suman al resumen cuando la tarea está completada.</p></>}
 </fieldset>{error&&<Alert variant="destructive" className="validation-alert"><AlertCircle/><AlertTitle>Revisa la información</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}<div className="dialog-actions"><Button type="button" variant="outline" onClick={onClose} disabled={busy}>Cancelar</Button><Button type="submit" disabled={busy}>{busy?<Spinner/>:<Save size={16}/>} {busy?'Guardando…':editing?'Guardar cambios':`Crear ${noun}`}</Button></div></form></DialogContent></Dialog>;
}
