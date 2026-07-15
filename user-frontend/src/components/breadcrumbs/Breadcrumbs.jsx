import { Link } from "react-router-dom";

const Breadcrumbs = ({ paths }) => {
  return (
    <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
      <ol className="list-reset flex">
        {paths.map((p, idx) => (
          <li key={idx} className="flex items-center">
            {idx !== 0 && <span className="mx-2 text-slate-300">/</span>} {/* separator */}
            {p.to ? (
              <Link
                to={p.to}
                className="hover:underline hover:text-indigo-600 transition-colors"
              >
                {p.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-800">{p.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
