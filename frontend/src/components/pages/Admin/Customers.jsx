import React, { useContext, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaFileDownload } from "react-icons/fa";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import { CustomerContext } from "../../context/CustomerContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
export default function Customers() {
  const navigate= useNavigate()
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
  useEffect(() => {
    // Set a timer to wait 500ms after the user stops typing
    const delayDebounceFn = setTimeout(() => {
      if (search.trim() === "") {
        getCustomer();
      } else {
        searchCustomer(search);
      }
    }, 500);

    // Cleanup: If the user types again before 500ms, destroy the old timer
    return () => clearTimeout(delayDebounceFn);
  }, [search]); // This runs every time 'search' changes
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
     toast.success("Customer deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
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
        toast.success("Customer Updated Successfully");
      } else {
        await addCustomer(formData);
        toast.success("Customer Added Successfully");
      }
      await getCustomer();
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
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
              Customers
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Customer Management
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Manage pharmacy customers and purchase records.
            </p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 hover:shadow-md"
        >
          <FaPlus size={13} />
          Add Customer
        </button>
      </div>

      <Modal
        isOpen={openModal}
        onClose={closeModal}
        title={editing ? "Update Customer" : "Add Customer"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Customer Name
            </label>

            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Phone Number
            </label>

            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
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
              placeholder="customer@example.com"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
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
              placeholder="Enter customer address"
              rows={3}
              className="w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-stone-900 py-3 text-sm font-medium text-white transition hover:bg-stone-800 hover:shadow-md"
          >
            {editing ? "Update Customer" : "Save Customer"}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Purchase History: ${
          selectedCustomer?.customerName || "Customer"
        }`}
      >
        <div className="space-y-5">
          {purchaseHistory && purchaseHistory.length > 0 ? (
            <div className="max-h-72 overflow-y-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 border-b border-stone-200 bg-stone-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Date
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Bill #
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {purchaseHistory.map((bill) => (
                    <tr key={bill._id} className="transition hover:bg-stone-50">
                      <td className="px-4 py-3 text-sm text-stone-600">
                        {new Date(bill.createdAt).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-4 py-3 text-sm text-stone-600">
                        {bill.billNumber}
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-semibold text-stone-900">
                        ₹{bill.finalAmount?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl bg-stone-50 py-10 text-center">
              <p className="text-sm font-medium text-stone-700">
                No purchase history found
              </p>

              <p className="mt-1 text-xs text-stone-400">
                This customer has no recorded purchases.
              </p>
            </div>
          )}

          <button
            onClick={downloadHistoryReport}
            disabled={!purchaseHistory || purchaseHistory.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            <FaFileDownload size={13} />
            Download PDF Report
          </button>
        </div>
      </Modal>

      <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead className="border-b border-stone-200 bg-stone-50/70">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  #
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Phone
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Address
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Rewards
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  History
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {customer.length > 0 ? (
                customer.map((item, index) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-stone-50/80"
                  >
                    <td className="px-5 py-4 text-sm text-stone-400">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-stone-900">
                        {item.customerName}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-600">
                      {item.phoneNumber}
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-600">
                      {item.email || "-"}
                    </td>

                    <td className="max-w-[220px] px-5 py-4 text-sm text-stone-600">
                      <span className="line-clamp-2">
                        {item.address || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex min-w-10 justify-center rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700">
                        {item.rewardPoints || "0"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleViewHistory(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 shadow-sm transition hover:bg-stone-50 hover:text-stone-900"
                      >
                        <FaEye size={12} />
                        View
                      </button>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <details className="group relative inline-block">
                        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 shadow-sm transition hover:bg-stone-50">
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

                        <div className="absolute right-0 z-30 mt-2 w-36 overflow-hidden rounded-xl border border-stone-200 bg-white p-1 text-left shadow-xl">
                          <button
                            type="button"
                            onClick={() => handleEdit(item._id)}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50"
                          >
                            <FaEdit size={12} />
                            Edit
                          </button>

                          {role === "Admin" && (
                            <>
                              <div className="my-1 border-t border-stone-100" />

                              <button
                                type="button"
                                onClick={() => handleDelete(item._id)}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                              >
                                <FaTrash size={12} />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </details>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-14 text-center">
                    <p className="text-sm font-medium text-stone-700">
                      No Customers Found
                    </p>

                    <p className="mt-1 text-xs text-stone-400">
                      Add a customer to start managing purchase records.
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
