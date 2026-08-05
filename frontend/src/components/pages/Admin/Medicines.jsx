import React, { useContext, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import { MedicineContext } from "../../context/MedicineContext";
import { SupplierContext } from "../../context/SupplierConrtext";

export default function Medicines() {
  const {
    medicine,
    loading,
    getMedicine,
    getByMedicineId,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    searchMedicine,
    filterMedicine,
  } = useContext(MedicineContext);

  const { supplier, getSupplier } = useContext(SupplierContext);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    medicineName: "",
    category: "",
    company: "",
    batchNumber: "",
    expiryDate: "",
    purchasePrice: "",
    sellingPrice: "",
    stockQuantity: "",
    // reorderLevel: "",
    supplier: "",
  });

  useEffect(() => {
    getMedicine();
    getSupplier();
  }, []);

  const resetForm = () => {
    setFormData({
      medicineName: "",
      category: "",
      company: "",
      batchNumber: "",
      expiryDate: "",
      purchasePrice: "",
      sellingPrice: "",
      stockQuantity: "",
      // reorderLevel: "",
      supplier: "",
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
      const data = await getByMedicineId(id);

      setFormData({
        medicineName: data.medicineName || "",
        category: data.category || "",
        company: data.company || "",
        expiryDate: data.expiryDate ? data.expiryDate.substring(0, 10) : "",
        purchasePrice: data.purchasePrice || "",
        sellingPrice: data.sellingPrice || "",
        stockQuantity: data.stockQuantity || "",
        // reorderLevel: data.reorderLevel || "",
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
      await getMedicine();

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

      await getMedicine();

      closeModal();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    if (value.trim() === "") {
      getMedicine();
    } else {
      searchMedicine(value);
    }
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medicine Management</h1>

          <p className="text-gray-500">Manage all medicines.</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          Add Medicine
        </button>
      </div>

      <Modal
        isOpen={openModal}
        onClose={closeModal}
        title={editing ? "Update Medicine" : "Add Medicine"}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="medicineName"
            value={formData.medicineName}
            onChange={handleChange}
            placeholder="Medicine Name"
            className="border rounded-lg p-2"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded-lg p-2"
          >
            <option value="">Category</option>
            <option>Tablet</option>
            <option>Capsule</option>
            <option>Syrup</option>
            <option>Injection</option>
          </select>

          <input
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
            placeholder="Batch Number"
            className="border rounded-lg p-2"
          />

          <input
            type="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
            className="border rounded-lg p-2"
          />
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="border rounded-lg p-2"
          >
            <option value="">Select Supplier</option>

            {supplier.map((item) => (
              <option key={item._id} value={item._id}>
                {item.supplierName}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            placeholder="Purchase Price"
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            name="sellingPrice"
            value={formData.sellingPrice}
            onChange={handleChange}
            placeholder="Selling Price"
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            placeholder="Stock Quantity"
            className="border rounded-lg p-2"
          />

          {/* <input
            type="number"
            name="reorderLevel"
            value={formData.reorderLevel}
            onChange={handleChange}
            placeholder="Reorder Level"
            className="border rounded-lg p-2"
          /> */}

          <button
            type="submit"
            className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            {editing ? "Update Medicine" : "Add Medicine"}
          </button>
        </form>
      </Modal>
      <div className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={handleSearch}
          className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          onChange={(e) => filterMedicine(e.target.value,"")}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Categories</option>
          <option value="Tablet">Tablet</option>
          <option value="Capsule">Capsule</option>
          <option value="Syrup">Syrup</option>
          <option value="Injection">Injection</option>
        </select>
      </div>

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>

              <th className="p-3 text-left">Medicine</th>

              <th className="p-3 text-left">Category</th>

              <th className="p-3 text-left">Company</th>

              <th className="p-3 text-left">Batch</th>

              <th className="p-3 text-center">Stock</th>

              <th className="p-3 text-center">Purchase</th>

              <th className="p-3 text-center">Selling</th>

              <th className="p-3 text-center">Supplier</th>

              <th className="p-3 text-center">Expiry</th>

              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {medicine.length > 0 ? (
              medicine.map((item, index) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 font-medium">{item.medicineName}</td>

                  <td className="p-3">{item.category}</td>

                  <td className="p-3">{item.company}</td>

                  <td className="p-3">{item.batchNumber}</td>

                  <td className="p-3 text-center">{item.stockQuantity}</td>

                  <td className="p-3 text-center">₹{item.purchasePrice}</td>

                  <td className="p-3 text-center font-semibold text-green-600">
                    ₹{item.sellingPrice}
                  </td>

                  <td className="p-3 text-center">
                    {item.supplier?.supplierName || "-"}
                  </td>

                  <td className="p-3 text-center">
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-8 text-gray-500">
                  No Medicines Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
