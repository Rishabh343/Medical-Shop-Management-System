import React, { useContext, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import { CustomerContext } from "../../context/CustomerContext";

export default function Customers() {
  const {
    customer,
    loading,
    addCustomer,
    getCustomer,
    searchCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
  } = useContext(CustomerContext);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    getCustomer();
  }, []);

  const resetForm = () => {
    setFormData({
      customerName: "",
      phoneNumber: "",
      email: "",
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
      const data = await getCustomerById(id);

      setFormData({
        customerName: data.customerName || "",
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
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
    const confirmDelete = window.confirm("Delete this customer?");

    if (!confirmDelete) return;

    try {
      await deleteCustomer(id);
      await getCustomer();

      alert("Customer deleted successfully");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
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
        await updateCustomer(selectedId, formData);

        alert("Customer Updated Successfully");
      } else {
        await addCustomer(formData);

        alert("Customer Added Successfully");
      }

      await getCustomer();

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
            Customer Management
          </h1>

          <p className="text-gray-500">Manage all pharmacy customers.</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          Add Customer
        </button>
      </div>

      <Modal
        isOpen={openModal}
        onClose={closeModal}
        title={editing ? "Update Customer" : "Add Customer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
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
            {editing ? "Update Customer" : "Save Customer"}
          </button>
        </form>
      </Modal>
      <div className="bg-white rounded-xl shadow p-4">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;

            setSearch(value);

            if (value.trim() === "") {
              getCustomer();
            } else {
              searchCustomer(value);
            }
          }}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>

              <th className="p-3 text-left">Customer Name</th>

              <th className="p-3 text-left">Phone</th>

              <th className="p-3 text-left">Email</th>

              <th className="p-3 text-left">Address</th>

              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customer.length > 0 ? (
              customer.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 font-medium">{item.customerName}</td>

                  <td className="p-3">{item.phoneNumber}</td>

                  <td className="p-3">{item.email || "-"}</td>

                  <td className="p-3">{item.address || "-"}</td>

                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  No Customers Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
