import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Pharmacist"], required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);
const userModel = mongoose.model("userModel", userSchema);
export default userModel;
