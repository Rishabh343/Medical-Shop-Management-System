import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },

    genericName: {
      type: String,
      default: "",
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "supplierModel",
      required: true,
    },

    batchNumber: {
      type: String,
      required: true,
      trim: true,
    },
    reorderLevel: {
      type: String,

      trim: true,
    },
    manufacturingDate: {
      type: Date,
      // required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    category: {
      type: String,
      enum: [
        "Tablet",
        "Capsule",
        "Bottle",
        "Strip",
        "Injection",
        "Tube",
        "Packet",
        "Powder",
        "Syrup",
        "Gel",
        "Spray",
        "Solution",
      ],
      required: true,
    },

    gstPercentage: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    medicineImage: {
      type: String,
      default: "",
    },
    stockIn: {
      type: Number,
      default: 0,
    },
    stockOut: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const medicineModel = mongoose.model("medicineModel", medicineSchema);

export default medicineModel;
