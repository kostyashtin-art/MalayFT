import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Home,Bath,Boxes,Warehouse,FileText,Users,Settings,Search,ChevronRight,Truck,Building2,Hammer,Save,Printer,ArrowLeft,Sparkles,CheckCircle2,AlertTriangle} from 'lucide-react';
import {catalog} from './catalog';
import type {Project} from './types';
import './styles.css';

const money=(n:number)=>new Intl.NumberFormat('ru-RU').format(Math.round(n))+' ₽';
const save=(k:string,v:any)=>localStorage.setItem(k,JSON.stringify(v));
const load=(k:string,d:any)=>{try{return JSON.parse(localStorage.getItem(k)||'')??d}catch{return d}};

type Quote={id:string;kind:string;client:any;project:string;base:number;items:any[];external:any;total:number;createdAt:string;notes:string};

function App(){
 const [page,setPage]=useState<'catalog'|'config'|'custom'|'quotes'|'clients'|'settings'|'quote'>('catalog');
 const [tab,setTab]=useState<'houses'|'baths'|'complexes'>('houses'); const [q,setQ]=useState(''); const [project,setProject]=useState<Project|null>(null); const [kind,setKind]=useState<'ready'|'custom'|'complex'>('ready');
 const [selected,setSelected]=useState<string[]>([]); const [client,setClient]=useState({name:'',phone:'',email:'',city:'',address:''});
 const [external,setExternal]=useState({delivery:0,foundation:0,montage:0}); const [deliveryMode,setDeliveryMode]=useState('manual'); const [foundationMode,setFoundationMode]=useState('none'); const [montageMode,setMontageMode]=useState('manual');
 const [custom,setCustom]=useState({name:'Индивидуальный проект',base:0,area:'',modules:'1',length:'',width:'',height:'2700',rooms:'',color:'',notes:''});
 const [quotes,setQuotes]=useState<Quote[]>(()=>load('dp_quotes',[])); const [clients,setClients]=useState<any[]>(()=>load('dp_clients',[]));
 const projects=useMemo(()=>tab==='complexes'?[]:catalog.projects.filter(p=>{const type=catalog.families.find(f=>f.id===p.family)?.type;return type===(tab==='houses'?'house':'bath') && (!q||p.name.toLowerCase().includes(q.toLowerCase()))}),[tab,q]);
 const complexes=useMemo(()=>catalog.complexes.filter(x=>!q||x.name.toLowerCase().includes(q.toLowerCase())),[q]);
 const base=kind==='ready'?(project?.price||0):kind==='complex'?((catalog.complexes.find(x=>project?.id===x.id) as any)?.price||0):Number(custom.base||0);
 const optionTotal=selected.reduce((s,id)=>s+(catalog.options.find(o=>o.id===id)?.price||0),0); const total=base+optionTotal+external.delivery+external.foundation+external.montage;
 const choose=(p:Project)=>{setProject(p);setKind('ready');setSelected([]);setPage('config');setDeliveryMode('manual');setFoundationMode('none');setMontageMode('manual');setExternal({delivery:0,foundation:0,montage:0})};
 const chooseComplex=(c:any)=>{setProject({...c,family:'complex',dimensions:c.dimensions} as any);setKind('complex');setSelected([]);setPage('config');setExternal({delivery:0,foundation:0,montage:0})};
 const goCustom=()=>{setKind('custom');setProject(null);setPage('custom');setSelected([])};
 const newCalc=()=>{setPage('catalog');setProject(null);setKind('ready');setSelected([]);setExternal({delivery:0,foundation:0,montage:0});setClient({name:'',phone:'',email:'',city:'',address:''});setCustom({...custom,name:'Индивидуальный проект',base:0,area:'',modules:'1',length:'',width:'',height:'2700',rooms:'',color:'',notes:''})};
 const applyDelivery=(v:string)=>{setDeliveryMode(v); const prices:{[k:string]:number}={kp:230000}; setExternal(e=>({...e,delivery:prices[v]||0}))};
 const applyFoundation=(v:string)=>{setFoundationMode(v); const prices:{[k:string]:number}={screw:220000}; setExternal(e=>({...e,foundation:prices[v]||0}))};
 const applyMontage=(v:string)=>{setMontageMode(v); setExternal(e=>({...e,montage:v==='free70'?0:v==='kp'?300000:0}))};
 const storeQuote=()=>{const quote:Quote={id:`DP-${Date.now()}`,kind,client,project:kind==='custom'?custom.name:(project?.name||''),base,items:selected.map(id=>catalog.options.find(o=>o.id===id)).filter(Boolean),external, total,createdAt:new Date().toISOString(),notes:kind==='custom'?custom.notes:''};const next=[quote,...quotes];setQuotes(next);save('dp_quotes',next);setPage('quotes')};
 const addClient=()=>{const c={...client,id:Date.now()};const next=[c,...clients];setClients(next);save('dp_clients',next)};
 return <div className="app"><header><div className="brand">DP <span>MODULE</span><small>SALES CONFIGURATOR</small></div><div className="top-actions"><span className="db"><i/> Данные каталога загружены</span><button className="darkbtn" onClick={newCalc}>+ Новый расчёт</button></div></header>
 <aside className="sidebar"><Nav icon={<Home/>} label="Каталог" active={['catalog','config','custom'].includes(page)} onClick={()=>setPage('catalog')}/><Nav icon={<Sparkles/>} label="Свой проект" active={page==='custom'} onClick={goCustom}/><Nav icon={<FileText/>} label="КП" active={['quote','quotes'].includes(page)} onClick={()=>setPage('quotes')}/><Nav icon={<Users/>} label="Клиенты" active={page==='clients'} onClick={()=>setPage('clients')}/><div className="side-sep">Система</div><Nav icon={<Settings/>} label="Настройки" active={page==='settings'} onClick={()=>setPage('settings')}/><div className="source-note"><span>Нулевая версия</span><b>Цены проектов — из каталога PDF</b><b>Опции/логистика — только из КП, где есть точная сумма</b></div></aside>
 <main>
 {page==='catalog'&&<CatalogPage tab={tab} setTab={setTab} q={q} setQ={setQ} projects={projects} complexes={complexes} families={catalog.families} onChoose={choose} onComplex={chooseComplex} goCustom={goCustom}/>} 
 {page==='custom'&&<CustomPage custom={custom} setCustom={setCustom} onNext={()=>setPage('config')}/>} 
 {page==='config'&&<ConfigPage kind={kind} project={project} custom={custom} selected={selected} setSelected={setSelected} client={client} setClient={setClient} external={external} setExternal={setExternal} deliveryMode={deliveryMode} foundationMode={foundationMode} montageMode={montageMode} applyDelivery={applyDelivery} applyFoundation={applyFoundation} applyMontage={applyMontage} total={total} onSave={storeQuote} onQuote={()=>setPage('quote')}/>} 
 {page==='quote'&&<QuotePage kind={kind} project={project} custom={custom} selected={selected} client={client} external={external} base={base} total={total} onBack={()=>setPage('config')}/>} 
 {page==='quotes'&&<QuotesPage quotes={quotes}/>} 
 {page==='clients'&&<ClientsPage clients={clients} setClients={setClients} client={client} setClient={setClient} addClient={addClient}/>} 
 {page==='settings'&&<SettingsPage/>}
 </main></div>;
}
function Nav({icon,label,active,onClick}:{icon:any;label:string;active:boolean;onClick:()=>void}){return <button className={'nav '+(active?'active':'')} onClick={onClick}>{icon}<span>{label}</span></button>}
function CatalogPage({tab,setTab,q,setQ,projects,complexes,families,onChoose,onComplex,goCustom}:{tab:any;setTab:any;q:string;setQ:any;projects:Project[];complexes:any[];families:any[];onChoose:any;onComplex:any;goCustom:any}){const fams=families.filter(f=>tab==='complexes'?false:f.type===(tab==='houses'?'house':'bath'));return <><div className="herohead"><div><div className="eyebrow">КАТАЛОГ DP MODULE</div><h1>Готовые решения и точные цены</h1><p>Проекты перенесены из загруженного каталога. Нажмите «Собрать КП», чтобы перейти к комплектации.</p></div><div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Найти модель…"/></div></div><div className="tabs"><button className={tab==='houses'?'on':''} onClick={()=>setTab('houses')}><Home/>Дома</button><button className={tab==='baths'?'on':''} onClick={()=>setTab('baths')}><Bath/>Бани</button><button className={tab==='complexes'?'on':''} onClick={()=>setTab('complexes')}><Boxes/>Готовые комплексы</button><button className="customtab" onClick={goCustom}><Sparkles/>Свой проект</button></div>{tab!=='complexes'&&<div className="families">{fams.map(f=><button className="family" key={f.id} onClick={()=>setQ(f.name)}><img src={f.cover}/><span>{f.name}</span><small>от {money(f.from)}</small></button>)}</div>}<div className="section-title-row"><div><b>{tab==='complexes'?'Готовые комплексы':tab==='houses'?'Модульные дома':'Модульные бани'}</b><span>{(tab==='complexes'?complexes:projects).length} решений</span></div></div>{tab==='complexes'?<div className="grid">{complexes.map(c=><article className="card" key={c.id}><img src={c.cover}/><div className="card-body"><div className="eyebrow">КОМПЛЕКС</div><h3>{c.name}</h3><div className="meta">{c.area?`${c.area} м²`:'проект'} · {c.dimensions}</div><strong>{money(c.price)}</strong><button className="primary" onClick={()=>onComplex(c)}>Собрать КП <ChevronRight/></button></div></article>)}</div>:<div className="grid">{projects.map(p=><ProjectCard key={p.id} p={p} onChoose={onChoose} familyCover={families.find(f=>f.id===p.family)?.cover}/>)}</div>}</>}
function ProjectCard({p,onChoose,familyCover}:{p:Project;onChoose:any;familyCover?:string}){return <article className="card"><img src={familyCover||`./assets/plan-${p.page}.png`} /><div className="card-body"><div className="eyebrow">ГОТОВЫЙ ПРОЕКТ</div><h3>{p.name}</h3><div className="meta"><span>{p.area} м²</span><span>{p.dimensions}</span></div><strong>{money(p.price)}</strong><button className="primary" onClick={()=>onChoose(p)}>Собрать КП <ChevronRight/></button></div></article>}
function CustomPage({custom,setCustom,onNext}:{custom:any;setCustom:any;onNext:()=>void}){return <><div className="herohead"><div><div className="eyebrow">ИНДИВИДУАЛЬНОЕ ПРОЕКТИРОВАНИЕ</div><h1>Свой дом под клиента</h1><p>Всё, чего нет в утверждённом прайсе, не рассчитывается «из головы»: менеджер вводит согласованную цену или ставит статус «требует расчёта».</p></div></div><div className="form-card"><div className="section-title">Габариты и планировка</div><div className="fields"><Field label="Название проекта"><input value={custom.name} onChange={e=>setCustom({...custom,name:e.target.value})}/></Field><Field label="Базовая стоимость, ₽"><input type="number" value={custom.base} onChange={e=>setCustom({...custom,base:+e.target.value})}/></Field><Field label="Площадь, м²"><input value={custom.area} onChange={e=>setCustom({...custom,area:e.target.value})}/></Field><Field label="Модулей"><input type="number" min="1" value={custom.modules} onChange={e=>setCustom({...custom,modules:e.target.value})}/></Field><Field label="Длина"><input value={custom.length} onChange={e=>setCustom({...custom,length:e.target.value})}/></Field><Field label="Ширина"><input value={custom.width} onChange={e=>setCustom({...custom,width:e.target.value})}/></Field><Field label="Высота, мм"><input value={custom.height} onChange={e=>setCustom({...custom,height:e.target.value})}/></Field><Field label="Комнаты"><input value={custom.rooms} onChange={e=>setCustom({...custom,rooms:e.target.value})}/></Field><Field label="Цвет фасада"><input value={custom.color} onChange={e=>setCustom({...custom,color:e.target.value})}/></Field></div><Field label="Пожелания клиента"><textarea value={custom.notes} onChange={e=>setCustom({...custom,notes:e.target.value})}/></Field><div className="notice warn"><AlertTriangle/> Индивидуальные габариты, фундамент и нестандартная конструкция требуют подтверждения конструктора. Автоматический расчёт применяется только к тем тарифам, которые подтверждены документами.</div><button className="primary" onClick={onNext}>Продолжить к комплектации <ChevronRight/></button></div></>}
function Field({label,children}:{label:string;children:any}){return <label className="field"><span>{label}</span>{children}</label>}
function ConfigPage({kind,project,custom,selected,setSelected,client,setClient,external,setExternal,deliveryMode,foundationMode,montageMode,applyDelivery,applyFoundation,applyMontage,total,onSave,onQuote}:{kind:any;project:any;custom:any;selected:string[];setSelected:any;client:any;setClient:any;external:any;setExternal:any;deliveryMode:string;foundationMode:string;montageMode:string;applyDelivery:any;applyFoundation:any;applyMontage:any;total:number;onSave:any;onQuote:any}):React.ReactElement{
 const base=kind==='ready'?(project?.price||0):kind==='complex'?(project?.price||0):Number(custom.base||0);
 const title=kind==='ready'||kind==='complex'?project?.name:custom.name;
 const subtitle=kind==='ready'?`${project?.area} м² · ${project?.dimensions} · база ${money(base)}`:kind==='complex'?`${project?.area||'—'} м² · база ${money(base)}`:`${custom.modules} мод. · ${custom.area||'—'} м² · индивидуальный расчёт`;
 return <>
  <div className="herohead">
   <div><button className="back" onClick={()=>history.back()}><ArrowLeft/> Назад</button><div className="eyebrow">КОНФИГУРАТОР</div><h1>{title}</h1><p>{subtitle}</p></div>
  </div>
  <div className="config-layout">
   <div>
    <section className="form-card">
     <div className="section-title">Клиент</div>
     <div className="fields">
      <Field label="ФИО"><input value={client.name} onChange={e=>setClient({...client,name:e.target.value})}/></Field>
      <Field label="Телефон"><input value={client.phone} onChange={e=>setClient({...client,phone:e.target.value})}/></Field>
      <Field label="E-mail"><input value={client.email} onChange={e=>setClient({...client,email:e.target.value})}/></Field>
      <Field label="Город"><input value={client.city} onChange={e=>setClient({...client,city:e.target.value})}/></Field>
      <Field label="Адрес участка"><input value={client.address} onChange={e=>setClient({...client,address:e.target.value})}/></Field>
     </div>
    </section>
    <section className="form-card">
     <div className="section-title">Дополнительные опции из подтверждённых документов</div>
     {catalog.options.map(o=><label className="opt" key={o.id}>
      <span><input type="checkbox" checked={selected.includes(o.id)} onChange={()=>setSelected((prev:string[])=>prev.includes(o.id)?prev.filter(x=>x!==o.id):[...prev,o.id])}/><b>{o.name}</b><small>{o.group} · {o.calc} · {o.source}</small></span>
      <strong>{money(o.price)}</strong>
     </label>)}
    </section>
   </div>
   <div>
    <section className="form-card">
     <div className="section-title">Доставка</div>
     <select value={deliveryMode} onChange={e=>applyDelivery(e.target.value)}>
      <option value="manual">Не выбрана / ввести вручную</option>
      <option value="kp">230 000 ₽ — как в эталонном КП «Модерн 60»</option>
      <option value="unknown">Городской тариф отсутствует в загруженных документах</option>
     </select>
     {deliveryMode==='manual'&&<input className="moneyinput" type="number" placeholder="Введите согласованную сумму" value={external.delivery||''} onChange={e=>setExternal({...external,delivery:Number(e.target.value)})}/>} 
     <div className="note">По загруженным документам отдельной таблицы «город → доставка» нет. Поэтому городские тарифы не придуманы.</div>
    </section>
    <section className="form-card">
     <div className="section-title">Фундамент</div>
     <select value={foundationMode} onChange={e=>applyFoundation(e.target.value)}>
      <option value="none">Не выбран</option>
      <option value="screw">220 000 ₽ — свайно-винтовой, пример из КП «Модерн 60»</option>
      <option value="existing">Существующий — 0 ₽ в расчёте дома</option>
      <option value="fbs">ФБС — цена в загруженных документах не указана</option>
      <option value="reinforce">Локальное усиление — стоимость по расчёту КР</option>
     </select>
     {foundationMode==='none'&&<div className="note">В индивидуальном КП «Канада 24» существующий фундамент потребовал 2 дополнительных винтовых свай; их параметры должны назначаться по грунтам и расчёту КР.</div>}
    </section>
    <section className="form-card">
     <div className="section-title">Монтаж</div>
     <select value={montageMode} onChange={e=>applyMontage(e.target.value)}>
      <option value="manual">Не выбран / ввести вручную</option>
      <option value="free70">0 ₽ — бесплатная установка и монтаж до 70 км от производства в Екатеринбурге и Новосибирске</option>
      <option value="kp">300 000 ₽ — как в эталонном КП «Модерн 60»</option>
     </select>
     {montageMode==='manual'&&<input className="moneyinput" type="number" placeholder="Введите согласованную сумму" value={external.montage||''} onChange={e=>setExternal({...external,montage:Number(e.target.value)})}/>} 
    </section>
    <section className="form-card actions"><button className="primary full" onClick={onSave}><Save/> Сохранить КП</button><button className="secondary full" onClick={onQuote}><Printer/> Предпросмотр КП</button></section>
   </div>
  </div>
 </>;
}
function QuotePage({kind,project,custom,selected,client,external,base,total,onBack}:{kind:any;project:any;custom:any;selected:string[];client:any;external:any;base:number;total:number;onBack:any}){const opts=selected.map(id=>catalog.options.find(o=>o.id===id)).filter(Boolean);return <div className="quote-screen"><div className="quote-toolbar"><button className="secondary" onClick={onBack}><ArrowLeft/> Вернуться</button><button className="primary" onClick={()=>window.print()}><Printer/> Печать / PDF</button></div><article className="quote"><section className="qcover"><div className="qlogo">DP <b>MODULE</b></div><div><div className="eyebrow">КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</div><h1>{kind==='custom'?custom.name:project?.name}</h1><p>{kind==='custom'?'Индивидуальное предложение':kind==='complex'?'Готовый комплекс':'Индивидуальная комплектация'}</p></div><div><small>СТОИМОСТЬ ПО ТЕКУЩЕМУ РАСЧЁТУ</small><strong>{money(total)}</strong></div></section><section><div className="qeyebrow">01 / КОНФИГУРАЦИЯ</div><h2>Параметры проекта</h2><div className="qgrid"><div><b>Клиент</b><span>{client.name||'—'}</span></div><div><b>Телефон</b><span>{client.phone||'—'}</span></div><div><b>Площадь</b><span>{kind==='custom'?custom.area||'—':project?.area?project.area+' м²':'—'}</span></div><div><b>Модулей</b><span>{kind==='custom'?custom.modules:'по проекту'}</span></div></div></section><section><div className="qeyebrow">02 / СМЕТА</div><h2>Согласованные позиции</h2><table><tbody><tr><td>Базовая комплектация</td><td>{money(base)}</td></tr>{opts.map((o:any)=><tr key={o.id}><td>{o.name}<small>{o.calc}</small></td><td>{money(o.price)}</td></tr>)}{external.delivery>0&&<tr><td>Доставка</td><td>{money(external.delivery)}</td></tr>}{external.foundation>0&&<tr><td>Фундамент</td><td>{money(external.foundation)}</td></tr>}{external.montage>0&&<tr><td>Монтаж</td><td>{money(external.montage)}</td></tr>}<tr className="grand"><td>ИТОГО</td><td>{money(total)}</td></tr></tbody></table></section><section><div className="qeyebrow">03 / ВАЖНО</div><p>В итог дома входят базовая комплектация и согласованные дополнительные опции. Доставка, фундамент и монтаж выделяются отдельно. Для индивидуальных решений технические параметры требуют проверки конструктора.</p><div className="note">Основание эталона: структура КП «Модерн 60» и индивидуальное КП «Канада 24».</div></section></article></div>}
function QuotesPage({quotes}:{quotes:Quote[]}){return <><div className="herohead"><div><div className="eyebrow">ИСТОРИЯ КП</div><h1>Коммерческие предложения</h1><p>Сохраняются в браузере текущего устройства.</p></div></div><div className="table-card"><table><thead><tr><th>Номер</th><th>Клиент</th><th>Проект</th><th>Итог</th><th>Дата</th></tr></thead><tbody>{quotes.map(q=><tr key={q.id}><td><b>{q.id}</b></td><td>{q.client.name||'—'}<small>{q.client.phone}</small></td><td>{q.project}</td><td>{money(q.total)}</td><td>{new Date(q.createdAt).toLocaleDateString('ru-RU')}</td></tr>)}</tbody></table>{!quotes.length&&<div className="empty">Сохранённых КП пока нет.</div>}</div></>}
function ClientsPage({clients,setClients,client,setClient,addClient}:{clients:any[];setClients:any;client:any;setClient:any;addClient:any}){return <><div className="herohead"><div><div className="eyebrow">CRM</div><h1>Клиенты</h1><p>Локальный список для прототипа GitHub Pages.</p></div></div><div className="form-card"><div className="fields"><Field label="ФИО"><input value={client.name} onChange={e=>setClient({...client,name:e.target.value})}/></Field><Field label="Телефон"><input value={client.phone} onChange={e=>setClient({...client,phone:e.target.value})}/></Field><Field label="E-mail"><input value={client.email} onChange={e=>setClient({...client,email:e.target.value})}/></Field><Field label="Город"><input value={client.city} onChange={e=>setClient({...client,city:e.target.value})}/></Field></div><button className="primary" onClick={addClient}>Сохранить клиента</button></div><div className="table-card"><table><thead><tr><th>ФИО</th><th>Телефон</th><th>E-mail</th><th>Город</th></tr></thead><tbody>{clients.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.phone}</td><td>{c.email}</td><td>{c.city}</td></tr>)}</tbody></table></div></>}
function SettingsPage(){return <><div className="herohead"><div><div className="eyebrow">НАСТРОЙКИ</div><h1>Источник цен</h1><p>В этой версии в базу занесены цены моделей из присланного каталога и только те опции, для которых есть точные суммы в КП.</p></div></div><div className="settings"><div className="form-card"><h3>Подтверждено документами</h3><ul><li>Каталог: серии, модели, площади, габариты и цены.</li><li>КП «Модерн 60»: опции, 230 000 ₽ доставка, 220 000 ₽ свайный фундамент, 300 000 ₽ монтаж.</li><li>Каталог: бесплатная установка и монтаж в пределах 70 км от производства в Екатеринбурге и Новосибирске.</li><li>КП «Канада 24»: два модуля, 2 344 000 ₽ и отдельное условие по 2 дополнительным сваям.</li></ul></div><div className="form-card"><h3>Пока отсутствует</h3><ul><li>Отдельная таблица городских тарифов доставки.</li><li>Утверждённый универсальный прайс индивидуального проекта.</li><li>Точные цены ФБС из загруженного каталога.</li></ul></div></div></>}
class Boundary extends React.Component<React.PropsWithChildren,{error:string|null}>{state={error:null};static getDerivedStateFromError(e:unknown){return {error:e instanceof Error?e.message:String(e)}}render(){return this.state.error?<div className="errorbox"><h1>Ошибка запуска DP MODULE</h1><pre>{this.state.error}</pre></div>:this.props.children}}
createRoot(document.getElementById('root')!).render(<Boundary><App/></Boundary>);
