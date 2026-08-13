import React, { useContext, useEffect, useState } from "react";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import { MedicineContext } from "../../context/MedicineContext";
import { SupplierContext } from "../../context/SupplierContext";
import Pagination from "../../common/Pagination";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaPills,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DeleteModal from "../../common/DeleteModal";
export default function Medicines() {
  const navigate = useNavigate();
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
  const [filterOpen, setFilterOpen] = useState(false);
  // Modal States
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
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
  const [medicineImage, setMedicineImage] = useState(null);
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
    setMedicineImage(null);
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

  const handleDelete = async () => {
    if (!selectedDeleteItem) return;
    try {
      await deleteMedicine(selectedDeleteItem._id);
      await getMedicine(currentPage);
      toast.success("Medicine Deleted Successfully");
      setDeleteModalOpen(false);
      setSelectedDeleteItem(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
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
      const data = new FormData();

      data.append("medicineName", formData.medicineName);
      data.append("genericName", formData.genericName);
      data.append("category", formData.category);
      data.append("company", formData.company);
      data.append("batchNumber", formData.batchNumber);
      data.append("expiryDate", formData.expiryDate);
      data.append("purchasePrice", formData.purchasePrice);
      data.append("sellingPrice", formData.sellingPrice);
      data.append("stockQuantity", formData.stockQuantity);
      data.append("supplier", formData.supplier);

      if (medicineImage) {
        data.append("medicineImage", medicineImage);
      }

      if (editing) {
        await updateMedicine(selectedId, data);
        toast.success("Medicine Updated Successfully");
      } else {
        await addMedicine(data);
        toast.success("Medicine Added Successfully");
      }

      await getMedicine(currentPage);
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading && medicine.length === 0) {
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
              Medicines
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Manage pharmacy medicines and stock.
            </p>
          </div>
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

      <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-3 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              placeholder="Search medicines by name or generic name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/5"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((prev) => !prev)}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition ${
                category || company || selectedSupplier
                  ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <FaFilter size={12} />

              <span>Filters</span>

              {(category || company || selectedSupplier) && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${
                    category || company || selectedSupplier
                      ? "bg-white text-stone-900"
                      : ""
                  }`}
                >
                  {[category, company, selectedSupplier].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {filterOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[320px] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_12px_40px_rgba(28,25,23,0.12)]">
                {/* Header */}
                <div className="border-b border-stone-100 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-stone-900">
                        Filter Medicines
                      </h3>

                      <p className="mt-0.5 text-xs text-stone-400">
                        Narrow down your inventory
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFilterOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                    >
                      <FaTimes size={11} />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="space-y-4 p-5">
                  {/* Category */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      Category
                    </label>

                    <select
                      value={category}
                      onChange={(e) => {
                        const value = e.target.value;

                        setCategory(value);
                        handleFilter(value, company, selectedSupplier);
                      }}
                      className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-700 outline-none transition hover:border-stone-300 focus:border-stone-900 focus:bg-white"
                    >
                      <option value="">All Categories</option>

                      {[
                        ...new Set(
                          medicine.map((item) => item.category).filter(Boolean),
                        ),
                      ].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      Company
                    </label>

                    <select
                      value={company}
                      onChange={(e) => {
                        const value = e.target.value;

                        setCompany(value);
                        handleFilter(category, value, selectedSupplier);
                      }}
                      className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-700 outline-none transition hover:border-stone-300 focus:border-stone-900 focus:bg-white"
                    >
                      <option value="">All Companies</option>

                      {[
                        ...new Set(
                          medicine.map((item) => item.company).filter(Boolean),
                        ),
                      ].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Supplier */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      Supplier
                    </label>

                    <select
                      value={selectedSupplier}
                      onChange={(e) => {
                        const value = e.target.value;

                        setSelectedSupplier(value);
                        handleFilter(category, company, value);
                      }}
                      className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-700 outline-none transition hover:border-stone-300 focus:border-stone-900 focus:bg-white"
                    >
                      <option value="">All Suppliers</option>

                      {supplier.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.supplierName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/50 px-5 py-3">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-medium text-stone-500 transition hover:text-stone-900"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-stone-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(category || company || selectedSupplier) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-stone-200/70 pt-3">
            <span className="mr-1 text-[11px] font-medium text-stone-400">
              Active:
            </span>

            {category && (
              <button
                type="button"
                onClick={() => {
                  setCategory("");
                  handleFilter("", company, selectedSupplier);
                }}
                className="group inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
              >
                Category: {category}
                <FaTimes
                  size={9}
                  className="text-stone-400 group-hover:text-stone-700"
                />
              </button>
            )}

            {company && (
              <button
                type="button"
                onClick={() => {
                  setCompany("");
                  handleFilter(category, "", selectedSupplier);
                }}
                className="group inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
              >
                Company: {company}
                <FaTimes
                  size={9}
                  className="text-stone-400 group-hover:text-stone-700"
                />
              </button>
            )}

            {selectedSupplier && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSupplier("");
                  handleFilter(category, company, "");
                }}
                className="group inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
              >
                Supplier:{" "}
                {supplier.find((item) => item._id === selectedSupplier)
                  ?.supplierName || "Selected"}
                <FaTimes
                  size={9}
                  className="text-stone-400 group-hover:text-stone-700"
                />
              </button>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-xs font-medium text-stone-400 transition hover:text-stone-900"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={openModal}
        onClose={closeModal}
        title={editing ? "Update Medicine" : "Add Medicine"}
        size="xl"
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
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Medicine Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMedicineImage(e.target.files[0])}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-stone-900 py-3 text-sm font-medium text-white transition hover:bg-stone-800 hover:shadow-md"
          >
            {editing ? "Update Medicine" : "Save Medicine"}
          </button>
        </form>
      </Modal>
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDeleteItem(null);
        }}
        onConfirm={handleDelete}
        itemName={selectedDeleteItem?.medicineName}
        title="DeleteMedicine"
        loading={loading}
      />
      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#faf9f6]/70 backdrop-blur-[1px]">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="border-b border-stone-200 bg-stone-50/70">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Image
                </th>
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
                    {/* Image */}
                    <td className="px-5 py-4">
                      {item.medicineImage ? (
                        <img
                          src={item.medicineImage}
                          alt={item.medicineName}
                          className="h-12 w-12 rounded-xl border border-stone-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-stone-400">
                          <FaPills size={16} />
                        </div>
                      )}
                    </td>

                    {/* Medicine */}
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

                    {/* Company */}
                    <td className="px-5 py-4 text-sm text-stone-600">
                      {item.company}
                    </td>

                    {/* Supplier */}
                    <td className="px-5 py-4 text-sm text-stone-600">
                      {item.supplier?.supplierName || "N/A"}
                    </td>

                    {/* Stock */}
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

                    {/* Price */}
                    <td className="px-5 py-4 text-center text-sm font-medium text-stone-900">
                      ₹{Number(item.sellingPrice).toLocaleString("en-IN")}
                    </td>

                    {/* Expiry */}
                    <td className="px-5 py-4 text-center text-sm text-stone-500">
                      {item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Actions */}
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
                            onClick={() => {
                              setSelectedDeleteItem(item);
                              setDeleteModalOpen(true);
                            }}
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
