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
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          E-mail
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Message
          <textarea name="message" value={form.message} onChange={handleChange} />
        </label>
      </div>
      <button type="submit">Send</button>
    </form>
  )
}
