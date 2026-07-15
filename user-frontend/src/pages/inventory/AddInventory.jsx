import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  addItem,
  updateItem,
  checkItemCode,
  fetchItemById,
} from "../../redux/thunks/inventoryThunk/InventoryThunk";

import {
  selectDupCheck,
  selectSubmitting,
  selectCurrentItem,
} from "../../redux/slices/inventorySlices/InventorySlice";
import { fetchVendors } from "../../redux/thunks/vendorThunks/VendorThunk";
import { Helmet } from "react-helmet-async";

const categories = [
  "Food",
  "Beverage",
  "Grocery",
  "Electronics",
  "Clothing",
  "Bakery",
  "Cosmetics",
  "Car Accessories",
  "Other",
];

const AddInventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const submitting = useSelector(selectSubmitting);
  const dupCheck = useSelector(selectDupCheck);
  const currentItem = useSelector(selectCurrentItem);
  const vendors = useSelector((state) => state.vendor.vendors);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const [values, setValues] = useState({
    itemCode: "",
    name: "",
    category: "Food",
    costPrice: "",
    retailPrice: "",
    wholesalePrice: "",
    stockQty: "",
    description: "",
    vendor: "",
    imageFile: null,
  });

  /* ================= FETCH ITEM (EDIT) ================= */
  useEffect(() => {
    if (isEdit) dispatch(fetchItemById(id));
  }, [isEdit, id, dispatch]);

  useEffect(() => {
    if (isEdit && currentItem && currentItem._id) {
      setValues({
        itemCode: currentItem.itemCode || "",
        name: currentItem.name || "",
        category: currentItem.category || "Food",
        costPrice: currentItem.costPrice ?? "",
        retailPrice: currentItem.retailPrice ?? "",
        wholesalePrice: currentItem.wholesalePrice ?? "",
        stockQty: currentItem.stockQty ?? "",
        description: currentItem.description || "",
        vendor: currentItem.vendor?._id || currentItem.vendor || "",
        imageFile: null,
        imageUrl: currentItem.imageUrl || "",
      });
    }
  }, [isEdit, currentItem]);

  /* ================= DUP CHECK (ON BLUR) ================= */
  const handleItemCodeBlur = () => {
    if (!isEdit && values.itemCode.trim()) {
      dispatch(checkItemCode(values.itemCode.trim()));
    }
  };

  useEffect(() => {
    if (!isEdit && dupCheck.exists && dupCheck.itemCode === values.itemCode) {
      toast.error("Item code already exists!");
    }
  }, [dupCheck, values.itemCode, isEdit]);

  const onChangeText = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeNumber = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const onChangeFile = (e) => {
    const file = e.target.files?.[0] || null;
    setValues((prev) => ({ ...prev, imageFile: file }));
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && dupCheck.exists && dupCheck.itemCode === values.itemCode) {
      toast.error("Item code already exists.");
      return;
    }

    if (!values.vendor) {
      toast.error("Vendor is required");
      return;
    }

    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("category", values.category);
    fd.append("costPrice", String(values.costPrice));
    fd.append("retailPrice", String(values.retailPrice));
    fd.append("wholesalePrice", String(values.wholesalePrice));
    // fd.append("stockQty", String(values.stockQty));
    fd.append("description", values.description || "");
    fd.append("vendor", values.vendor);

    if (!isEdit) fd.append("itemCode", values.itemCode);
    if (values.imageFile) fd.append("image", values.imageFile);

    const res = isEdit
      ? await dispatch(updateItem({ id, formData: fd }))
      : await dispatch(addItem(fd));

    if (addItem.fulfilled.match(res) || updateItem.fulfilled.match(res)) {
      navigate("/inventory/list");
    } else {
      toast.error(res.payload || res.error?.message || "Operation failed");
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl rounded border bg-white p-6">
           <Helmet>
                        <title>New Inventory Item - FancyStore</title>
                        <meta name="description" content="Create a new inventory item in FancyStore admin panel" />
                        <link rel="canonical" href={window.location.href} />
                      </Helmet>
        <h2 className="mb-4 text-xl font-semibold">
          {isEdit ? "Edit Inventory" : "Add Inventory"}
        </h2>

        <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
          {/* LEFT */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Item Code</label>
              <input
                name="itemCode"
                value={values.itemCode}
                onChange={onChangeText}
                onBlur={handleItemCodeBlur}
                disabled={isEdit}
                required
                pattern="\d{5}"
                maxLength={5}
                inputMode="numeric"
                className={`mt-1 w-full rounded border px-3 py-2
                  ${
                    !isEdit &&
                    dupCheck.exists &&
                    dupCheck.itemCode === values.itemCode
                      ? "border-red-500 bg-red-50"
                      : ""
                  }`}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Item Name</label>
              <input
                name="name"
                value={values.name}
                onChange={onChangeText}
                required
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Vendor</label>
              <select
                name="vendor"
                value={values.vendor}
                onChange={onChangeText}
                required
                className="mt-1 w-full rounded border px-3 py-2"
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                name="category"
                value={values.category}
                onChange={onChangeText}
                className="mt-1 w-full rounded border px-3 py-2"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Cost Price</label>
              <input
                type="number"
                name="costPrice"
                value={values.costPrice}
                onChange={onChangeNumber}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Retail Price</label>
              <input
                type="number"
                name="retailPrice"
                value={values.retailPrice}
                onChange={onChangeNumber}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Wholesale Price</label>
              <input
                type="number"
                name="wholesalePrice"
                value={values.wholesalePrice}
                onChange={onChangeNumber}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Stock Quantity</label>
              <input
                type="number"
                name="stockQty"
                value={values.stockQty}
                onChange={onChangeNumber}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={values.description}
                onChange={onChangeText}
                rows={3}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Item Image
            </label>

            <div className="flex items-start gap-4">
              {/* Preview Box + Hidden File Input */}

              <label
                htmlFor="itemImage"
                className="flex h-32 w-32 cursor-pointer items-center justify-center rounded border bg-gray-50 hover:bg-gray-100"
              >
                {values.imageFile ? (
                  <img
                    src={URL.createObjectURL(values.imageFile)}
                    alt="preview"
                    className="h-full w-full object-contain"
                  />
                ) : values.imageUrl ? (
                  <img
                    src={values.imageUrl}
                    alt="preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400">Choose Image</span>
                )}
                <input
                  type="file"
                  id="itemImage"
                  accept="image/*"
                  onChange={onChangeFile}
                  className="hidden"
                />
              </label>

              <p className="text-xs text-gray-400">
                PNG, JPG, JPEG, WEBP up to 5MB
              </p>
            </div>

            <button
              type="submit"
              disabled={
                submitting ||
                (!isEdit &&
                  dupCheck.exists &&
                  dupCheck.itemCode === values.itemCode)
              }
              className="mt-6 w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddInventory.whyDidYouRender = true;

AddInventory.pageName = "AddInventory";
export default AddInventory;
