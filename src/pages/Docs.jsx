import Dexie from 'dexie'
import { useEffect, useState } from 'react'

const db = new Dexie('carebee_docs')
db.version(1).stores({ files: '++id,name,type,date,tags,note' })

async function addFileRec(file, meta){
  const blob = file
  const id = await db.files.add({
    name: meta.name || file.name,
    type: meta.type || file.type || 'other',
    date: meta.date || new Date().toISOString().slice(0,10),
    tags: meta.tags || '',
    note: meta.note || '',
    blob
  })
  return id
}

export default function Docs(){
  const [list,setList]=useState([])
  const [busy,setBusy]=useState(false)

  const refresh = async ()=> {
    const rows = await db.files.toArray()
    setList(rows.sort((a,b)=> (b.date||'').localeCompare(a.date||'')))
  }
  useEffect(()=>{ refresh() },[])

  const onAdd = async (file) => {
    if(!file) return
    setBusy(true); await addFileRec(file, {}); setBusy(false); refresh()
  }

  const toUrl = (blob)=> URL.createObjectURL(blob)
  const open = (f)=> { const url = toUrl(f.blob); window.open(url, '_blank'); setTimeout(()=>URL.revokeObjectURL(url), 30000) }

  const rename = async (f, name)=> { await db.files.update(f.id,{ name }); refresh() }
  const remove = async (f)=> { await db.files.delete(f.id); refresh() }

  const blobToDataURL = (blob)=> new Promise(res=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(blob) })
  const exportJSON = async ()=> {
    const rows = await db.files.toArray()
    const files = await Promise.all(rows.map(async r=>({
      id:r.id, name:r.name, type:r.type, date:r.date, tags:r.tags, note:r.note,
      dataUrl: await blobToDataURL(r.blob)
    })))
    const payload = { version:1, files }
    const a=document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}))
    a.download = 'carebee-docs.json'; a.click(); URL.revokeObjectURL(a.href)
  }
  const importJSON = (file)=> {
    const r=new FileReader()
    r.onload=async ()=>{ try{
      const data = JSON.parse(r.result)
      if(!data || !Array.isArray(data.files)) throw new Error()
      for(const f of data.files){
        const resp = await fetch(f.dataUrl); const blob = await resp.blob()
        await addFileRec(new File([blob], f.name, { type: f.type }), f)
      }
      refresh()
    }catch(e){ void e; alert('Invalid file') } }
    r.readAsText(file)
  }

  const share = async (f)=> {
    try{
      const fileObj = new File([f.blob], f.name, { type:f.blob.type || 'application/octet-stream' })
      if(navigator.canShare && navigator.canShare({ files:[fileObj] })){
        await navigator.share({ files:[fileObj], title:f.name, text:'CareBee document' })
      }else{
        open(f)
      }
      }catch(e){ /* ignore */ void e; }
  }

  return (
    <div className="container" style={{maxWidth:900, margin:'0 auto'}}>
      <h1 className="h1">Documents</h1>

      <div className="card">
        <div className="row">
          <label className="btn btn-primary">
            Add file
            <input type="file" accept="image/*,.pdf" style={{display:'none'}} onChange={e=>e.target.files[0] && onAdd(e.target.files[0])}/>
          </label>
          <button className="btn btn-outline" onClick={exportJSON}>Export JSON</button>
          <label className="btn btn-outline">
            Import JSON
            <input type="file" accept="application/json" style={{display:'none'}} onChange={e=>e.target.files[0] && importJSON(e.target.files[0])}/>
          </label>
        </div>
        {busy && <p>Uploading…</p>}
      </div>

      <ul>
        {list.map(f=>(
          <li key={f.id} className="card" style={{marginTop:12, padding:'12px'}}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div>
                <strong>{f.name}</strong> — {f.type} — {f.date}
                {f.tags? <> • {f.tags}</> : null}
                {f.note? <div style={{color:'#555'}}>{f.note}</div>:null}
              </div>
              <div className="row">
                <button className="btn btn-outline" onClick={()=>open(f)}>Open</button>
                <button className="btn btn-outline" onClick={()=>share(f)}>Share</button>
                <button className="btn btn-outline" onClick={()=>rename(f, prompt('New name', f.name) || f.name)}>Rename</button>
                <button className="btn btn-danger" onClick={()=>remove(f)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

