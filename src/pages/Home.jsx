import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home">
      <h1>CareBee</h1>
      <p>Quick help at your fingertips.</p>
      <Link to="/sos">
        <button className="sos-button">SOS</button>
      </Link>
    </div>
  )
}
