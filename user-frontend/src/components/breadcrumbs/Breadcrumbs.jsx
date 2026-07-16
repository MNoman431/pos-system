import { Link } from "react-router-dom";

const Breadcrumbs = ({ paths }) => {
  return (
    <nav className="text-sm text-slate-500 dark:text-slate-400 mb-4" aria-label="Breadcrumb">
      <ol className="list-reset flex">
        {paths.map((p, idx) => (
          <li key={idx} className="flex items-center">
            {idx !== 0 && <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>} {/* separator */}
            {p.to ? (
              <Link
                to={p.to}
                className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {p.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-800 dark:text-slate-100">{p.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
