
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createPurchaseInvoice } from "../../redux/thunks/purchaseThunks/PurchaseThunk"
const TRIGGERS_ENABLED = import.meta.env.VITE_TRIGGERS_ENABLED === "true";
import { fetchVendors } from "../../redux/thunks/vendorThunks/VendorThunk";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { EditIcon, MinusIconBtn } from "../../components/ui/icons/ActionIcons";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Helmet } from "react-helmet-async";

const emptyItem = () => ({
  itemCode: "",
  itemName: "",
  costPrice: 0,
  qty: 1,
  lineTotal: 0,
  isLoading: false,
  isError: false,
});

const NewInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
const pollRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, []);

  const { vendors } = useSelector((state) => state.vendor);
  const { loading } = useSelector((state) => state.purchase);

  const [vendor, setVendor] = useState({ _id: "", name: "" });
  const [items, setItems] = useState([emptyItem()]);
  const [discount, setDiscount] = useState(0);
  const [totals, setTotals] = useState({ subTotal: 0, grandTotal: 0 });
  const [editingIndex, setEditingIndex] = useState(null);

  const firstInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  useEffect(() => {
    if (firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, []);

  // ---------------- TOTALS -------------------
  const calculateTotals = (itemsArr, discountVal, type) => {
    const subTotal = itemsArr.reduce(
      (acc, item) => acc + (Number(item.lineTotal) || 0),
      0
    );

    let discountAmount =
      type === "percent"
        ? (subTotal * Number(discountVal)) / 100
        : Number(discountVal);

    const grandTotal = Math.max(0, subTotal - discountAmount);
    setTotals({ subTotal, grandTotal });
  };

  const handleQtyChange = (index, qty) => {
    const newItems = [...items];
    const q = Math.max(1, Number(qty) || 1);

    newItems[index].qty = q;
    newItems[index].lineTotal =
      Number(newItems[index].costPrice || 0) * q;

    setItems(newItems);
    calculateTotals(newItems, discount);
  };

  // ---------------- DISCOUNT -------------------
  const handleDiscountChange = (val) => {
    const d = Math.max(0, Number(val) || 0);
    setDiscount(d);
    calculateTotals(items, d);
  };

  // ---------------- AUTO ADD NEW ROW -------------------
  const addRowAndFocus = () => {
    setItems((prev) => [...prev, emptyItem()]);

    setTimeout(() => {
      const next = document.querySelector(`#itemCode-${items.length}`);
      next?.focus();
    }, 100);
  };

  // ---------------- FETCH ITEM -------------------
  const fetchItemByCode = async (index, rawCode) => {
    const code = String(rawCode || "").trim();

    if (!code) {
      const newItems = [...items];
      newItems[index] = emptyItem();
      setItems(newItems);
      calculateTotals(newItems, discount);
      return;
    }

    if (!/^\d{5}$/.test(code)) {
      const newItems = [...items];
      newItems[index].isError = true;
      newItems[index].itemName = "";
      newItems[index].costPrice = 0;
      newItems[index].lineTotal = 0;

      setItems(newItems);
      calculateTotals(newItems, discount);
      return;
    }

    const newItems = [...items];
    newItems[index].isLoading = true;
    newItems[index].isError = false;
    setItems(newItems);

    try {
      const res = await api.get(`/inventory/items/by-code?itemCode=${code}`);
      const itemData = res.data?.data;

      const updated = [...newItems];
      updated[index] = {
        ...updated[index],
        itemCode: itemData.itemCode,
        itemName: itemData.name,
        costPrice: itemData.costPrice,
        qty: updated[index].qty || 1,
        lineTotal: Number(itemData.costPrice) * Number(updated[index].qty || 1),
        isLoading: false,
        isError: false,
      };

      setItems(updated);
      calculateTotals(updated, discount);

      //  AUTO ADD NEW ROW IF THIS WAS LAST ROW
      if (index === updated.length - 1) {
        addRowAndFocus();
      }
    } catch {
      const failed = [...newItems];
      failed[index].isError = true;
      failed[index].itemName = "";
      failed[index].costPrice = 0;
      failed[index].lineTotal = 0;
      failed[index].isLoading = false;

      setItems(failed);
    }
  };

  // ---------------- INPUT HANDLERS -------------------
  const handleItemCodeChange = (index, value) => {
    const newItems = [...items];
    newItems[index].itemCode = value;
    newItems[index].isError = false;
    setItems(newItems);
  };

  const handleItemCodeEnter = async (index, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await fetchItemByCode(index, items[index]?.itemCode);

      // Move focus to next row
      setTimeout(() => {
        const next = document.querySelector(`#itemCode-${index + 1}`);
        next?.focus();
      }, 100);
    }
  };

  const handleItemCodeBlur = (index, e) => {
    fetchItemByCode(index, e.target.value);
  };

  // ---------------- TABLE ACTIONS -------------------
  const addRow = () => addRowAndFocus();

  const removeRow = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);

    if (newItems.length === 0) newItems.push(emptyItem());

    setItems(newItems);
    calculateTotals(newItems, discount);
  };

  const editRow = (index) => setEditingIndex(index);

  const saveRow = (index, patch) => {
    const updated = [...items];
    updated[index] = { ...updated[index], ...patch };
    updated[index].lineTotal =
      Number(updated[index].costPrice) * Number(updated[index].qty || 1);

    setItems(updated);
    setEditingIndex(null);
    calculateTotals(updated, discount);
  };

  // ---------------- SUBMIT -------------------
  const handleSubmit = async () => {
    const cleanedItems = items
      .filter((i) => i.itemCode && !i.isError)
      .map((i) => ({ itemCode: i.itemCode.trim(), qty: Number(i.qty) }));

    if (!vendor._id) return toast.error("Please select a vendor.");
    if (cleanedItems.length === 0)
      return toast.error("Add at least one valid item.");

    const payload = {
      vendor: vendor._id,
      items: cleanedItems,
      discountValue: discount,
    };

    try {
      const result = await dispatch(createPurchaseInvoice(payload)).unwrap();
      toast.success("Invoice created successfully!");

      // if (result?.data?._id) pollEmailStatus(result.data._id);
      
 if (TRIGGERS_ENABLED && result?.data?._id) {
      pollEmailStatus(result.data._id);
     } else if (!TRIGGERS_ENABLED) {
       toast("Email will be sent later by scheduled job", { icon: "⏳" });
     }


      navigate(`/purchase/list`);
    } catch (err) {
      toast.error(err?.message || "Failed to create invoice");
    }
  };
 const pollEmailStatus = (purchaseId) => {
   if (!TRIGGERS_ENABLED) return; // triggers off -> no polling
   if (pollRef.current) clearInterval(pollRef.current);
   let attempts = 0;
   pollRef.current = setInterval(async () => {
     attempts++;
     try {
       const { data } = await api.get(`/purchases/${purchaseId}`);
       const emailSent = data?.data?.emailSent;
       if (emailSent) {
         toast.success("Email sent to vendor");
         clearInterval(pollRef.current);
         pollRef.current = null;
       } else if (attempts >= 20) {
         clearInterval(pollRef.current);
         pollRef.current = null;
       }
     } catch {
       clearInterval(pollRef.current);
       pollRef.current = null;
     }
   }, 3000);
 };

  // ---------------- UI -------------------
  return (
    <div className="w-full min-h-screen p-6 bg-gray-100 dark:bg-slate-950">
      <div className="w-full bg-white shadow-xl rounded-xl p-6 border border-gray-200 dark:bg-slate-900 dark:border-slate-800">
           <Helmet>
                        <title>New Purchase Invoice - FancyStore</title>
                        <meta name="description" content="Create a new sale invoice for a customer in FancyStore admin panel" />
                        <link rel="canonical" href={window.location.href} />
                      </Helmet>

        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100">New Purchase Invoice</h2>
          <button
            onClick={addRow}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 active:scale-95 transition"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>

        {/* VENDOR SELECT */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Select Vendor
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-400 transition"
            value={vendor._id}
            onChange={(e) => {
              const selected = vendors.find((v) => v._id === e.target.value);
              setVendor(selected || { _id: "", name: "" });
            }}
          >
            <option value="">-- Select Vendor --</option>
            {vendors.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-slate-800 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 dark:bg-slate-800/60 dark:text-slate-300">
              <tr>
                <th className="border p-3 text-center dark:border-slate-800">#</th>
                <th className="border p-3 text-left dark:border-slate-800">Code</th>
                <th className="border p-3 text-left dark:border-slate-800">Name</th>
                <th className="border p-3 text-left dark:border-slate-800">Cost Price</th>
                <th className="border p-3 text-center dark:border-slate-800">Qty</th>
                <th className="border p-3 text-right dark:border-slate-800">Total</th>
                <th className="border p-3 text-center dark:border-slate-800">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition">
                  <td className="border p-3 text-center dark:border-slate-800 dark:text-slate-300">{idx + 1}</td>

                  {/* ITEM CODE */}
                  <td className="border p-3 dark:border-slate-800">
                    <input
                      id={`itemCode-${idx}`}
                      ref={idx === 0 ? firstInputRef : null}
                      type="text"
                      value={item.itemCode}
                      maxLength={5}
                      placeholder="e.g. 12345"
                      onChange={(e) => handleItemCodeChange(idx, e.target.value)}
                      onKeyDown={(e) => handleItemCodeEnter(idx, e)}
                      onBlur={(e) => handleItemCodeBlur(idx, e)}
                      className={`w-full px-3 py-2 rounded-lg border shadow-sm transition dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                        item.isError
                          ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-500/10"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-700 dark:focus:border-indigo-400"
                      }`}
                    />

                    {item.isError && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">Invalid item</p>
                    )}
                  </td>

                  {/* NAME */}
                  <td className="border p-3 dark:border-slate-800 dark:text-slate-300">{item.itemName}</td>

                  {/* COST PRICE */}
                  <td className="border p-3 dark:border-slate-800 dark:text-slate-300">{item.costPrice}</td>

                  {/* QTY */}
                  <td className="border p-3 text-center dark:border-slate-800">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleQtyChange(idx, e.target.value)}
                      className="w-20 px-2 py-1 border rounded-lg shadow-sm text-center dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-400"
                    />
                  </td>

                  {/* TOTAL */}
                  <td className="border p-3 text-right font-semibold dark:border-slate-800 dark:text-slate-100">
                    {item.lineTotal}
                  </td>

                  {/* ACTIONS */}
                  <td className="border p-3 dark:border-slate-800">
                    <div className="flex items-center justify-center gap-3">
                      <MinusIconBtn onClick={() => removeRow(idx)} />
                      <EditIcon onClick={() => editRow(idx)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* TOTALS + DISCOUNT */}
<div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Discount Value</label>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              className="ml-2 border rounded-lg px-3 py-1 w-28 text-right shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-400"
            />
          </div>

          <div className="font-semibold dark:text-slate-100">
            Subtotal: {totals.subTotal}
          </div>

          <div className="font-bold text-blue-700 dark:text-indigo-400">
            Grand Total: {totals.grandTotal}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition text-lg ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save Invoice"}
          </button>
        </div>

      </div>
    </div>
  );
};

NewInvoice.pageName = "CreatePurchase";

export default NewInvoice;
