import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    rewardPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const customerModel = mongoose.model("customerModel", customerSchema);
export default customerModel;
