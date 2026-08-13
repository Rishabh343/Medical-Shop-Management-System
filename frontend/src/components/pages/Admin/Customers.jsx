import React, { useContext, useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaFileDownload,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import { CustomerContext } from "../../context/CustomerContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DeleteModal from "../../common/DeleteModal";
export default function Customers() {
  const navigate = useNavigate();
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

  // States for  Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
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
    const delayDebounceFn = setTimeout(() => {
      if (search.trim() === "") {
        getCustomer();
      } else {
        searchCustomer(search);
      }
    }, 500);
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

  const handleDelete = async () => {
    if (!selectedDeleteItem) return;

    try {
      await deleteCustomer(selectedDeleteItem._id);
      await getCustomer();
      toast.success("Customer deleted successfully");
      setDeleteModalOpen(false);
      setSelectedDeleteItem(null);
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
        size="xl"
      >
        <div className="space-y-5">
          {selectedCustomer && (
            <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                    Customer
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {selectedCustomer.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                    Phone
                  </p>
                  <p className="mt-1 text-sm text-stone-700">
                    {selectedCustomer.phoneNumber || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                    Total Orders
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {selectedCustomer.totalOrders || 0}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                    Reward Points
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {selectedCustomer.rewardPoints || 0}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-stone-200 pt-4">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                    Lifetime Purchase
                  </p>

                  <p className="mt-1 text-lg font-semibold text-stone-900">
                    ₹
                    {Number(
                      selectedCustomer.lifetimePurchase || 0,
                    ).toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                    Last Purchase
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-700">
                    {selectedCustomer.lastPurchase
                      ? new Date(
                          selectedCustomer.lastPurchase,
                        ).toLocaleDateString("en-IN")
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {purchaseHistory && purchaseHistory.length > 0 ? (
            <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-stone-200">
              <div className="divide-y divide-stone-100">
                {purchaseHistory.map((bill) => (
                  <div
                    key={bill._id}
                    className="p-4 transition hover:bg-stone-50/70"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                            <FaFileInvoiceDollar size={13} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-stone-900">
                              {bill.billNumber}
                            </p>

                            <p className="text-xs text-stone-400">
                              {new Date(
                                bill.createdAt || bill.billDate,
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          bill.paymentStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {bill.paymentStatus || "Pending"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {/* <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400">
                    Items
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-700">
                    {bill.items?.length || 0}
                  </p>
                </div> */}

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-stone-400">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-medium text-stone-700">
                          ₹
                          {Number(bill.totalAmount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-stone-400">
                          Discount
                        </p>

                        <p className="mt-1 text-sm font-medium text-stone-700">
                          ₹{Number(bill.discount || 0).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-stone-400">
                          Final Amount
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-900">
                          ₹
                          {Number(bill.finalAmount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    </div>

                    {bill.items?.length > 0 && (
                      <div className="mt-4 rounded-xl bg-stone-50 p-3">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                          Medicines
                        </p>

                        <div className="space-y-2">
                          {bill.items.map((item, index) => (
                            <div
                              key={`${bill._id}-${index}`}
                              className="flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-medium text-stone-700">
                                  {item.medicine?.medicineName || "Medicine"}
                                </p>

                                <p className="text-[10px] text-stone-400">
                                  Qty: {item.quantity} × ₹
                                  {Number(
                                    item.sellingPrice || 0,
                                  ).toLocaleString("en-IN")}
                                </p>
                              </div>

                              <p className="shrink-0 font-semibold text-stone-800">
                                ₹
                                {Number(item.totalPrice || 0).toLocaleString(
                                  "en-IN",
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[10px] text-stone-400">Payment</p>
                          <p className="text-xs font-medium text-stone-700">
                            {bill.paymentMethod || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-stone-400">Rewards</p>
                          <p className="text-xs font-medium text-stone-700">
                            +{bill.rewardPointsEarned || 0}
                          </p>
                        </div>

                        {bill.rewardPointsRedeemed > 0 && (
                          <div>
                            <p className="text-[10px] text-stone-400">
                              Redeemed
                            </p>
                            <p className="text-xs font-medium text-stone-700">
                              {bill.rewardPointsRedeemed}
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(`/invoice/${bill._id}`)}
                        className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
                      >
                        <FaEye size={11} />
                        View Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-stone-50 py-10 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-400">
                <FaFileInvoiceDollar size={15} />
              </div>

              <p className="text-sm font-medium text-stone-700">
                No purchase history found
              </p>

              <p className="mt-1 text-xs text-stone-400">
                This customer has no recorded purchases.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={downloadHistoryReport}
            disabled={!purchaseHistory || purchaseHistory.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            <FaFileDownload size={13} />
            Download Customer Report
          </button>
        </div>
      </Modal>
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDeleteItem(null);
        }}
        onConfirm={handleDelete}
        itemName={selectedDeleteItem?.customerName}
        title="Delete Customer"
        loading={loading}
      />
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
                                onClick={() => {
                                  setSelectedDeleteItem(item);
                                  setDeleteModalOpen(true);
                                }}
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
