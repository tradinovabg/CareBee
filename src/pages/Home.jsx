import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container grid gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">CareBee</h1>
        <p className="text-slate-600">Welcome!</p>
      </div>

      <Link
        to="/sos"
        className="mx-auto flex h-72 w-72 items-center justify-center rounded-full bg-red-600 text-3xl font-bold text-white"
      >
        SOS
      </Link>
    </div>
  );
}
