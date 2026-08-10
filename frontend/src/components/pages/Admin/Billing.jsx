import React, { useContext, useMemo, useState, useEffect } from "react";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { MedicineContext } from "../../context/MedicineContext";
import { CustomerContext } from "../../context/CustomerContext";
import { BillingContext } from "../../context/BillingContext";
import { useNavigate } from "react-router-dom";

export default function Billing() {
  const navigate = useNavigate();
  const { createBill } = useContext(BillingContext);
  
  const { medicine, searchMedicine } = useContext(MedicineContext);
  const { customer, searchCustomer } = useContext(CustomerContext);

  // States
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedMedicineObj, setSelectedMedicineObj] = useState(null); 
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [items, setItems] = useState([]);
  
  // Search Inputs
  const [customerSearch, setCustomerSearch] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");
  
  // Dropdown Visibility
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);

  // Reward Points
  const [rewardPoints, setRewardPoints] = useState(0);
  const [rewardPointsToRedeem, setRewardPointsToRedeem] = useState(0);


  useEffect(() => {
    // If the input is empty or a customer is already selected, don't search
    if (!customerSearch.trim() || selectedCustomer) {
      setShowCustomerDropdown(false);
      return;
    }

    // Set a timer to wait for 500ms after the user stops typing
    const delayDebounceFn = setTimeout(async () => {
      await searchCustomer(customerSearch);
      setShowCustomerDropdown(true);
    }, 500);

    // Cleanup function clears the timer if the user types again before 500ms
    return () => clearTimeout(delayDebounceFn);
  }, [customerSearch, selectedCustomer]);



  useEffect(() => {
    // If the input is empty or a medicine is already selected, don't search
    if (!medicineSearch.trim() || selectedMedicineObj) {
      setShowMedicineDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      await searchMedicine(medicineSearch);
      setShowMedicineDropdown(true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [medicineSearch, selectedMedicineObj]);

  const handleCustomerSelect = (cust) => {
    setSelectedCustomer(cust._id);
    setRewardPoints(cust.rewardPoints || 0);
    setRewardPointsToRedeem(0);
    setCustomerSearch(`${cust.customerName} (${cust.phoneNumber})`);
    setShowCustomerDropdown(false);
  };

  const handleMedicineSelect = (med) => {
    setSelectedMedicineObj(med);
    setMedicineSearch(`${med.medicineName} | ₹${med.sellingPrice}`);
    setShowMedicineDropdown(false);
  };

  const addMedicine = () => {
    if (!selectedMedicineObj) {
      alert("Please search and select a medicine first.");
      return;
    }

    const exists = items.find((item) => item.medicineId === selectedMedicineObj._id);
    if (exists) {
      alert("Medicine already added");
      return;
    }

    if (selectedMedicineObj.stockQuantity <= 0) {
      alert("This medicine is out of stock!");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        medicineId: selectedMedicineObj._id,
        medicineName: selectedMedicineObj.medicineName,
        price: selectedMedicineObj.sellingPrice,
        quantity: 1,
        stock: selectedMedicineObj.stockQuantity,
      },
    ]);

    setSelectedMedicineObj(null);
    setMedicineSearch("");
  };


  const handleQuantityChange = (index, quantity) => {
    const updated = [...items];
    if (Number(quantity) > updated[index].stock) {
      alert("Stock not available");
      return;
    }
    updated[index].quantity = Number(quantity);
    setItems(updated);
  };

  const removeMedicine = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const gst = useMemo(() => {
    return subtotal * 0.1;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return subtotal + gst;
  }, [subtotal, gst]);

  const discount = useMemo(() => {
    return Math.min(rewardPoints, rewardPointsToRedeem);
  }, [rewardPoints, rewardPointsToRedeem]);

  const finalTotal = useMemo(() => {
    return grandTotal - discount;
  }, [grandTotal, discount]);


  const handleGenerateBill = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one medicine.");
      return;
    }
    if (rewardPointsToRedeem > rewardPoints) {
      alert("Reward points exceed available balance.");
      return;
    }

    const billData = {
      customerId: selectedCustomer,
      paymentMethod,
      rewardPointsToRedeem,
      medicines: items.map((item) => ({
        medicineId: item.medicineId,
        quantity: item.quantity,
      })),
    };

    try {
      const bill = await createBill(billData);
      alert("Bill Generated Successfully");
      navigate(`/invoice/${bill.data._id}`);
      
      // Reset Form
      setSelectedCustomer("");
      setCustomerSearch("");
      setSelectedMedicineObj(null);
      setMedicineSearch("");
      setRewardPoints(0);
      setRewardPointsToRedeem(0);
      setItems([]);
      setPaymentMethod("Cash");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to generate bill.");
    }
  };

  return (
  <div className="space-y-6">

    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          Sales
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
          Billing
        </h1>

        <p className="mt-1 text-sm text-stone-500">
          Create and manage customer invoices.
        </p>
      </div>

      <button
        onClick={handleGenerateBill}
        className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 hover:shadow-md"
      >
        Generate Bill
      </button>
    </div>

    <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-5 shadow-sm">

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">
            Customer Details
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Select a customer and payment method.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Customer
          </label>

          <div className="relative">
            <FaSearch
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              placeholder="Search name or phone..."
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                setSelectedCustomer("");
              }}
              className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
          </div>

          {showCustomerDropdown && (
            <div className="absolute left-0 right-0 z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border border-stone-200 bg-white p-1 shadow-xl">

              {customer.length > 0 ? (
                customer.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleCustomerSelect(item)}
                    className="cursor-pointer rounded-lg px-4 py-3 transition hover:bg-stone-50"
                  >
                    <div className="text-sm font-semibold text-stone-900">
                      {item.customerName}
                    </div>

                    <div className="mt-1 text-xs text-stone-500">
                      {item.phoneNumber}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-sm text-stone-500">
                  No customer found
                </div>
              )}

            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Payment Method
          </label>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
          >
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
          </select>
        </div>

      </div>

      {selectedCustomer && (
        <div className="mt-5 rounded-xl border border-stone-200 bg-white p-4">

          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Reward Points
              </p>

              <p className="mt-1 text-sm text-stone-500">
                Available balance
              </p>
            </div>

            <div className="text-xl font-semibold text-stone-900">
              {rewardPoints}
            </div>

          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Redeem Reward Points
              </label>

              <input
                type="number"
                min={0}
                max={rewardPoints}
                value={rewardPointsToRedeem}
                onChange={(e) =>
                  setRewardPointsToRedeem(Number(e.target.value))
                }
                className="w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <button
              type="button"
              onClick={() => setRewardPointsToRedeem(rewardPoints)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              Redeem Maximum
            </button>

          </div>

        </div>
      )}

    </div>

    <div className="overflow-visible rounded-2xl border border-stone-200 bg-[#faf9f6] p-5 shadow-sm">

      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-lg font-semibold text-stone-900">
            Medicines
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Add medicines to the current invoice.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:max-w-lg">

          <div className="relative w-full">

            <FaSearch
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              placeholder="Search medicine..."
              value={medicineSearch}
              onChange={(e) => {
                setMedicineSearch(e.target.value);
                setSelectedMedicineObj(null);
              }}
              className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />

            {showMedicineDropdown && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-stone-200 bg-white p-1 shadow-xl">

                {medicine.length > 0 ? (
                  medicine.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleMedicineSelect(item)}
                      className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-4 py-3 transition hover:bg-stone-50"
                    >
                      <div>
                        <div className="text-sm font-semibold text-stone-900">
                          {item.medicineName}
                        </div>

                        <div className="mt-1 text-xs text-stone-500">
                          ₹{item.sellingPrice}
                        </div>
                      </div>

                      <div className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                        Stock: {item.stockQuantity}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-4 text-sm text-stone-500">
                    No medicine found
                  </div>
                )}

              </div>
            )}

          </div>

          <button
            onClick={addMedicine}
            className="flex items-center gap-2 rounded-xl bg-stone-900 px-4 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            <FaPlus size={12} />
            Add
          </button>

        </div>

      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">

        <table className="w-full min-w-[760px]">

          <thead className="border-b border-stone-200 bg-stone-50">

            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                Medicine
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                Stock
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                Price
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                Quantity
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                Total
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                Action
              </th>
            </tr>

          </thead>

          <tbody className="divide-y divide-stone-100">

            {items.length > 0 ? (
              items.map((item, index) => (
                <tr
                  key={item.medicineId}
                  className="transition hover:bg-stone-50"
                >

                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-stone-900">
                      {item.medicineName}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-stone-500">
                    {item.stock}
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-stone-700">
                    ₹{item.price}
                  </td>

                  <td className="px-4 py-4 text-center">

                    <input
                      type="number"
                      min={1}
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          index,
                          e.target.value,
                        )
                      }
                      className="w-20 rounded-lg border border-stone-200 bg-[#faf9f6] px-2 py-1.5 text-center text-sm text-stone-900 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                    />

                  </td>

                  <td className="px-4 py-4 text-center text-sm font-semibold text-stone-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </td>

                  <td className="px-4 py-4 text-center">

                    <button
                      onClick={() => removeMedicine(index)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-400 transition hover:border-stone-300 hover:bg-stone-50 hover:text-red-600"
                    >
                      <FaTrash size={12} />
                    </button>

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center"
                >
                  <p className="text-sm font-medium text-stone-700">
                    No Medicines Added
                  </p>

                  <p className="mt-1 text-xs text-stone-400">
                    Search and add medicines to create the invoice.
                  </p>
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>

    <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-6 shadow-sm">

      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          Invoice
        </p>

        <h2 className="mt-1 text-lg font-semibold text-stone-900">
          Bill Summary
        </h2>
      </div>

      <div className="mx-auto max-w-xl">

        <div className="space-y-4 text-sm">

          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>

            <span className="font-medium text-stone-900">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>GST (10%)</span>

            <span className="font-medium text-stone-900">
              ₹{gst.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>Reward Discount</span>

            <span className="font-medium text-stone-900">
              - ₹{discount.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-stone-200 pt-4">

            <div className="flex items-center justify-between">

              <span className="text-base font-semibold text-stone-900">
                Grand Total
              </span>

              <span className="text-2xl font-semibold tracking-tight text-stone-900">
                ₹{finalTotal.toFixed(2)}
              </span>

            </div>

          </div>

        </div>

        <div className="mt-5 rounded-xl border border-stone-200 bg-white p-4">

          <div className="flex justify-between text-sm text-stone-600">
            <span>Reward Points Used</span>

            <span className="font-semibold text-stone-900">
              {rewardPointsToRedeem}
            </span>
          </div>

          <div className="mt-3 flex justify-between text-sm text-stone-600">
            <span>Reward Points You'll Earn</span>

            <span className="font-semibold text-stone-900">
              {Math.floor(finalTotal / 100)}
            </span>
          </div>

        </div>

        <button
          onClick={handleGenerateBill}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 hover:shadow-md"
        >
          Generate Bill
        </button>

      </div>

    </div>

  </div>
);
}