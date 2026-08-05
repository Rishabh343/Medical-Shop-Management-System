import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { MedicineContext } from "../../context/MedicineContext";
import { CustomerContext } from "../../context/CustomerContext";
import { BillingContext } from "../../context/BillingContext";
import { useNavigate } from "react-router-dom";

export default function Billing() {
  const navigate = useNavigate();
  const { createBill } = useContext(BillingContext);
  const { medicine, getMedicine } = useContext(MedicineContext);
  const { customer, getCustomer } = useContext(CustomerContext);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [items, setItems] = useState([]);
  // Search
  const [customerSearch, setCustomerSearch] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");
  // Reward Points
  const [rewardPoints, setRewardPoints] = useState(0);
  const [rewardPointsToRedeem, setRewardPointsToRedeem] = useState(0);
  useEffect(() => {
    getMedicine();
    getCustomer();
  }, []);

  // Customer Search
  const filteredCustomers = customer.filter(
    (item) =>
      item.customerName.toLowerCase().includes(customerSearch.toLowerCase()) ||
      item.phoneNumber.includes(customerSearch),
  );
  // Medicine Search
  const filteredMedicines = medicine.filter((item) =>
    item.medicineName.toLowerCase().includes(medicineSearch.toLowerCase()),
  );
  // Customer Selection
  const handleCustomerSelect = (id) => {
    setSelectedCustomer(id);
    const selected = customer.find((item) => item._id === id);

    if (selected) {
      setRewardPoints(selected.rewardPoints);

      setRewardPointsToRedeem(0);

      setCustomerSearch(`${selected.customerName} (${selected.phoneNumber})`);
    }
  };

  // Medicine Selection
  const handleMedicineSelect = (id) => {
    setSelectedMedicine(id);

    const selected = medicine.find((item) => item._id === id);

    if (selected) {
      setMedicineSearch(`${selected.medicineName} | ₹${selected.sellingPrice}`);
    }
  };

  // Add Medicine
  const addMedicine = () => {
    if (!selectedMedicine) return;

    const medicineData = medicine.find((item) => item._id === selectedMedicine);

    if (!medicineData) return;

    const exists = items.find((item) => item.medicineId === medicineData._id);

    if (exists) {
      alert("Medicine already added");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        medicineId: medicineData._id,
        medicineName: medicineData.medicineName,
        price: medicineData.sellingPrice,
        quantity: 1,
        stock: medicineData.stockQuantity,
      },
    ]);

    setSelectedMedicine("");

    setMedicineSearch("");
  };

  // Quantity
  const handleQuantityChange = (index, quantity) => {
    const updated = [...items];

    if (Number(quantity) > updated[index].stock) {
      alert("Stock not available");
      return;
    }

    updated[index].quantity = Number(quantity);

    setItems(updated);
  };

  // Remove Medicine
  const removeMedicine = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
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
      setSelectedMedicine("");
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-gray-500">Create Customer Invoice</p>
        </div>
        <button
          onClick={handleGenerateBill}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Generate Bill
        </button>
      </div>
      {/* Customer Details */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-5">Customer Details</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Customer Search */}
          <div className="relative">
            <label className="font-medium">Customer</label>
            <div className="relative mt-2">
              <FaSearch className="absolute left-3 top-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Customer..."
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setSelectedCustomer("");
                }}
                className="w-full border rounded-lg pl-10 pr-4 py-3"
              />
            </div>
            {customerSearch && !selectedCustomer && (
              <div className="absolute w-full bg-white border rounded-lg shadow-lg max-h-56 overflow-y-auto z-20">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleCustomerSelect(item._id)}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                    >
                      <div className="font-semibold">{item.customerName}</div>
                      <div className="text-sm text-gray-500">
                        {item.phoneNumber}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500">No Customer Found</div>
                )}
              </div>
            )}
          </div>
          {/* Payment */}
          <div>
            <label className="font-medium">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded-lg p-3 mt-2"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
            </select>
          </div>
        </div>
        {/* Reward Points */}
        {selectedCustomer && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Reward Points</h3>
                <p className="text-gray-500 text-sm">Available Balance</p>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {rewardPoints}
              </div>
            </div>
            <div className="mt-4">
              <label className="font-medium">Redeem Reward Points</label>
              <input
                type="number"
                min={0}
                max={rewardPoints}
                value={rewardPointsToRedeem}
                onChange={(e) =>
                  setRewardPointsToRedeem(Number(e.target.value))
                }
                className="w-full border rounded-lg p-3 mt-2"
              />
              <button
                type="button"
                onClick={() => setRewardPointsToRedeem(rewardPoints)}
                className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
              >
                Redeem Maximum
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Medicines */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Medicines</h2>
          <div className="flex gap-3">
            <div className="relative w-96">
              <FaSearch className="absolute left-3 top-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Medicine..."
                value={medicineSearch}
                onChange={(e) => {
                  setMedicineSearch(e.target.value);
                  setSelectedMedicine("");
                }}
                className="w-full border rounded-lg pl-10 pr-4 py-3"
              />
              {medicineSearch && !selectedMedicine && (
                <div className="absolute w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto z-20">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleMedicineSelect(item._id)}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                      >
                        <div className="font-semibold">{item.medicineName}</div>
                        <div className="text-sm text-gray-500">
                          ₹{item.sellingPrice}
                          {" • "}
                          Stock :{item.stockQuantity}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">No Medicine Found</div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={addMedicine}
              className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-lg flex items-center gap-2"
            >
              <FaPlus />
              Add
            </button>
          </div>
        </div>{" "}
        {/* Medicine Table */}
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Medicine</th>

              <th className="p-3 text-center">Stock</th>

              <th className="p-3 text-center">Price</th>

              <th className="p-3 text-center">Quantity</th>

              <th className="p-3 text-center">Total</th>

              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.medicineId} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.medicineName}</td>

                  <td className="p-3 text-center">{item.stock}</td>

                  <td className="p-3 text-center">₹{item.price}</td>

                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min={1}
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      className="border rounded-lg w-20 text-center py-1"
                    />
                  </td>

                  <td className="p-3 text-center font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeMedicine(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No Medicines Added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bill Summary */}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Bill Summary</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>

            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>GST (10%)</span>

            <span>₹{gst.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Reward Discount</span>

            <span>- ₹{discount.toFixed(2)}</span>
          </div>

          <hr />

          <div className="flex justify-between text-2xl font-bold">
            <span>Grand Total</span>

            <span>₹{finalTotal.toFixed(2)}</span>
          </div>

          <div className="bg-blue-50 border rounded-lg p-4 mt-4">
            <div className="flex justify-between">
              <span>Reward Points Used</span>

              <span className="font-semibold">⭐ {rewardPointsToRedeem}</span>
            </div>

            <div className="flex justify-between mt-2">
              <span>Reward Points You'll Earn</span>

              <span className="font-semibold text-green-600">
                ⭐{Math.floor(finalTotal / 100)}
              </span>
            </div>
          </div>

          <div className="pt-5 flex justify-end">
            <button
              onClick={handleGenerateBill}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg"
            >
              Generate Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
