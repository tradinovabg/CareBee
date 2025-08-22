import { useState } from 'react'

export default function Sos() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(form)
  }

  return (
    <form onSubmit={handleSubmit} className="sos-form">
      <label htmlFor="name">Name</label>
      <input id="name" name="name" value={form.name} onChange={handleChange} required />

      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />

      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" value={form.message} onChange={handleChange} required />

      <button type="submit">Send</button>
    </form>
  )
}
