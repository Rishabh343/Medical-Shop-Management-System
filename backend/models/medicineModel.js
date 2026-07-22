import mongoose, { mongo } from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    medicineName: { type: String, required: true },
    genericName: { type: String, default: "" },
    company: { type: String, required: true },
    category: { type: String, required: true },
    batchNumber: { type: Number, required: true },
    manufacturingDate: { type: Date, default: "" },
    expiryDate: { type: Date, default: "" },
    puchasePrice: { type: Number, default: "" },
    sellingPrice: { type: String, default: "" },
    stockQuantity: { type: String, default: "" },
    unit: { type: String, default: "" },
    gstPercentage: { type: String, default: "" },
    description: { type: String, default: "" },
    medicineImage: { type: String, default: "" },
  },
  { timestamps: true },
);
const medicineModel = mongoose.model("medicineModel", medicineSchema);
export default medicineModel;
