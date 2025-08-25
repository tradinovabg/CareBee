import { useMemo, useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Chart as ChartJS } from 'chart.js'
import { useTranslation } from 'react-i18next'
import { getAutoSendSettings, setAutoSendSettings, getLastSummaryAt, sendDailySummaryNow } from '../lib/dailySummary.js'
import { maybeSendDailySummary } from '../lib/dailySummary.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const KEY='carebee.vitals'
const load=()=>{try{const v=localStorage.getItem(KEY);return v?JSON.parse(v):[]}catch{return[]}}
const save=(arr)=>{try{localStorage.setItem(KEY,JSON.stringify(arr))}catch(e){console.error(e)}}
const nowISO = ()=> new Date().toISOString()

export default function Vitals(){
    const { t } = useTranslation()
    const [list,setList]=useState(()=>load())
  const [type,setType]=useState('bp') // bp | temp | glu
  const [sys,setSys]=useState(''); const [dia,setDia]=useState(''); const [pulse,setPulse]=useState('')
  const [temp,setTemp]=useState(''); const [glu,setGlu]=useState(''); const [ts,setTs]=useState(()=>nowISO().slice(0,16))
  const [auto,setAuto]=useState(()=>getAutoSendSettings())
  const [lastSent,setLastSent]=useState(()=>getLastSummaryAt())

  useEffect(()=>save(list),[list])
  useEffect(()=>{ maybeSendDailySummary() },[])

  const add=()=>{
    const time = ts ? new Date(ts) : new Date()
    if(type==='bp' && sys && dia){
      setList(p=>[...p,{id:Date.now(), type, sys:+sys, dia:+dia, pulse:+(pulse||0), at:time.toISOString()}])
      setSys(''); setDia(''); setPulse('')
    }else if(type==='temp' && temp){
      setList(p=>[...p,{id:Date.now(), type, temp:+temp, at:time.toISOString()}]); setTemp('')
    }else if(type==='glu' && glu){
      setList(p=>[...p,{id:Date.now(), type, glu:+glu, at:time.toISOString()}]); setGlu('')
    }
  }
  const remove = id => setList(p=>p.filter(x=>x.id!==id))
  const last = useMemo(()=>[...list].sort((a,b)=>a.at.localeCompare(b.at)).slice(-20),[list])

  const labels = last.map(x=> new Date(x.at).toLocaleString())
  const bpData = { labels, datasets:[
    { label:'SYS', data:last.map(x=>x.type==='bp'?x.sys:null), borderWidth:2, spanGaps:true },
    { label:'DIA', data:last.map(x=>x.type==='bp'?x.dia:null), borderWidth:2, spanGaps:true }
  ]}
  const tempData = { labels, datasets:[{ label:'Temp °C', data:last.map(x=>x.type==='temp'?x.temp:null), borderWidth:2, spanGaps:true }] }
  const gluData  = { labels, datasets:[{ label:'Glucose mmol/L', data:last.map(x=>x.type==='glu'?x.glu:null), borderWidth:2, spanGaps:true }] }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(list,null,2)], {type:'application/json'})
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='vitals.json'; a.click(); URL.revokeObjectURL(a.href)
  }
  const exportCSV = () => {
    const head='type,sys,dia,pulse,temp,glu,at'
    const rows=list.map(x=>[x.type,x.sys??'',x.dia??'',x.pulse??'',x.temp??'',x.glu??'',x.at].join(','))
    const blob=new Blob([[head,...rows].join('\n')],{type:'text/csv'})
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='vitals.csv'; a.click(); URL.revokeObjectURL(a.href)
  }
    const importJSON = (file) => {
      const reader=new FileReader()
      reader.onload=()=>{ try{
        const arr=JSON.parse(reader.result); if(!Array.isArray(arr)) throw new Error();
        setList(arr); }catch{ alert('Invalid file') } }
      reader.readAsText(file)
    }

  return (
    <div className="container" style={{maxWidth:900, margin:'0 auto'}}>
        <h1 className="h1">{t('vitals.title','Vitals')}</h1>

      <div className="card">
        <div className="row">
          <label><input type="radio" name="t" value="bp" checked={type==='bp'} onChange={e=>setType(e.target.value)} /> BP</label>
          <label><input type="radio" name="t" value="temp" checked={type==='temp'} onChange={e=>setType(e.target.value)} /> Temp</label>
          <label><input type="radio" name="t" value="glu" checked={type==='glu'} onChange={e=>setType(e.target.value)} /> Glucose</label>
        </div>

        {type==='bp' && (
          <div className="row">
            <div className="field"><label>SYS</label><input value={sys} onChange={e=>setSys(e.target.value)} inputMode="numeric" /></div>
            <div className="field"><label>DIA</label><input value={dia} onChange={e=>setDia(e.target.value)} inputMode="numeric" /></div>
            <div className="field"><label>Pulse</label><input value={pulse} onChange={e=>setPulse(e.target.value)} inputMode="numeric" /></div>
          </div>
        )}
        {type==='temp' && <div className="field"><label>°C</label><input value={temp} onChange={e=>setTemp(e.target.value)} inputMode="decimal" /></div>}
        {type==='glu'  && <div className="field"><label>mmol/L</label><input value={glu} onChange={e=>setGlu(e.target.value)} inputMode="decimal" /></div>}

        <div className="field">
          <label>Date & time</label>
          <input type="datetime-local" value={ts} onChange={e=>setTs(e.target.value)} />
        </div>

        <div className="row">
          <button className="btn btn-primary" onClick={add}>Save</button>
          <button className="btn btn-outline" onClick={exportJSON}>Export JSON</button>
          <button className="btn btn-outline" onClick={exportCSV}>Export CSV</button>
          <label className="btn btn-outline">
            Import JSON
            <input type="file" accept="application/json" style={{display:'none'}} onChange={e=>e.target.files[0] && importJSON(e.target.files[0])} />
          </label>
        </div>
      </div>
      
        <h2 className="h2" style={{marginTop:16}}>{t('vitals.auto.title')}</h2>
      <div className="card">
        <div className="row">
          <label><input type="checkbox" checked={auto.enabled} onChange={e=>setAuto({...auto, enabled:e.target.checked})} /> {t('vitals.auto.enable')}</label>
          <div className="field"><label>{t('time')}</label><input type="time" value={auto.time} onChange={e=>setAuto({...auto, time:e.target.value})} /></div>
        </div>
        <div className="row" style={{marginTop:8}}>
          <div>{t('vitals.auto.lastSent','Last sent')}: {lastSent? new Date(lastSent).toLocaleString() : t('vitals.auto.never')}</div>
          <button className="btn btn-outline" onClick={()=>setLastSent(sendDailySummaryNow())}>{t('vitals.auto.sendNow')}</button>
          <button className="btn btn-primary" onClick={()=>setAutoSendSettings(auto)}>{t('save')}</button>
        </div>
      </div>

        <h2 className="h2" style={{marginTop:16}}>{t('vitals.charts','Charts (last 20)')}</h2>
      <div className="card"><Line data={bpData} /></div>
      <div className="card" style={{marginTop:12}}><Line data={tempData} /></div>
      <div className="card" style={{marginTop:12}}><Line data={gluData} /></div>

        <h2 className="h2" style={{marginTop:16}}>{t('vitals.latest','Latest')}</h2>
      <ul>
        {last.map(x=>(
          <li key={x.id} className="card" style={{marginTop:8, padding:'12px'}}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div>
                {x.type==='bp' ? `BP ${x.sys}/${x.dia}${x.pulse?` (${x.pulse})`:''}` :
                 x.type==='temp' ? `Temp ${x.temp} °C` :
                 `Glucose ${x.glu} mmol/L`}
                {' — '}{new Date(x.at).toLocaleString()}
              </div>
              <button className="btn btn-danger" onClick={()=>remove(x.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

