import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-[70vh] grid place-items-center p-4">
      <Link
        to="/sos"
        className="w-72 h-72 rounded-full bg-red-600 text-white text-6xl font-extrabold shadow-xl border-8 border-red-300 grid place-items-center"
      >
        SOS
      </Link>
    </main>
  );
}
