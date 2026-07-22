import mongoose from "mongoose";

const purchaseItemSchema = new mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: "medicineModel" },
    quantity: { type: Number, required: true, min: 1 },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: { type: Number, required: true, min: 0 },
    batchNumber: {
      type: String,
      required: true,
      trim: true,
    },

    manufacturingDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },
    gst: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);
const purchaseSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Supplier,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    items: [purchaseItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);
export default mongoose.model("Purchase", purchaseSchema);
