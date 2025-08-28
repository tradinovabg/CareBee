const KEY = "carebee:sos_contacts";
export function loadContacts(){ try{const r=localStorage.getItem(KEY);return r?JSON.parse(r):[]}catch{return[]}}
export function saveContacts(list){ try{localStorage.setItem(KEY,JSON.stringify(list))}catch{} }
export function addContact(c){ const list=loadContacts(); const id=crypto.randomUUID();
  list.push({id,name:"",phone_e164:"",email:"",priority:0,...c}); saveContacts(list); return id }
export function removeContact(id){ const list=loadContacts().filter(c=>c.id!==id); saveContacts(list) }
