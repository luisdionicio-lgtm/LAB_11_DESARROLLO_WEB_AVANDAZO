export type ProjectStatus = 'Planificado' | 'En progreso' | 'En revisión' | 'Completado';
export type TaskStatus = 'Pendiente' | 'En progreso' | 'Completado';
export type Priority = 'Baja' | 'Media' | 'Alta' | 'Urgente';
export interface Project { id: string; name: string; description: string; category: string; priority: Priority; status: ProjectStatus; memberIds: string[]; dueDate: string; image: string; color: string; }
export interface Member { userId: string; role: string; name: string; email: string; position: string; birthdate: string; phone: string; projectId: string; isActive: boolean; }
export interface Task { id: string; description: string; projectId: string; status: TaskStatus; priority: Priority; userId: string; dateline: string; hours: number; }
export interface Settings { workspace: string; owner: string; email: string; weeklyGoal: number; notifications: boolean; weeklyDigest: boolean; compact: boolean; reducedMotion: boolean; theme: 'light' | 'dark'; }
export interface Activity { id: string; text: string; at: string; }
export interface Workspace { version: 1; projects: Project[]; members: Member[]; tasks: Task[]; settings: Settings; activity: Activity[]; }
export const categories = ['Desarrollo Web','Desarrollo Mobile','Diseño','Marketing','Otro'];
export const priorities: Priority[] = ['Baja','Media','Alta','Urgente'];
export const projectStatuses: ProjectStatus[] = ['Planificado','En progreso','En revisión','Completado'];
export const taskStatuses: TaskStatus[] = ['Pendiente','En progreso','Completado'];
export const covers = ['/images/comercio.jpg','/images/mobile.jpg','/images/analytics.jpg','/images/api.jpg','/images/design.jpg','/images/marketing.jpg'];
export const seed: Workspace = {
 version:1,
 projects:[
 {id:'p1',name:'E-commerce Platform',description:'Una experiencia de compra que conecta productos y personas. Catálogo, checkout y una nueva identidad digital.',category:'Desarrollo Web',priority:'Alta',status:'En progreso',memberIds:['m1','m2','m5'],dueDate:'2026-11-18',image:covers[0],color:'peach'},
 {id:'p2',name:'Mobile App',description:'Tu día, mejor organizado. Una aplicación móvil diseñada para simplificar lo cotidiano.',category:'Desarrollo Mobile',priority:'Alta',status:'En revisión',memberIds:['m1','m3'],dueDate:'2026-11-22',image:covers[1],color:'lilac'},
 {id:'p3',name:'Dashboard Analytics',description:'Transformamos datos en decisiones claras con un panel de visualización accesible.',category:'Desarrollo Web',priority:'Media',status:'Planificado',memberIds:['m2','m5'],dueDate:'2026-12-04',image:covers[2],color:'mint'},
 {id:'p4',name:'API Gateway',description:'Una base confiable para conectar servicios, automatizar entregas y escalar el producto.',category:'Desarrollo Web',priority:'Urgente',status:'En progreso',memberIds:['m2','m4'],dueDate:'2026-11-12',image:covers[3],color:'blue'},
 {id:'p5',name:'Design System',description:'Un lenguaje visual compartido. Componentes, patrones y decisiones que mantienen al equipo alineado.',category:'Diseño',priority:'Media',status:'Completado',memberIds:['m3','m1'],dueDate:'2026-11-08',image:covers[4],color:'pink'},
 {id:'p6',name:'Marketing Website',description:'La próxima historia de nuestra marca, contada a través de una web rápida y memorable.',category:'Marketing',priority:'Baja',status:'En progreso',memberIds:['m3','m5'],dueDate:'2026-11-30',image:covers[5],color:'sand'}],
 members:[
 {userId:'m1',name:'María García',role:'Desarrolladora',position:'Frontend Developer',email:'maria@example.com',birthdate:'1998-04-12',phone:'+51 900 111 222',projectId:'p1',isActive:true},
 {userId:'m2',name:'Juan Pérez',role:'Desarrollador',position:'Backend Developer',email:'juan@example.com',birthdate:'1997-08-20',phone:'+51 900 222 333',projectId:'p1',isActive:true},
 {userId:'m3',name:'Ana López',role:'Diseñadora',position:'UI/UX Designer',email:'ana@example.com',birthdate:'1999-02-14',phone:'+51 900 333 444',projectId:'p2',isActive:false},
 {userId:'m4',name:'Carlos Ruiz',role:'Ingeniero',position:'DevOps Engineer',email:'carlos@example.com',birthdate:'1996-11-05',phone:'+51 900 444 555',projectId:'p4',isActive:true},
 {userId:'m5',name:'Laura Martínez',role:'Líder de proyecto',position:'Project Manager',email:'laura@example.com',birthdate:'1995-06-28',phone:'+51 900 555 666',projectId:'p6',isActive:true}],
 tasks:[
 {id:'t1',description:'Implementar autenticación',projectId:'p1',status:'En progreso',priority:'Alta',userId:'m1',dateline:'2026-11-15',hours:8},
 {id:'t2',description:'Diseñar pantalla de perfil',projectId:'p2',status:'Pendiente',priority:'Media',userId:'m3',dateline:'2026-11-20',hours:5},
 {id:'t3',description:'Configurar CI/CD',projectId:'p4',status:'Completado',priority:'Alta',userId:'m4',dateline:'2026-11-10',hours:6},
 {id:'t4',description:'Optimizar queries SQL',projectId:'p1',status:'En progreso',priority:'Urgente',userId:'m2',dateline:'2026-11-12',hours:4},
 {id:'t5',description:'Documentar API endpoints',projectId:'p4',status:'Pendiente',priority:'Baja',userId:'m5',dateline:'2026-11-25',hours:3},
 {id:'t6',description:'Definir tokens de color',projectId:'p5',status:'Completado',priority:'Media',userId:'m3',dateline:'2026-11-03',hours:4},
 {id:'t7',description:'Publicar biblioteca de componentes',projectId:'p5',status:'Completado',priority:'Alta',userId:'m1',dateline:'2026-11-08',hours:7},
 {id:'t8',description:'Prototipar navegación móvil',projectId:'p2',status:'Completado',priority:'Alta',userId:'m1',dateline:'2026-11-11',hours:6},
 {id:'t9',description:'Conectar reportes de ventas',projectId:'p3',status:'Pendiente',priority:'Media',userId:'m2',dateline:'2026-11-28',hours:5},
 {id:'t10',description:'Preparar contenido de campaña',projectId:'p6',status:'En progreso',priority:'Media',userId:'m5',dateline:'2026-11-24',hours:3},
 {id:'t11',description:'Revisar checkout responsive',projectId:'p1',status:'Completado',priority:'Alta',userId:'m1',dateline:'2026-11-16',hours:4},
 {id:'t12',description:'Diseñar landing de lanzamiento',projectId:'p6',status:'Pendiente',priority:'Baja',userId:'m3',dateline:'2026-11-27',hours:5}],
 settings:{workspace:'Órbita Studio',owner:'Luis',email:'luis@example.com',weeklyGoal:40,notifications:true,weeklyDigest:true,compact:false,reducedMotion:false,theme:'light'},
 activity:[{id:'a1',text:'María completó la revisión del checkout.',at:'2026-10-31T13:30:00.000Z'},{id:'a2',text:'El equipo publicó los tokens de Design System.',at:'2026-10-31T12:15:00.000Z'},{id:'a3',text:'Carlos configuró la integración continua.',at:'2026-10-30T19:00:00.000Z'}]
};
export function initials(name: string) { return name.split(' ').filter(Boolean).slice(0,2).map(s=>s[0]).join(''); }
export function dateLabel(value: string) { if(!value)return 'Sin fecha'; return new Intl.DateTimeFormat('es-PE',{day:'2-digit',month:'short'}).format(new Date(value+'T12:00:00')); }
export function progress(projectId: string,tasks: Task[]) { const rows=tasks.filter(t=>t.projectId===projectId);return rows.length?Math.round(rows.filter(t=>t.status==='Completado').length/rows.length*100):0; }
export function metrics(w: Workspace) { return {projects:w.projects.length,completed:w.tasks.filter(t=>t.status==='Completado').length,tasks:w.tasks.length,hours:w.tasks.filter(t=>t.status==='Completado').reduce((n,t)=>n+t.hours,0),active:w.members.filter(m=>m.isActive).length}; }
