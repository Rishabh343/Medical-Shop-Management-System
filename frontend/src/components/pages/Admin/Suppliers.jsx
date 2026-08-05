import React, { useContext, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { SupplierContext } from "../../context/SupplierConrtext";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";

export default function Suppliers() {
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

  const [formData, setFormData] = useState({
    supplierName: "",
    contactNumber: "",
    email: "",
    gstNumber: "",
    address: "",
  });

  useEffect(() => {
    getSupplier();
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;

    try {
      await deleteSupplier(id);
      await getSupplier();

      alert("Supplier Deleted Successfully");
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
        await updateSupplier(selectedId, formData);

        alert("Supplier Updated Successfully");
      } else {
        await addSupplier(formData);

        alert("Supplier Added Successfully");
      }

      await getSupplier();

      closeModal();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Supplier Management
          </h1>

          <p className="text-gray-500">
            Manage medicine suppliers and distributors.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          <FaPlus />
          Add Supplier
        </button>
      </div>

      <Modal
        isOpen={openModal}
        onClose={closeModal}
        title={editing ? "Update Supplier" : "Add Supplier"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            placeholder="Supplier Name"
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="GST Number"
            className="w-full border rounded-lg p-3"
          />

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            rows={3}
            className="w-full border rounded-lg p-3 resize-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            {editing ? "Update Supplier" : "Save Supplier"}
          </button>
        </form>
      </Modal>
      <div className="bg-white shadow rounded-xl p-4">
        <input
          type="text"
          value={search}
          placeholder="Search supplier..."
          onChange={(e) => {
            const value = e.target.value;

            setSearch(value);

            if (value.trim() === "") {
              getSupplier();
            } else {
              searchSupplier(value);
            }
          }}
          className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>

              <th className="p-3 text-left">Supplier</th>

              <th className="p-3 text-left">Contact</th>

              <th className="p-3 text-left">Email</th>

              <th className="p-3 text-left">GST Number</th>

              <th className="p-3 text-left">Address</th>

              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {supplier?.length > 0 ? (
              supplier.map((item, index) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 font-medium">{item.supplierName}</td>

                  <td className="p-3">{item.contactNumber}</td>

                  <td className="p-3">{item.email || "-"}</td>

                  <td className="p-3">{item.gstNumber || "-"}</td>

                  <td className="p-3">{item.address || "-"}</td>

                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No Suppliers Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
