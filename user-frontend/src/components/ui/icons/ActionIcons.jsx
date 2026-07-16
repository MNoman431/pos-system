import { Link } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  NoSymbolIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";

const baseBtn =
  "rounded-lg border border-slate-200 p-2 transition shadow-sm dark:border-slate-700";

/* ================= EDIT ================= */
export const EditIcon = ({ to, onClick, title = "Edit", disabled }) => {
  if (to) {
    return (
      <Link
        to={to}
        title={title}
        className={`${baseBtn} text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10 disabled:opacity-50`}
      >
        <PencilIcon className="h-4 w-4" />
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseBtn} text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10 disabled:opacity-50`}
    >
      <PencilIcon className="h-4 w-4" />
    </button>
  );
};

/* ================= VIEW ================= */
export const ViewIcon = ({ to, title = "View" }) => (
  <Link
    to={to}
    title={title}
    className={`${baseBtn} text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10`}
  >
    <EyeIcon className="h-4 w-4" />
  </Link>
);

/* ================= DELETE ================= */
export const DeleteIcon = ({ onClick, title = "Delete", disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`${baseBtn} text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 disabled:opacity-50`}
  >
    <TrashIcon className="h-4 w-4" />
  </button>
);

/* ================= DEACTIVATE ================= */
export const DeactivateIcon = ({ onClick, title = "Deactivate" }) => (
  <button
    onClick={onClick}
    title={title}
    className={`${baseBtn} text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10`}
  >
    <NoSymbolIcon className="h-4 w-4" />
  </button>
);

/* ================= PLUS (+) ================= */
export const PlusIconBtn = ({ onClick, title = "Add", disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`${baseBtn} text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10 disabled:opacity-50`}
  >
    <PlusIcon className="h-4 w-4" />
  </button>
);

/* ================= MINUS (–) ================= */
export const MinusIconBtn = ({ onClick, title = "Remove", disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`${baseBtn} text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 disabled:opacity-50`}
  >
    <MinusIcon className="h-4 w-4" />
  </button>
);