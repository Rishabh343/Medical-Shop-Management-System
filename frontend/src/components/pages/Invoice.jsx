import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BillingContext } from "../context/BillingContext";
import html2pdf from "html2pdf.js";

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  const { getBillById } = useContext(BillingContext);
  const [bill, setBill] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchBill = async () => {
      if (id) {
        const data = await getBillById(id);
        setBill(data);
      }
    };
    fetchBill();
  }, [id, getBillById]);

  const downloadPDF = async () => {
    if (!invoiceRef.current || isDownloading) return;

    setIsDownloading(true);

    // Tiny delay to allow React to update UI to "Generating PDF..."
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const element = invoiceRef.current;
      const opt = {
        margin: [8, 8, 8, 8],
        filename: `Invoice_${bill?.billNumber || "Medicare"}.pdf`,
        
        // FIX 1: Use PNG instead of JPEG. PNG is lossless and keeps text sharp.
        image: { type: "png" }, 
        
        html2canvas: {
          // FIX 2: Increase scale to 4. This renders the HTML at 4x resolution before shrinking to A4
          scale: 4, 
          useCORS: true,
          logging: false,
          scrollY: 0, // Prevents shifting if the user has scrolled down
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!bill) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 text-slate-600">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2563eb] mb-4"></div>
        <p className="text-lg font-medium">Loading Invoice...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      
      
      <style>{`
        :where(#pdf-content, #pdf-content *) {
          border-color: rgba(226, 232, 240, 1);
          outline-color: rgba(226, 232, 240, 1);
          text-decoration-color: rgba(226, 232, 240, 1);
        }
      `}</style>

      {/* Main Invoice Card (Uses hardcoded HEX values to prevent oklch crash) */}
      <div
        id="pdf-content"
        ref={invoiceRef}
        className="max-w-4xl mx-auto bg-[#ffffff] shadow-xl rounded-xl p-8 sm:p-10 border border-[#e2e8f0] text-[#1e293b]"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#e2e8f0] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-[#2563eb] text-[#ffffff] font-bold p-2 rounded-lg text-xl flex items-center justify-center w-10 h-10">
                +
              </div>
              <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
                MediCare <span className="text-[#2563eb]">Pharmacy</span>
              </h1>
            </div>
            <p className="text-[#64748b] font-medium text-sm mt-1">
              Pharmacy Management System
            </p>
            <div className="text-xs text-[#64748b] mt-3 space-y-0.5">
              <p>Bank More, Dhanbad, Jharkhand - 826001</p>
              <p>Phone: +91 9876543210 | Email: support@medicare.com</p>
              <p className="font-semibold text-[#475569]">
                GSTIN: 20ABCDE1234F1Z5
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-[#eff6ff] text-[#1d4ed8] text-xs font-bold uppercase tracking-wider rounded-full mb-3 border border-[#dbeafe]">
              Tax Invoice
            </span>
            <h2 className="text-2xl font-bold text-[#0f172a]">
              #{bill?.billNumber}
            </h2>
            <div className="text-sm text-[#475569] mt-2 space-y-1">
              <p>
                <span className="text-[#94a3b8]">Date:</span>{" "}
                <span className="font-medium">
                  {bill?.createdAt
                    ? new Date(bill.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </p>
              <p>
                <span className="text-[#94a3b8]">Payment Method:</span>{" "}
                <span className="font-medium capitalize">
                  {bill?.paymentMethod || "N/A"}
                </span>
              </p>
              <p className="flex items-center justify-end gap-1.5 mt-1">
                <span className="text-[#94a3b8]">Status:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#d1fae5] text-[#065f46] capitalize">
                  {bill?.paymentStatus || "Paid"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Reward Details Grid */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#f1f5f9]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
              Customer Information
            </h3>
            <p className="text-base font-bold text-[#1e293b]">
              {bill?.customer?.customerName || "Walk-in Customer"}
            </p>
            <div className="text-xs text-[#475569] mt-1 space-y-0.5">
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {bill?.customer?.phoneNumber || "-"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {bill?.customer?.email || "-"}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {bill?.customer?.address || "-"}
              </p>
            </div>
          </div>

          <div className="bg-[#fffbeb] p-4 rounded-lg border border-[#fef3c7]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#b45309] mb-2">
              Rewards Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-[#64748b]">Current Points</p>
                <p className="text-sm font-bold text-[#b45309] flex items-center gap-1">
                  ⭐ {bill?.customer?.rewardPoints ?? 0}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Total Orders</p>
                <p className="text-sm font-bold text-[#1e293b]">
                  {bill?.customer?.totalOrders ?? 0}
                </p>
              </div>
              <div className="col-span-2 mt-1 pt-1 border-t border-[#fef3c7]">
                <p className="text-[#64748b]">Lifetime Purchase</p>
                <p className="text-sm font-bold text-[#1e293b]">
                  ₹{bill?.customer?.lifetimePurchase?.toLocaleString() ?? "0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Medicines Table */}
        <div className="mt-6 overflow-hidden rounded-lg border border-[#e2e8f0]">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#1e293b] text-[#ffffff] text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Medicine Description</th>
                <th className="py-3 px-4 text-right w-28">Price</th>
                <th className="py-3 px-4 text-center w-20">Qty</th>
                <th className="py-3 px-4 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-[#334155]">
              {bill?.items?.map((item, index) => (
                <tr
                  key={item._id || index}
                  className={index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#f8fafc]"}
                >
                  <td className="py-3 px-4 text-center text-[#94a3b8] font-mono text-xs">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#1e293b]">
                    {item.medicine?.medicineName || "Item"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    ₹{item.sellingPrice?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center font-medium">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#0f172a]">
                    ₹{item.totalPrice?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations / Summary Side */}
        <div className="flex justify-end mt-6">
          <div className="w-80 bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0] text-xs space-y-2.5">
            <div className="flex justify-between text-[#475569]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1e293b]">
                ₹{bill?.totalAmount?.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-[#059669]">
              <span>Reward Discount</span>
              <span className="font-semibold">
                - ₹{bill?.discount?.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-[#475569]">
              <span>Points Redeemed</span>
              <span className="font-medium text-[#334155]">
                ⭐ {bill?.rewardPointsRedeemed ?? 0}
              </span>
            </div>

            <div className="flex justify-between text-[#047857] font-medium">
              <span>Points Earned</span>
              <span>+ ⭐ {bill?.rewardPointsEarned ?? 0}</span>
            </div>

            <div className="border-t border-[#cbd5e1] pt-3 mt-2 flex justify-between items-baseline text-base font-bold text-[#0f172a]">
              <span>Amount Paid</span>
              <span className="text-xl text-[#1d4ed8]">
                ₹{bill?.finalAmount?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer / Terms */}
        <div className="mt-10 border-t border-[#e2e8f0] pt-6 flex justify-between items-end">
          <div className="max-w-md">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748b] mb-1.5">
              Terms & Conditions
            </h4>
            <ul className="text-[11px] text-[#64748b] space-y-0.5 list-disc pl-4 leading-relaxed">
              <li>Medicines once sold cannot be returned or exchanged.</li>
              <li>Please keep this invoice for future queries.</li>
              <li>Prescription drugs are sold only on registered doctor Rx.</li>
            </ul>

            <div className="mt-4">
              <p className="text-sm font-bold text-[#1d4ed8]">
                Thank You for Visiting!
              </p>
              <p className="text-xs text-[#94a3b8]">
                We appreciate your trust in MediCare Pharmacy.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-44 border-b border-[#94a3b8] mb-2"></div>
            <p className="text-xs font-semibold text-[#475569]">
              Authorized Signature
            </p>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="max-w-4xl mx-auto flex flex-wrap justify-end gap-3 mt-6">
        <button
          onClick={() => navigate(-1)}
          disabled={isDownloading}
          className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 shadow-sm transition disabled:opacity-50"
        >
          Back
        </button>

        <button
          onClick={() => navigate("/admin/billing")}
          disabled={isDownloading}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition disabled:opacity-50"
        >
          New Bill
        </button>

        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}