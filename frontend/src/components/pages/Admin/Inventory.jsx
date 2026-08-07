import React, { useContext, useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaHistory } from "react-icons/fa";
import { InventoryContext } from "../../context/InventoryContext";
// import { MedicineContext } from "../../context/MedicineContext"; // (Unused in this file)
import Pagination from "../../common/Pagination";
import Loader from "../../common/Loader";
import Modal from "../../common/Modal";

export default function Inventory() {
  const {
    loading,
    inventory,
    getInventory,
    increaseStock,
    decreaseStock,
    currentPage,
    totalPages,
    getLowStock,
    searchInventory,
    getOutOfStock,
    getExpiredInventory,
    getNearExpiryInventory,
    stockMovement,
    getStockMovement,
  } = useContext(InventoryContext);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // Modal States
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const handlePageChange = (page) => {
    getInventory(page);
  };

  const fetchInventory = () => {
    switch (filter) {
      case "low":
        getLowStock();
        break;
      case "out":
        getOutOfStock();
        break;
      case "expired":
        getExpiredInventory();
        break;
      case "near":
        getNearExpiryInventory();
        break;
      default:
        getInventory();
    }
  };

  const handleStockIn = async (id) => {
    const qty = prompt("Enter quantity to ADD to stock:");
    if (qty && !isNaN(qty) && Number(qty) > 0) {
      await increaseStock(id, Number(qty));
    }
  };

  const handleStockOut = async (id) => {
    const qty = prompt("Enter quantity to REMOVE from stock:");
    if (qty && !isNaN(qty) && Number(qty) > 0) {
      await decreaseStock(id, Number(qty));
    }
  };

  const handleViewHistory = async (item) => {
    setSelectedItem(item);
    setHistoryModalOpen(true);
    await getStockMovement();
  };

  // Filter the global stock movements for the currently selected inventory item
  const currentItemHistory = stockMovement?.filter(
    (mov) => mov.inventory?._id === selectedItem?._id || mov.inventory === selectedItem?._id
  ) || [];

  const getStatus = (stock, reorderLevel, expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
          Expired
        </span>
      );
    }
    if (diffDays <= 30) {
      return (
        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
          Near Expiry
        </span>
      );
    }
    if (stock === 0) {
      return (
        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
          Out of Stock
        </span>
      );
    }
    if (stock <= 50) {
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
          Low Stock
        </span>
      );
    }
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
        In Stock
      </span>
    );
  };

  if (loading && inventory.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">Manage medicine stock and inventory.</p>
        </div>
      </div>

      {/* Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`p-4 rounded-lg shadow font-semibold transition ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
          }`}
        >
          All Inventory
        </button>

        <button
          onClick={() => setFilter("low")}
          className={`p-4 rounded-lg shadow font-semibold transition ${
            filter === "low" ? "bg-yellow-500 text-white" : "bg-white hover:bg-gray-100"
          }`}
        >
          Low Stock
        </button>

        <button
          onClick={() => setFilter("out")}
          className={`p-4 rounded-lg shadow font-semibold transition ${
            filter === "out" ? "bg-red-500 text-white" : "bg-white hover:bg-gray-100"
          }`}
        >
          Out of Stock
        </button>

        <button
          onClick={() => setFilter("near")}
          className={`p-4 rounded-lg shadow font-semibold transition ${
            filter === "near" ? "bg-orange-500 text-white" : "bg-white hover:bg-gray-100"
          }`}
        >
          Near Expiry
        </button>

        <button
          onClick={() => setFilter("expired")}
          className={`p-4 rounded-lg shadow font-semibold transition ${
            filter === "expired" ? "bg-gray-800 text-white" : "bg-white hover:bg-gray-100"
          }`}
        >
          Expired
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow p-4">
        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            if (value.trim() === "") {
              getInventory();
            } else {
              searchInventory(value);
            }
          }}
          className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* History Modal */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Stock History: ${selectedItem?.medicineName || ""}`}
      >
        <div className="space-y-4">
          {loading && stockMovement.length === 0 ? (
            <div className="flex justify-center py-8"><Loader /></div>
          ) : currentItemHistory.length > 0 ? (
            <div className="max-h-80 overflow-y-auto border rounded-lg shadow-inner">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-3 border-b">Date</th>
                    <th className="p-3 border-b">Type</th>
                    <th className="p-3 border-b text-center">Qty</th>
                    <th className="p-3 border-b text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItemHistory.map((mov) => (
                    <tr key={mov._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-600">
                        {new Date(mov.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          mov.type === "IN" || mov.movementType === "IN" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {mov.type || mov.movementType || "N/A"}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold">
                        {mov.quantity}
                      </td>
                      <td className="p-3 text-right text-gray-500 text-xs">
                        {mov.remarks || mov.reason || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No stock movement history found for this item.
            </div>
          )}
        </div>
      </Modal>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto relative">
        {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}
        
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">Medicine</th>
              <th className="p-4 text-left font-semibold text-gray-700">Batch</th>
              <th className="p-4 text-center font-semibold text-gray-700">Stock</th>
              <th className="p-4 text-center font-semibold text-gray-700">Reorder</th>
              <th className="p-4 text-center font-semibold text-gray-700">Expiry</th>
              <th className="p-4 text-center font-semibold text-gray-700">Status</th>
              <th className="p-4 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{item.medicineName}</td>
                  <td className="p-4 text-gray-600">{item.batchNumber}</td>
                  <td className="p-4 text-center font-bold text-gray-800">{item.stockQuantity}</td>
                  <td className="p-4 text-center text-gray-600">{item.reorderLevel}</td>
                  <td className="p-4 text-center text-gray-600">
                    {new Date(item.expiryDate).toLocaleDateString("en-IN", {
                      month: 'short', year: 'numeric', day: 'numeric'
                    })}
                  </td>
                  <td className="p-4 text-center">
                    {getStatus(item.stockQuantity, item.reorderLevel, item.expiryDate)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleStockIn(item._id)}
                        title="Add Stock"
                        className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded text-sm font-medium transition"
                      >
                        <FaArrowUp size={12} /> IN
                      </button>

                      <button
                        onClick={() => handleStockOut(item._id)}
                        title="Remove Stock"
                        className="flex items-center gap-1 bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded text-sm font-medium transition"
                      >
                        <FaArrowDown size={12} /> OUT
                      </button>

                      <button
                        onClick={() => handleViewHistory(item)}
                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded text-sm font-medium transition"
                      >
                        <FaHistory size={12} /> Hist
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500 font-medium">
                  No Inventory Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}