import mongoose from "mongoose";
const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    gstNumber: { type: String, required: true },
  },
  { timestamps: true },
);
const supplierModel = mongoose.model("supplierModel", supplierSchema);
export default supplierModel;
