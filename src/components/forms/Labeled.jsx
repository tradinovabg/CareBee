// Универсальные поля с постоянным заголовком над input/textarea/select

export function LabeledInput({ label, className = "", ...props }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-slate-600 mb-1">{label}</div>
      <input
        {...props}
        className={`w-full rounded border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 ${className}`}
      />
    </label>
  );
}

export function LabeledTextarea({ label, rows = 3, className = "", ...props }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-slate-600 mb-1">{label}</div>
      <textarea
        rows={rows}
        {...props}
        className={`w-full rounded border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 ${className}`}
      />
    </label>
  );
}

export function LabeledSelect({ label, className = "", children, ...props }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-slate-600 mb-1">{label}</div>
      <select
        {...props}
        className={`w-full rounded border border-slate-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 ${className}`}
      >
        {children}
      </select>
    </label>
  );
}
