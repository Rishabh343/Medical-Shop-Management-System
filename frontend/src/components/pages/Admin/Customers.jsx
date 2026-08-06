import React, { useContext, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaFileDownload } from "react-icons/fa";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import { CustomerContext } from "../../context/CustomerContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Customers() {
  const {
    customer,
    loading,
    addCustomer,
    getCustomer,
    purchaseHistory,
    getCustomerPurchaseHistory,
    searchCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
  } = useContext(CustomerContext);

  const [search, setSearch] = useState("");

  // States for Add/Edit Modal
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // States for History Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const role = localStorage.getItem("role");
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

  // --- HISTORY LOGIC ---
  const handleViewHistory = async (customerItem) => {
    setSelectedCustomer(customerItem);
    await getCustomerPurchaseHistory(customerItem._id);
    setHistoryModalOpen(true);
  };

  const downloadHistoryReport = () => {
    if (!purchaseHistory || purchaseHistory.length === 0) {
      alert("No purchase history available to download.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`Purchase History: ${selectedCustomer?.customerName}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Phone: ${selectedCustomer?.phoneNumber || "N/A"}`, 14, 22);

    const tableColumn = [
      "Date",
      "Bill Number",
      "Payment Method",
      "Status",
      "Amount",
    ];
    const tableRows = purchaseHistory.map((bill) => [
      new Date(bill.createdAt).toLocaleDateString("en-IN"),
      bill.billNumber,
      bill.paymentMethod || "N/A",
      bill.paymentStatus || "Completed",
      `Rs. ${bill.finalAmount?.toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`${selectedCustomer?.customerName}_History.pdf`);
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
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          Add Customer
        </button>
      </div>

      {/* --- ADD / EDIT CUSTOMER MODAL --- */}
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
            className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            rows={3}
            className="w-full border rounded-lg p-3 resize-none outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            {editing ? "Update Customer" : "Save Customer"}
          </button>
        </form>
      </Modal>

      {/* --- VIEW HISTORY MODAL --- */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`History: ${selectedCustomer?.customerName || "Customer"}`}
      >
        <div className="space-y-4">
          {purchaseHistory && purchaseHistory.length > 0 ? (
            <div className="max-h-64 overflow-y-auto border rounded-lg shadow-inner">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-3 border-b">Date</th>
                    <th className="p-3 border-b">Bill #</th>
                    <th className="p-3 border-b text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.map((bill) => (
                    <tr key={bill._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {new Date(bill.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-3 text-gray-600">{bill.billNumber}</td>
                      <td className="p-3 font-semibold text-right">
                        ₹{bill.finalAmount?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No purchase history found for this customer.
            </div>
          )}

          <button
            onClick={downloadHistoryReport}
            disabled={!purchaseHistory || purchaseHistory.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaFileDownload />
            Download PDF Report
          </button>
        </div>
      </Modal>

      {/* --- SEARCH BAR --- */}
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

      {/* --- CUSTOMERS TABLE --- */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">#</th>
              <th className="p-4 text-left font-semibold text-gray-700">
                Customer Name
              </th>
              <th className="p-4 text-left font-semibold text-gray-700">
                Phone
              </th>
              <th className="p-4 text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="p-4 text-left font-semibold text-gray-700">
                Address
              </th>
              <th className="p-4 text-left font-semibold text-gray-700">
                Reward Points
              </th>
              <th className="p-4 text-center font-semibold text-gray-700">
                History
              </th>
              <th className="p-4 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {customer.length > 0 ? (
              customer.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-gray-500">{index + 1}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {item.customerName}
                  </td>
                  <td className="p-4 text-gray-600">{item.phoneNumber}</td>
                  <td className="p-4 text-gray-600">{item.email || "-"}</td>
                  <td className="p-4 text-gray-600">{item.address || "-"}</td>
                  <td className="p-4 text-gray-600">
                    {item.rewardPoints || "0"}
                  </td>
                  {/* History Button Column */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleViewHistory(item)}
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 px-3 py-1.5 rounded-full transition"
                    >
                      <FaEye /> View
                    </button>
                  </td>

                  {/* Actions Column */}
                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="text-indigo-500 hover:text-indigo-700 transition"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>

                      {role === "Admin" && (
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-12 text-gray-500 font-medium"
                >
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
