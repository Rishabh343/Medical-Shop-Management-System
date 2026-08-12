import React, { useContext, useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaHistory } from "react-icons/fa";
import { InventoryContext } from "../../context/InventoryContext";
// import { MedicineContext } from "../../context/MedicineContext"; // (Unused in this file)
import Pagination from "../../common/Pagination";
import Loader from "../../common/Loader";
import Modal from "../../common/Modal";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Inventory() {
  const navigate = useNavigate();
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
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockAction, setStockAction] = useState(""); // "in" or "out"
  const [stockQuantity, setStockQuantity] = useState("");
  const [selectedStockItem, setSelectedStockItem] = useState(null);
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
  useEffect(() => {
    // Set a timer to wait 500ms after the user stops typing
    const delayDebounceFn = setTimeout(() => {
      if (search.trim() === "") {
        getInventory();
      } else {
        searchInventory(search);
      }
    }, 500);

    // Cleanup: If the user types again before 500ms, destroy the old timer
    return () => clearTimeout(delayDebounceFn);
  }, [search]); // This runs every time 'search' changes
  const handleStockIn = (item) => {
    setSelectedStockItem(item);
    setStockAction("in");
    setStockQuantity("");
    setStockModalOpen(true);
  };

  const handleStockOut = (item) => {
    setSelectedStockItem(item);
    setStockAction("out");
    setStockQuantity("");
    setStockModalOpen(true);
  };

  const handleViewHistory = async (item) => {
    setSelectedItem(item);
    setHistoryModalOpen(true);
    await getStockMovement();
  };

  // Filter the global stock movements for the currently selected inventory item
  const currentItemHistory =
    stockMovement?.filter(
      (mov) =>
        mov.inventory?._id === selectedItem?._id ||
        mov.inventory === selectedItem?._id,
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-1 flex h-10 items-center gap-2 rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-white hover:text-stone-900"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
              Inventory
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Inventory Management
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Monitor medicine stock, expiry dates and stock movements.
            </p>
          </div>
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="
            appearance-none
            min-w-[190px]
            rounded-xl
            border
            border-stone-200
            bg-[#faf9f6]
            px-4
            py-2.5
            pr-10
            text-sm
            font-medium
            text-stone-700
            outline-none
            transition
            hover:border-stone-300
            focus:border-stone-900
            focus:ring-1
            focus:ring-stone-900
          "
          >
            <option value="all">All Inventory</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
            <option value="near">Near Expiry</option>
            <option value="expired">Expired</option>
          </select>

          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-4 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
            w-full
            rounded-xl
            border
            border-stone-200
            bg-white
            px-4
            py-3
            text-sm
            text-stone-900
            outline-none
            transition
            placeholder:text-stone-400
            focus:border-stone-900
            focus:ring-1
            focus:ring-stone-900
          "
          />
        </div>
      </div>

      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Stock History: ${selectedItem?.medicineName || ""}`}
      >
        <div className="space-y-4">
          {loading && stockMovement.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : currentItemHistory.length > 0 ? (
            <div className="max-h-80 overflow-y-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 border-b border-stone-200 bg-stone-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Date
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Type
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Remarks
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {currentItemHistory.map((mov) => (
                    <tr key={mov._id} className="transition hover:bg-stone-50">
                      <td className="px-4 py-3 text-sm text-stone-600">
                        {new Date(mov.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            mov.type === "IN" || mov.movementType === "IN"
                              ? "bg-stone-100 text-stone-700"
                              : "bg-stone-900 text-white"
                          }`}
                        >
                          {mov.type || mov.movementType || "N/A"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center text-sm font-semibold text-stone-800">
                        {mov.quantity}
                      </td>

                      <td className="px-4 py-3 text-right text-xs text-stone-500">
                        {mov.remarks || mov.reason || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl bg-stone-50 py-10 text-center">
              <p className="text-sm font-medium text-stone-700">
                No stock movement history
              </p>

              <p className="mt-1 text-xs text-stone-400">
                There are no recorded movements for this medicine.
              </p>
            </div>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        title={stockAction === "in" ? "Stock In" : "Stock Out"}
      >
        <div className="space-y-5">
          {/* Medicine */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">
              Medicine
            </p>

            <p className="mt-1 text-base font-semibold text-stone-900">
              {selectedStockItem?.medicineName || "-"}
            </p>
          </div>

          {/* Current Stock */}
          <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
            <span className="text-sm text-stone-500">Current Stock</span>

            <span className="text-sm font-semibold text-stone-900">
              {selectedStockItem?.stockQuantity ?? 0}
            </span>
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Quantity
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-stone-400">
                {stockAction === "in" ? "+" : "−"}
              </span>

              <input
                type="number"
                min="1"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition focus:border-stone-900"
              />
            </div>
          </div>

          {/* New Stock Preview */}
          {stockQuantity && Number(stockQuantity) > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-stone-100 px-4 py-3">
              <span className="text-sm text-stone-500">New Stock</span>

              <span className="text-sm font-semibold text-stone-900">
                {stockAction === "in"
                  ? Number(selectedStockItem?.stockQuantity || 0) +
                    Number(stockQuantity)
                  : Math.max(
                      0,
                      Number(selectedStockItem?.stockQuantity || 0) -
                        Number(stockQuantity),
                    )}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStockModalOpen(false)}
              className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={
                !stockQuantity ||
                Number(stockQuantity) <= 0 ||
                (stockAction === "out" &&
                  Number(stockQuantity) >
                    Number(selectedStockItem?.stockQuantity || 0))
              }
              onClick={async () => {
                const qty = Number(stockQuantity);

                if (stockAction === "in") {
                  await increaseStock(selectedStockItem._id, qty);
                } else {
                  await decreaseStock(selectedStockItem._id, qty);
                }

                setStockModalOpen(false);
                setStockQuantity("");
                setSelectedStockItem(null);

                await getInventory(currentPage);
              }}
              className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {stockAction === "in" ? "Add Stock" : "Remove Stock"}
            </button>
          </div>
        </div>
      </Modal>
      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#faf9f6]/70 backdrop-blur-[1px]">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="border-b border-stone-200 bg-stone-50/70">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Medicine
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Batch
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Stock
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Reorder
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Expiry
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-stone-50/80"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-stone-900">
                        {item.medicineName}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-600">
                      {item.batchNumber}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex min-w-10 justify-center rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700">
                        {item.stockQuantity}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center text-sm text-stone-600">
                      {item.reorderLevel}
                    </td>

                    <td className="px-5 py-4 text-center text-sm text-stone-500">
                      {new Date(item.expiryDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-4 text-center">
                      {getStatus(
                        item.stockQuantity,
                        item.reorderLevel,
                        item.expiryDate,
                      )}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <div className="relative inline-block">
                        <details className="group">
                          <summary
                            className="
                            flex
                            cursor-pointer
                            list-none
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-stone-200
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-stone-600
                            shadow-sm
                            transition
                            hover:border-stone-300
                            hover:bg-stone-50
                          "
                          >
                            Actions
                            <svg
                              className="h-3.5 w-3.5 text-stone-400 transition group-open:rotate-180"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </summary>

                          <div className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-xl border border-stone-200 bg-white p-1 text-left shadow-xl">
                            <button
                              type="button"
                              onClick={() => handleStockIn(item)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50"
                            >
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                                <FaArrowUp size={11} />
                              </span>
                              Stock In
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStockOut(item)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50"
                            >
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                                <FaArrowDown size={11} />
                              </span>
                              Stock Out
                            </button>

                            <div className="my-1 border-t border-stone-100" />

                            <button
                              type="button"
                              onClick={() => handleViewHistory(item)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50"
                            >
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                                <FaHistory size={11} />
                              </span>
                              Stock History
                            </button>
                          </div>
                        </details>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <p className="text-sm font-medium text-stone-700">
                      No Inventory Found
                    </p>

                    <p className="mt-1 text-xs text-stone-400">
                      No medicines match the selected filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-stone-200 px-5 py-4">
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
