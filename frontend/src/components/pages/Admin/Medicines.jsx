import React, { useContext, useEffect, useState } from "react";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import { MedicineContext } from "../../context/MedicineContext";
import { SupplierContext } from "../../context/SupplierContext";
import Pagination from "../../common/Pagination";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaPills } from "react-icons/fa";
export default function Medicines() {
  const {
    medicine,
    loading,
    getMedicine,
    getByMedicineId,
    addMedicine,
    currentPage,
    totalPages,
    updateMedicine,
    deleteMedicine,
    searchMedicine,
    filterMedicine,
  } = useContext(MedicineContext);

  const { supplier, getSupplier } = useContext(SupplierContext);
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  // Search States
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  // Modal States
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    medicineName: "",
    genericName: "",
    category: "",
    company: "",
    batchNumber: "",
    expiryDate: "",
    purchasePrice: "",
    sellingPrice: "",
    stockQuantity: "",
    supplier: "",
  });

  const role = localStorage.getItem("role");
  useEffect(() => {
    getMedicine(1);
     getSupplier();
  }, []);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.trim() !== "") {
        searchMedicine(search);
        setIsSearching(true);
      } else if (isSearching) {
        getMedicine(1);
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);
  const handlePageChange = (page) => {
    if (!isSearching) {
      getMedicine(page);
    }
  };
  const resetForm = () => {
    setFormData({
      medicineName: "",
      genericName: "",
      category: "",
      company: "",
      batchNumber: "",
      expiryDate: "",
      purchasePrice: "",
      sellingPrice: "",
      stockQuantity: "",
      supplier: "",
    });
    setEditing(false);
    setSelectedId(null);
  };
  const handleFilter = async (
    newCategory = category,
    newCompany = company,
    newSupplier = selectedSupplier,
  ) => {
    try {
      setIsFiltering(true);
      await filterMedicine(newCategory, newCompany, newSupplier);
    } catch (error) {
      console.log(error);
    }
  };
  const clearFilters = () => {
    setCategory("");
    setCompany("");
    setSelectedSupplier("");
    setIsFiltering(false);
    getMedicine(1);
  };
  const openAddModal = async () => {
    resetForm();
    // Only fetch if we haven't fetched them yet this session
    if (supplier.length === 0) {
      await getSupplier();
    }
    setOpenModal(true);
  };
  const closeModal = () => {
    resetForm();
    setOpenModal(false);
  };
  const handleEdit = async (id) => {
    try {
      // Only fetch if we haven't fetched them yet this session
      if (supplier.length === 0) {
        await getSupplier();
      }

      const data = await getByMedicineId(id);

      setFormData({
        medicineName: data.medicineName || "",
        genericName: data.genericName || "",
        category: data.category || "",
        company: data.company || "",
        batchNumber: data.batchNumber || "",
        expiryDate: data.expiryDate ? data.expiryDate.substring(0, 10) : "",
        purchasePrice: data.purchasePrice || "",
        sellingPrice: data.sellingPrice || "",
        stockQuantity: data.stockQuantity || "",
        supplier: data.supplier?._id || data.supplier || "",
      });

      setSelectedId(id);
      setEditing(true);
      setOpenModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;

    try {
      await deleteMedicine(id);
      await getMedicine(currentPage);
      alert("Medicine Deleted Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await updateMedicine(selectedId, formData);
        alert("Medicine Updated Successfully");
      } else {
        await addMedicine(formData);
        alert("Medicine Added Successfully");
      }
      await getMedicine(currentPage);
      closeModal();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading && medicine.length === 0) {
    return <Loader />;
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
            Inventory
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            Medicines
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Manage pharmacy medicines and stock.
          </p>
        </div>

        {role === "Admin" && (
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 hover:shadow-md"
          >
            <FaPlus size={13} />
            Add Medicine
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <FaSearch
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              placeholder="Search medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              handleFilter(e.target.value, company, selectedSupplier);
            }}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 outline-none focus:border-stone-900"
          >
            <option value="">All Categories</option>
            {[
              ...new Set(medicine.map((item) => item.category).filter(Boolean)),
            ].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              handleFilter(category, e.target.value, selectedSupplier);
            }}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 outline-none focus:border-stone-900"
          >
            <option value="">All Companies</option>
            {[
              ...new Set(medicine.map((item) => item.company).filter(Boolean)),
            ].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={selectedSupplier}
            onChange={(e) => {
              setSelectedSupplier(e.target.value);
              handleFilter(category, company, e.target.value);
            }}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 outline-none focus:border-stone-900"
          >
            <option value="">All Suppliers</option>
            {supplier.map((item) => (
              <option key={item._id} value={item._id}>
                {item.supplierName}
              </option>
            ))}
          </select>
        </div>

        {(category || company || selectedSupplier) && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-3 py-2 text-xs font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={openModal}
        onClose={closeModal}
        title={editing ? "Update Medicine" : "Add Medicine"}
      >
        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] space-y-5 overflow-y-auto px-1"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Medicine Name
              </label>
              <input
                type="text"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Generic Name
              </label>
              <input
                type="text"
                name="genericName"
                value={formData.genericName}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Batch Number
              </label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Purchase Price (₹)
              </label>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Selling Price (₹)
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Supplier
              </label>
              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                required
              >
                <option value="">Select Supplier</option>
                {supplier.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.supplierName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-stone-900 py-3 text-sm font-medium text-white transition hover:bg-stone-800 hover:shadow-md"
          >
            {editing ? "Update Medicine" : "Save Medicine"}
          </button>
        </form>
      </Modal>

      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#faf9f6]/70 backdrop-blur-[1px]">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-stone-200 bg-stone-50/70">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Medicine
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Company
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Supplier
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Stock
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Price
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Expiry
                </th>

                {role === "Admin" && (
                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {medicine.length > 0 ? (
                medicine.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-stone-50/80"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-stone-900">
                          {item.medicineName}
                        </p>

                        {item.genericName && (
                          <p className="mt-1 text-xs text-stone-400">
                            {item.genericName}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-600">
                      {item.company}
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-600">
                      {item.supplier?.supplierName || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex min-w-10 justify-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                          item.stockQuantity <= 10
                            ? "bg-stone-900 text-white"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {item.stockQuantity}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center text-sm font-medium text-stone-900">
                      ₹{Number(item.sellingPrice).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-center text-sm text-stone-500">
                      {item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString()
                        : "-"}
                    </td>

                    {role === "Admin" && (
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
                          >
                            <FaEdit size={13} />
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:bg-stone-100 hover:text-red-600"
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={role === "Admin" ? 7 : 6}
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-400">
                        <FaPills size={15} />
                      </div>

                      <p className="text-sm font-medium text-stone-700">
                        No Medicines Found
                      </p>

                      <p className="mt-1 text-xs text-stone-400">
                        Try changing your search or add a new medicine.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isSearching && totalPages > 1 && (
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
