import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

import { MedicineContext } from "../../context/MedicineContext";
import { CustomerContext } from "../../context/CustomerContext";
import { BillingContext } from "../../context/BillingContext";
import { useNavigate } from "react-router-dom";

export default function Billing() {
  const { createBill } = useContext(BillingContext);
  const { medicine, getMedicine } = useContext(MedicineContext);
  const { customer, getCustomer } = useContext(CustomerContext);

  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [selectedMedicine, setSelectedMedicine] = useState("");

  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getMedicine();
    getCustomer();
  }, []);

  const addMedicine = () => {
    if (!selectedMedicine) return;

    const medicineData = medicine.find((item) => item._id === selectedMedicine);

    if (!medicineData) return;

    const alreadyAdded = items.find(
      (item) => item.medicineId === medicineData._id,
    );

    if (alreadyAdded) {
      alert("Medicine already added.");
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

  const handleGenerateBill = async () => {
    if (!selectedCustomer) {
      alert("Select Customer");
      return;
    }

    if (items.length === 0) {
      alert("Add Medicines");
      return;
    }

    const billData = {
      customerId: selectedCustomer,
      paymentMethod,

      medicines: items.map((item) => ({
        medicineId: item.medicineId,
        quantity: item.quantity,
      })),
    };

    try {
      const bill = await createBill(billData);
      navigate(`/invoice/${bill._id}`);
      alert("Bill Generated Successfully");

      setSelectedCustomer("");
      setPaymentMethod("Cash");
      setItems([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>

          <p className="text-gray-500">Create customer invoice</p>
        </div>

        <button
          onClick={handleGenerateBill}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Generate Bill
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-5">Customer Details</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option value="">Select Customer</option>

            {customer.map((item) => (
              <option key={item._id} value={item._id}>
                {item.customerName} ({item.phoneNumber})
              </option>
            ))}
          </select>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option value="Cash">Cash</option>

            <option value="UPI">UPI</option>

            <option value="Card">Card</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Medicines</h2>

          <div className="flex gap-3">
            <select
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
              className="border rounded-lg p-2 w-72"
            >
              <option value="">Select Medicine</option>

              {medicine.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.medicineName}
                  {" | "}₹{item.sellingPrice}
                  {" | Stock "}
                  {item.stockQuantity}
                </option>
              ))}
            </select>

            <button
              onClick={addMedicine}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg"
            >
              <FaPlus />
              Add Medicine
            </button>
          </div>
        </div>
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
                <tr key={item.medicineId} className="border-b">
                  <td className="p-3">{item.medicineName}</td>

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
                      className="border rounded w-20 text-center p-1"
                    />
                  </td>

                  <td className="p-3 text-center">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeMedicine(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No Medicines Added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-5">Bill Summary</h2>

        <div className="space-y-4">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg">
            <span>GST (10%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>

          <div className="border-t pt-4 flex justify-between text-2xl font-bold">
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-end pt-5">
            <button
              onClick={handleGenerateBill}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Generate Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
