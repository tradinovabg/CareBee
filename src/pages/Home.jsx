import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1>CareBee</h1>
      <Link to="/sos">
        <button>SOS</button>
      </Link>
    </div>
  )
}
