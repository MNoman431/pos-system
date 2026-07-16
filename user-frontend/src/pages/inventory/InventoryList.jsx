// after resposnive
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchItems,
  deleteItem,
} from "../../redux/thunks/inventoryThunk/InventoryThunk";
import {
  selectInventory,
  selectItems,
  selectListLoading,
  selectDeleting,
} from "../../redux/slices/inventorySlices/InventorySlice";


import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import {
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "../../components/ui/icons/ActionIcons";
import { Helmet } from "react-helmet-async";

const InventoryList = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectItems);
  const loading = useSelector(selectListLoading);
  const deleting = useSelector(selectDeleting);

  const { errorList, meta } = useSelector(selectInventory);
  const { currentPage, totalPages, limit } = meta;

  useEffect(() => {
    dispatch(fetchItems({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    const res = await dispatch(deleteItem(id));
    alert(
      deleteItem.fulfilled.match(res)
        ? "Item deleted"
        : res?.payload || "Failed to delete item",
    );
  };
  const breadcrumbPaths = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Inventory" }, // current page
  ];

  const API_BASE =
    import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
    "http://localhost:9999";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 pb-28 shadow-sm dark:border-slate-800 dark:bg-slate-900">
         <Helmet>
                      <title>Inventory List - FancyStore</title>
                      <meta name="description" content="View and manage inventory items in FancyStore admin panel" />
                      <link rel="canonical" href={window.location.href} />
                    </Helmet>
      <Breadcrumbs paths={breadcrumbPaths} />
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">Inventory List</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your product catalog and stock levels</p>
        </div>
        <Link
          to="/inventory/add"
          className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-sm transition text-center"
        >
          + Add Inventory
        </Link>
      </div>

      {loading && (
        <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">Loading inventory…</div>
      )}

      {!loading && errorList && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
          {errorList}
        </div>
      )}

      {!loading && !errorList && (
        <>
          {/* DESKTOP VIEW - TABLE */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 sticky top-0">
                <tr>
                  {[
                    "Image",
                    "Code",
                    "Name",
                    "Category",
                    "Vendor",
                    "Cost",
                    "Retail",
                    "Wholesale",
                    "Stock",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No items found
                    </td>
                  </tr>
                ) : (
                  items.map((i) => {
                    const src = i.imageUrl?.startsWith("/uploads")
                      ? `${API_BASE}${i.imageUrl}`
                      : i.imageUrl;
                    const outOfStock = Number(i.stockQty || 0) === 0;

                    return (
                      <tr key={i._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="px-4 py-3">
                          {src ? (
                            <img
                              src={src}
                              alt={i.name}
                              className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
                              —
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{i.itemCode}</td>
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{i.name}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{i.category}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{i.vendor?.name || "—"}</td>
                        <td className="px-4 py-3 tabular-nums text-slate-700 dark:text-slate-300">Rs {i.costPrice}</td>
                        <td className="px-4 py-3 tabular-nums font-semibold text-slate-800 dark:text-slate-100">Rs {i.retailPrice}</td>
                        <td className="px-4 py-3 tabular-nums text-slate-600 dark:text-slate-300">{i.wholesalePrice}</td>
                        <td className="px-4 py-3">
                          {outOfStock ? (
                            <span className="inline-block text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 px-2 py-1 rounded-full">
                              Out of stock
                            </span>
                          ) : (
                            <span className="tabular-nums text-slate-700 dark:text-slate-300">{i.stockQty}</span>
                          )}
                        </td>

                        {/* ACTION ICONS */}

                        <td className="px-4 py-3 flex gap-2">
                          <EditIcon to={`/inventory/edit/${i._id}`} />
                          <DeleteIcon
                            onClick={() => onDelete(i._id)}
                            disabled={deleting}
                          />
                          <ViewIcon to={`/inventory/view/${i._id}`} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW - CARDS */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {items.length === 0 ? (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                No items found
              </div>
            ) : (
              items.map((i) => {
                const src = i.imageUrl?.startsWith("/uploads")
                  ? `${API_BASE}${i.imageUrl}`
                  : i.imageUrl;
                const outOfStock = Number(i.stockQty || 0) === 0;

                return (
                  <div
                    key={i._id}
                    className="border border-slate-200 rounded-xl p-4 bg-white hover:shadow-md transition dark:border-slate-800 dark:bg-slate-900"
                  >
                    {/* Image & Basic Info */}
                    <div className="flex gap-3 mb-3">
                      {src ? (
                        <img
                          src={src}
                          alt={i.name}
                          className="h-16 w-16 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{i.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Code: {i.itemCode}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{i.category}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Vendor</p>
                        <p className="font-medium text-slate-800 dark:text-slate-100">
                          {i.vendor?.name || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Stock</p>
                        {outOfStock ? (
                          <span className="inline-block text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 px-2 py-0.5 rounded-full mt-0.5">
                            Out of stock
                          </span>
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-100 tabular-nums">{i.stockQty}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Retail</p>
                        <p className="font-medium text-slate-800 dark:text-slate-100 tabular-nums">Rs {i.retailPrice}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Cost</p>
                        <p className="font-medium text-slate-800 dark:text-slate-100 tabular-nums">Rs {i.costPrice}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <Link
                        to={`/inventory/view/${i._id}`}
                        className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg text-center text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition"
                      >
                        View
                      </Link>
                      <Link
                        to={`/inventory/edit/${i._id}`}
                        className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-lg text-center text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(i._id)}
                        disabled={deleting}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 rounded-lg text-center text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* PAGINATION */}
          <div className="mt-6 md:mt-8 mb-24 flex flex-col gap-4 md:gap-0 md:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            {/* LEFT - Rows Per Page */}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 w-full md:w-auto justify-center md:justify-start">
              <span className="whitespace-nowrap">Rows per page:</span>

              <select
                value={limit}
                onChange={(e) =>
                  dispatch(
                    fetchItems({ page: 1, limit: Number(e.target.value) }),
                  )
                }
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200
      focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-400 transition"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* CENTER - Page Info */}
            <div className="text-sm text-slate-600 dark:text-slate-300 text-center">
              Page{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-100">{totalPages}</span>
            </div>

            {/* RIGHT - Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  dispatch(fetchItems({ page: currentPage - 1, limit }))
                }
                className="flex-1 md:flex-none rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200
      hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  dispatch(fetchItems({ page: currentPage + 1, limit }))
                }
                className="flex-1 md:flex-none rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200
      hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
InventoryList.pageName = "ViewInventory";
export default InventoryList;
