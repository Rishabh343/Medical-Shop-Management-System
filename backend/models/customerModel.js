import mongoose from "mongoose";
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true },
);
const customerModel = mongoose.model("customerModel", customerSchema);
export default customerModel;
