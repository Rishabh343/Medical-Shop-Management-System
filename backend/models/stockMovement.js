import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "medicineModel",
      required: true,
    },
    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    remarks: {
      type: String,
      default: "",
    },
     billNumber: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("StockMovement", stockMovementSchema);
