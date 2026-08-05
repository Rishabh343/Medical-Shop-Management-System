import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BillingContext } from "../context/BillingContext";


export default function Invoice() {
  const { id } = useParams();
  const { getBillById } = useContext(BillingContext);

  const [bill, setBill] = useState(null);

  useEffect(() => {
    const fetchBill = async () => {
      const data = await getBillById(id);
      setBill(data);
    };

    fetchBill();
  }, [id]);

  if (!bill) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Invoice...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 my-8">

      <div className="flex justify-between items-center border-b pb-4">

        <div>
          <h1 className="text-3xl font-bold text-blue-700">
            MediCare Pharmacy
          </h1>

          <p className="text-gray-500">
            Pharmacy Management System
          </p>
        </div>

        <div className="text-right">
          <h2 className="text-2xl font-bold">
            INVOICE
          </h2>

          <p>
            Bill No :
            <span className="font-semibold">
              {" "}
              {bill.billNumber}
            </span>
          </p>

          <p>
            Date :
            {" "}
            {new Date(
              bill.createdAt
            ).toLocaleDateString()}
          </p>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">

        <div>

          <h3 className="font-semibold text-lg mb-2">
            Customer Details
          </h3>

          <p>
            <strong>Name :</strong>{" "}
            {bill.customer?.name}
          </p>

          <p>
            <strong>Phone :</strong>{" "}
            {bill.customer?.phone}
          </p>

          <p>
            <strong>Email :</strong>{" "}
            {bill.customer?.email}
          </p>

          <p>
            <strong>Address :</strong>{" "}
            {bill.customer?.address}
          </p>

        </div>

        <div className="text-right">

          <p>
            <strong>Payment :</strong>{" "}
            {bill.paymentMethod}
          </p>

          <p>
            <strong>Status :</strong>{" "}
            {bill.paymentStatus}
          </p>

        </div>

      </div>

      <div className="mt-8 overflow-x-auto">

        <table className="w-full border">

          <thead className="bg-gray-100">

            <tr>

              <th className="border p-3">
                Medicine
              </th>

              <th className="border p-3">
                Price
              </th>

              <th className="border p-3">
                Qty
              </th>

              <th className="border p-3">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {bill.items.map((item) => (
              <tr key={item._id}>

                <td className="border p-3">
                  {item.medicine?.medicineName}
                </td>

                <td className="border p-3 text-center">
                  ₹{item.sellingPrice}
                </td>

                <td className="border p-3 text-center">
                  {item.quantity}
                </td>

                <td className="border p-3 text-center">
                  ₹{item.totalPrice}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <div className="flex justify-end mt-8">

        <div className="w-72 space-y-2">

          <div className="flex justify-between">
            <span>Total Amount</span>

            <span className="font-semibold">
              ₹{bill.totalAmount}
            </span>
          </div>

        </div>

      </div>

      <div className="mt-10 flex justify-between">

        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Print Invoice
        </button>

        <p className="text-gray-500">
          Thank You! Visit Again.
        </p>

      </div>

    </div>
  );
}