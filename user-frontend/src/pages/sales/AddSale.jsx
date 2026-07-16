
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { createSaleThunk } from "../../redux/thunks/salesThunk/SaleThunk";
const TRIGGERS_ENABLED = import.meta.env.VITE_TRIGGERS_ENABLED === "true";
import { MinusIconBtn } from "../../components/ui/icons/ActionIcons";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// ---------- Helpers ----------
const emptyRow = () => ({
  itemCode: "",
  itemId: "",
  itemName: "",
  price: 0,
  qty: 1,
  lineTotal: 0,
  isLoading: false,
  isError: false,
});

// Safe number coerce
const toNum = (v) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

// Optional: simple email regex
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());

const AddSale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.sales);

  
  const pollRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, []);


  // --------- Customer ---------
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // --------- Items / Rows ---------
  const [rows, setRows] = useState([emptyRow()]);
  const firstInputRef = useRef(null);

  // --------- Discount / Totals ---------
  // const [discountType, setDiscountType] = useState("fixed"); // fixed | percent
  const [discountValue, setDiscountValue] = useState(0);
  const [totals, setTotals] = useState({ subTotal: 0, grandTotal: 0 });

  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 200);
  }, []);

  // --------- Totals ----------
  const calculateTotals = (rowsArr, dValue, dType) => {
    const subTotal = rowsArr.reduce(
      (acc, r) => acc + (Number(r.lineTotal) || 0),
      0
    );

    let discountAmt =
      dType === "percent"
        ? (subTotal * Number(dValue || 0)) / 100
        : Number(dValue || 0);

    // prevent negative and cap at subtotal
    discountAmt = Math.max(0, Math.min(discountAmt, subTotal));
    const grandTotal = Math.max(0, subTotal - discountAmt);

    setTotals({ subTotal, grandTotal });
  };

  useEffect(() => {
    calculateTotals(rows, discountValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, discountValue]);

  // --------- UI convenience ----------
  const addRowAndFocus = () => {
    setRows((prev) => [...prev, emptyRow()]);
    setTimeout(() => {
      const next = document.querySelector(`#itemCode-${rows.length}`);
      next?.focus();
    }, 100);
  };

  // --------- FETCH ITEM (UPDATED with fallbacks) ----------
  const fetchItem = async (index, rawCode) => {
    const code = String(rawCode || "").trim();

    if (!code) {
      const newRows = [...rows];
      newRows[index] = emptyRow();
      setRows(newRows);
      return;
    }

    if (!/^\d{5}$/.test(code)) {
      const newRows = [...rows];
      newRows[index].isError = true;
      newRows[index].itemName = "";
      newRows[index].price = 0;
      newRows[index].lineTotal = 0;
      setRows(newRows);
      return;
    }

    const newRows = [...rows];
    newRows[index].isLoading = true;
    newRows[index].isError = false;
    setRows(newRows);

    try {
      const res = await api.get(`/inventory/items/by-code?itemCode=${code}`);
      const item = res.data?.data;

      // Robust price mapping (fallbacks)
      const price =
        toNum(item?.retailPrice) ||
        toNum(item?.salePrice) ||
        toNum(item?.sellingPrice) ||
        toNum(item?.price) ||
        toNum(item?.mrp) ||
        toNum(item?.costPrice);

      const qty = toNum(newRows[index].qty || 1) || 1;

      const updated = [...newRows];
      updated[index] = {
        ...updated[index],
        itemCode: item?.itemCode || code,
        itemId: item?._id || "",
        itemName: item?.name || "",
        price,
        qty,
        lineTotal: price * qty,
        isLoading: false,
        isError: false,
      };

      setRows(updated);

      // Auto-add row if last row now filled
      if (index === updated.length - 1) {
        addRowAndFocus();
      }
    } catch (err) {
      const failed = [...newRows];
      failed[index].isError = true;
      failed[index].itemName = "";
      failed[index].price = 0;
      failed[index].lineTotal = 0;
      failed[index].isLoading = false;
      setRows(failed);
      toast.error("Item not found");
    }
  };

  // --------- Enter key / Blur ----------
  const handleEnter = async (index, e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    await fetchItem(index, rows[index].itemCode);

    // Focus next row automatically
    setTimeout(() => {
      const next = document.querySelector(`#itemCode-${index + 1}`);
      next?.focus();
    }, 100);
  };

  const handleBlur = (index, e) => {
    fetchItem(index, e.target.value);
  };

  // --------- QTY ----------
  const handleQty = (index, qty) => {
    const newRows = [...rows];
    const q = Math.max(1, Number(qty) || 1);
    const price = Number(newRows[index].price || 0);

    newRows[index].qty = q;
    newRows[index].lineTotal = q * price;

    setRows(newRows);
  };

  // --------- Remove Row ----------
  const removeRow = (i) => {
    let newRows = rows.filter((_, idx) => idx !== i);
    if (!newRows.length) newRows = [emptyRow()];
    setRows(newRows);
  };
const pollEmail = (saleId) => {
  if (!TRIGGERS_ENABLED) return; // triggers off -> no polling
   if (pollRef.current) clearInterval(pollRef.current);
   let tries = 0;
   pollRef.current = setInterval(async () => {
     tries++;
     try {
       const { data } = await api.get(`/sales/${saleId}`);
       const emailSent = data?.data?.emailSent;
       if (emailSent) {
         toast.success("Invoice emailed to customer!");
         clearInterval(pollRef.current);

pollRef.current = null;
       } else if (tries >= 20) {
         clearInterval(pollRef.current);
         pollRef.current = null;
       }
     } catch {
       clearInterval(pollRef.current);
       pollRef.current = null;
     }
   }, 3000);
 };



  // --------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer.name?.trim()) return toast.error("Enter customer name");
    if (!customer.email?.trim() || !isValidEmail(customer.email))
      return toast.error("Enter a valid customer email");

    const cleaned = rows
      .filter((r) => r.itemId && !r.isError)
      .map((r) => ({
        itemId: r.itemId,
        qty: Number(r.qty || 1),
      }));

    if (cleaned.length === 0) return toast.error("Add at least one valid item");

    try {
      const sale = await dispatch(
        createSaleThunk({
          customer,
          items: cleaned,
          // discountType,
          discountValue: Number(discountValue || 0),
        })
      ).unwrap();

      toast.success("Sale invoice created!");
      navigate(`/sales/list`);

      // if (sale?._id) pollEmail(sale._id);
      
if (TRIGGERS_ENABLED && sale?._id) {
      pollEmail(sale._id);
     } else if (!TRIGGERS_ENABLED) {
       toast("Email will be sent later by scheduled job", { icon: "⏳" });
     }


      // Reset all
      setCustomer({ name: "", phone: "", email: "" });
      setRows([emptyRow()]);
      // setDiscountType("fixed");
      setDiscountValue(0);
      setTimeout(() => firstInputRef.current?.focus(), 200);
    } catch (err) {
      toast.error(err?.message || "Failed to create sale");
    }
  };

  // --------- UI ----------
  return (
    <div className="w-full pb-28">
      <div className="w-full bg-white shadow-sm rounded-2xl border border-slate-200 p-4 md:p-6 dark:bg-slate-900 dark:border-slate-800">
         <Helmet>
                <title>New Sale Invoice - FancyStore</title>
                <meta name="description" content="Create a new sale invoice for a customer in FancyStore admin panel" />
                <link rel="canonical" href={window.location.href} />
              </Helmet>
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
              New Sale Invoice
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Scan or enter an item code to add it to the cart</p>
          </div>

          <button
            type="button"
            onClick={addRowAndFocus}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 active:scale-95 transition text-sm font-semibold"
            aria-label="Add row"
            title="Add row"
          >
            <PlusIcon className="h-5 w-5" />
            Add Row
          </button>
        </div>

        {/* CUSTOMER INFO */}
        <form id="add-sale-form" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-3">
              Customer Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ali Ahmad"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                  className="border border-slate-300 px-3.5 py-2.5 rounded-lg shadow-sm text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. 03xx-xxxxxxx"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  className="border border-slate-300 px-3.5 py-2.5 rounded-lg shadow-sm text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. customer@mail.com"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  className={`border px-3.5 py-2.5 rounded-lg shadow-sm text-[15px] focus:outline-none focus:ring-2 transition ${
                    customer.email && !isValidEmail(customer.email)
                      ? "border-red-400 bg-red-50 focus:ring-red-500/30 focus:border-red-500 dark:bg-red-500/10 dark:border-red-500/40 dark:text-slate-100"
                      : "border-slate-300 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-400"
                  }`}
                />
                {customer.email && !isValidEmail(customer.email) && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                <tr>
                  <th className="border-b border-slate-200 dark:border-slate-800 p-3 text-center w-14 font-semibold">#</th>
                  <th className="border-b border-slate-200 dark:border-slate-800 p-3 text-left w-44 font-semibold">Code</th>
                  <th className="border-b border-slate-200 dark:border-slate-800 p-3 text-left font-semibold">Name</th>
                  <th className="border-b border-slate-200 dark:border-slate-800 p-3 text-right w-28 font-semibold">Price</th>
                  <th className="border-b border-slate-200 dark:border-slate-800 p-3 text-center w-40 font-semibold">Qty</th>
                  <th className="border-b border-slate-200 dark:border-slate-800 p-3 text-right w-32 font-semibold">Total</th>
                  <th className="border-b border-slate-200 dark:border-slate-800 p-3 text-center w-20 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`transition ${row.isError ? "bg-red-50/60 dark:bg-red-500/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"}`}
                  >
                    {/* # */}
                    <td className="p-3 text-center text-slate-400 dark:text-slate-500">{index + 1}</td>

                    {/* ITEM CODE */}
                    <td className="p-3">
                      <div className="flex flex-col">
                        <input
                          id={`itemCode-${index}`}
                          ref={index === 0 ? firstInputRef : null}
                          type="text"
                          maxLength={5}
                          placeholder="e.g. 12345"
                          value={row.itemCode}
                          onChange={(e) => {
                            const newRows = [...rows];
                            newRows[index].itemCode = e.target.value;
                            newRows[index].isError = false;
                            setRows(newRows);
                          }}
                          onKeyDown={(e) => handleEnter(index, e)}
                          onBlur={(e) => handleBlur(index, e)}
                          className={`w-full px-3 py-3 text-base rounded-lg border shadow-sm transition ${
                            row.isError
                              ? "border-red-400 bg-red-50 dark:bg-red-500/10 dark:border-red-500/40 dark:text-slate-100"
                              : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-400"
                          }`}
                        />
                        {row.isError && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Invalid or not found
                          </p>
                        )}
                      </div>
                    </td>

                    {/* NAME */}
                    <td className="p-3">
                      <div className="text-slate-800 font-medium dark:text-slate-100">
                        {row.isLoading ? (
                          <span className="text-slate-400 font-normal dark:text-slate-500">Loading…</span>
                        ) : (
                          row.itemName || <span className="text-slate-300 dark:text-slate-600">—</span>
                        )}
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="p-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {Number(row.price || 0).toFixed(2)}
                    </td>

                    {/* QTY — touch-friendly stepper (calls the existing handleQty handler) */}
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQty(index, Number(row.qty || 1) - 1)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 active:scale-95 transition dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={row.qty}
                          onChange={(e) => handleQty(index, e.target.value)}
                          className="w-14 h-9 px-1 border border-slate-300 rounded-lg shadow-sm text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleQty(index, Number(row.qty || 1) + 1)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 active:scale-95 transition dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>

                    {/* LINE TOTAL */}
                    <td className="p-3 text-right font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                      {Number(row.lineTotal || 0).toFixed(2)}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-3">
                        <MinusIconBtn onClick={() => removeRow(index)} title="Remove row" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>

      {/* STICKY CHECKOUT BAR — always visible, touch-friendly totals + submit */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-3 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] lg:left-64 dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-600 whitespace-nowrap dark:text-slate-300">
              Discount
            </label>
            <input
              type="number"
              min="0"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value || 0))}
              className="border border-slate-300 rounded-lg px-3 py-2 w-24 text-right shadow-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-400"
            />
          </div>

          <div className="flex items-center justify-between gap-6 md:justify-end">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Subtotal{" "}
              <span className="ml-1 font-semibold text-slate-800 tabular-nums dark:text-slate-100">
                Rs {Number(totals.subTotal).toFixed(2)}
              </span>
            </div>

            <div className="text-lg font-bold text-indigo-700 tabular-nums whitespace-nowrap dark:text-indigo-400">
              Total: Rs {Number(totals.grandTotal).toFixed(2)}
            </div>

            <button
              type="submit"
              form="add-sale-form"
              disabled={loading}
              className={`bg-indigo-600 text-white py-3 px-8 rounded-lg shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 active:scale-95 transition text-base font-semibold whitespace-nowrap ${
                loading ? "opacity-60 cursor-not-allowed active:scale-100" : ""
              }`}
            >
              {loading ? "Saving..." : "Create Sale"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AddSale.pageName = "CreateSale";

export default AddSale;
