import React, { useContext, useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaPills } from "react-icons/fa";
import { SupplierContext } from "../../context/SupplierContext";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DeleteModal from "../../common/DeleteModal";
export default function Suppliers() {
  const navigate = useNavigate();
  const {
    supplier,
    loading,
    addSupplier,
    getSupplier,
    updateSupplier,
    searchSupplier,
    getSupplierById,
    deleteSupplier,
  } = useContext(SupplierContext);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: "",
    contactNumber: "",
    email: "",
    gstNumber: "",
    address: "",
  });
  useEffect(() => {
    if (search.trim() === "") {
      getSupplier();
      return;
    }

    const timer = setTimeout(() => {
      searchSupplier(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);
  const resetForm = () => {
    setFormData({
      supplierName: "",
      contactNumber: "",
      email: "",
      gstNumber: "",
      address: "",
    });

    setEditing(false);
    setSelectedId(null);
  };

  const openAddModal = () => {
    resetForm();
    setOpenModal(true);
  };

  const closeModal = () => {
    resetForm();
    setOpenModal(false);
  };

  const handleEdit = async (id) => {
    try {
      const data = await getSupplierById(id);

      setFormData({
        supplierName: data.supplierName || "",
        contactNumber: data.contactNumber || "",
        email: data.email || "",
        gstNumber: data.gstNumber || "",
        address: data.address || "",
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
      await deleteSupplier(selectedDeleteItem._id);
      await getSupplier();

      toast.success("Supplier Deleted Successfully");
      setDeleteModalOpen(false);
      setSelectedDeleteItem(null);
    } catch (error) {
      toast.error(error);
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
        await updateSupplier(selectedId, formData);

        toast.success("Supplier Updated Successfully");
      } else {
        await addSupplier(formData);

        toast.success("Supplier Added Successfully");
      }

      await getSupplier();

      closeModal();
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
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
              Supplier Management
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Manage medicine suppliers and distributors.
            </p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 hover:shadow-md"
        >
          <FaPlus size={13} />
          Add Supplier
        </button>
      </div>

      <Modal
        isOpen={openModal}
        onClose={closeModal}
        title={editing ? "Update Supplier" : "Add Supplier"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Supplier Name
            </label>

            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              placeholder="Enter supplier name"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Contact Number
            </label>

            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="supplier@example.com"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              GST Number
            </label>

            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="Enter GST number"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter supplier address"
              rows={3}
              className="w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              required
            />
          </div>

            <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-stone-900 py-3 text-sm font-medium text-white transition hover:bg-stone-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? editing
                ? "Updating..."
                : "Saving..."
              : editing
                ? "Update Supplier"
                : "Save Supplier"}
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
        itemName={selectedDeleteItem?.supplierName}
        title="Delete Supplier"
        loading={loading}
      />
      <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-4 shadow-sm">
        <div className="relative">
          <input
            type="text"
            value={search}
            placeholder="Search supplier..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-stone-200 bg-stone-50/70">
              <tr>
                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  #
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Supplier
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  GST Number
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Address
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {supplier?.length > 0 ? (
                supplier.map((item, index) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-stone-50/80"
                  >
                    <td className="px-5 py-4 text-center text-sm text-stone-400">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-stone-900">
                      {item.supplierName}
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-600">
                      {item.contactNumber}
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-600">
                      {item.email || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-600">
                      {item.gstNumber || "-"}
                    </td>

                    <td className="max-w-xs px-5 py-4 text-sm text-stone-600">
                      <span className="line-clamp-2">
                        {item.address || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
                          title="Edit"
                        >
                          <FaEdit size={13} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDeleteItem(item);
                            setDeleteModalOpen(true);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:bg-stone-100 hover:text-red-600"
                          title="Delete"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <p className="text-sm font-medium text-stone-700">
                      No Suppliers Found
                    </p>

                    <p className="mt-1 text-xs text-stone-400">
                      Add a supplier to start managing your distributors.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
