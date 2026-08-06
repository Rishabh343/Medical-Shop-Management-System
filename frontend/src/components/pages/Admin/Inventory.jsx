import React, { useContext, useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaHistory } from "react-icons/fa";
import { InventoryContext } from "../../context/InventoryContext";
import { MedicineContext } from "../../context/MedicineContext";
import Pagination from "../../common/Pagination";

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
  } = useContext(InventoryContext);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
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

  if (loading) {
    return <h2 className="text-center text-lg">Loading...</h2>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">Manage medicine stock and inventory.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`p-4 rounded-lg shadow font-semibold ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          All Inventory
        </button>

        <button
          onClick={() => setFilter("low")}
          className={`p-4 rounded-lg shadow font-semibold ${
            filter === "low"
              ? "bg-yellow-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Low Stock
        </button>

        <button
          onClick={() => setFilter("out")}
          className={`p-4 rounded-lg shadow font-semibold ${
            filter === "out"
              ? "bg-red-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Out of Stock
        </button>

        <button
          onClick={() => setFilter("near")}
          className={`p-4 rounded-lg shadow font-semibold ${
            filter === "near"
              ? "bg-orange-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Near Expiry
        </button>

        <button
          onClick={() => setFilter("expired")}
          className={`p-4 rounded-lg shadow font-semibold ${
            filter === "expired"
              ? "bg-gray-800 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Expired
        </button>
      </div>

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
          className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Medicine</th>
              <th className="p-3 text-left">Batch</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Reorder</th>
              <th className="p-3 text-center">Expiry</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.medicineName}</td>

                  <td className="p-3">{item.batchNumber}</td>

                  <td className="p-3 text-center">{item.stockQuantity}</td>

                  <td className="p-3 text-center">{item.reorderLevel}</td>

                  <td className="p-3 text-center">
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-center">
                    {getStatus(
                      item.stockQuantity,
                      item.reorderLevel,
                      item.expiryDate,
                    )}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => increaseStock(item._id, 10)}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        <FaArrowUp />
                        Stock In
                      </button>

                      <button
                        onClick={() => decreaseStock(item._id, 10)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        <FaArrowDown />
                        Stock Out
                      </button>

                      <button className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                        <FaHistory />
                        History
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No Inventory Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
