import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemById } from "../../redux/thunks/inventoryThunk/InventoryThunk";
import { selectCurrentItem, selectItemLoading } from "../../redux/slices/inventorySlices/InventorySlice";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import { Helmet } from "react-helmet-async";

const InventoryView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const item = useSelector(selectCurrentItem);
  const loading = useSelector(selectItemLoading);

  useEffect(() => {
    dispatch(fetchItemById(id));
  }, [id, dispatch]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!item) return <p className="p-6">No data</p>;
  const breadcrumbPaths = [
  { label: "Home", to: "/home" },
  { label: "Inventory", to: "/inventory/list" },
  { label: item?.name || "View Item" } // current page, item load hone ke baad dikhega
];


  return (
 <div className="w-full min-h-screen p-6 bg-white">
  
     <Helmet>
                <title>Inventory View - FancyStore</title>
                <meta name="description" content="Inventory View in FancyStore admin panel" />
                <link rel="canonical" href={window.location.href} />
              </Helmet>

      <Breadcrumbs paths={breadcrumbPaths} />
      {/* Header */}
    {/* Back Button (above heading) */}
<div className="mb-4">
  <Link
    to="/inventory/list"
    className="flex items-center text-gray-600 hover:text-gray-800 font-medium transition"
  >
    <span className="mr-2 text-xl">←</span> Back to Inventory
  </Link>
</div>

{/* Header */}
<div className="mb-6">
  <h1 className="text-2xl font-semibold text-gray-800">
    Inventory Details
  </h1>
</div>


      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image */}
        <div className="md:col-span-1 flex justify-center items-start">
          <img
            src={item.imageUrl || "/placeholder.png"}
            alt={item.name}
            className="rounded-lg border shadow-sm max-h-64 object-cover"
          />
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-3 text-gray-700 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Item Code:</span> <span>{item.itemCode}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Name:</span> <span>{item.name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Category:</span> <span>{item.category}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Cost Price:</span> <span>{item.costPrice}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Retail Price:</span> <span>{item.retailPrice}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Wholesale Price:</span> <span>{item.wholesalePrice}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Stock:</span> <span>{item.stockQty}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Description:</span> <span>{item.description || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
InventoryView.pageName = "ViewInventory";
export default InventoryView;
