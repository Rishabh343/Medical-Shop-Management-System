import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  purchase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase",
    required: true,
  },

  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },

  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },

  batchNumber: String,

  availableQuantity: Number,

  status: {
    type: String,
    enum: ["Available", "Low Stock", "Out of Stock", "Expired"],
    default: "Available",
  },
});
const inventoryModel = mongoose.model("inventoryModel", inventorySchema);
export default inventoryModel;
