const KEY = "carebee:sos_contacts"

export function loadContacts(){
  try{
    const v = localStorage.getItem(KEY)
    return v ? JSON.parse(v) : []
  }catch{
    return []
  }
}

export function saveContacts(contacts){
  try{
    localStorage.setItem(KEY, JSON.stringify(contacts))
  }catch{
    // ignore write errors
  }
}

export function addContact(contact){
  const c = { ...contact, id: crypto.randomUUID() }
  const list = loadContacts()
  list.push(c)
  saveContacts(list)
  return c
}

export function removeContact(id){
  const list = loadContacts().filter(c=>c.id!==id)
  saveContacts(list)
}
