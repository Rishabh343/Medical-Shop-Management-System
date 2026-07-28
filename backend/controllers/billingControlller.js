import billingModel from "../models/billingModel.js";
import medicineModel from "../models/medicineModel.js";

export const createBill = async (req, res) => {
  try {
    const {
      billNumber,
      customerName,
      customerPhone,
      paymentMethod,
      paymentStatus,
      items,
    } = req.body;

    let totalAmount = 0;

    for (const item of items) {
      const medicine = await medicineModel.findById(item.medicine);

      if (!medicine) {
        return res.status(404).json({
          status: false,
          message: "Medicine not found",
        });
      }

      if (medicine.stockQuantity < item.quantity) {
        return res.status(400).json({
          status: false,
          message: `${medicine.medicineName} has insufficient stock`,
        });
      }

      item.sellingPrice = medicine.sellingPrice;
      item.totalPrice = medicine.sellingPrice * item.quantity;

      totalAmount += item.totalPrice;

      medicine.stockQuantity -= item.quantity;

      await medicine.save();
    }

    const bill = await billingModel.create({
      billNumber,
      customerName,
      customerPhone,
      paymentMethod,
      paymentStatus,
      items,
      totalAmount,
    });

    res.status(201).json({
      status: true,
      message: "Bill created successfully",
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getAllBills = async (req, res) => {
  try {
    const bills = await billingModel
      .find()
      .populate("items.medicine", "medicineName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getBillById = async (req, res) => {
  try {
    const bill = await billingModel
      .findById(req.params.id)
      .populate("items.medicine", "medicineName");

    if (!bill) {
      return res.status(404).json({
        status: false,
        message: "Bill not found",
      });
    }

    res.status(200).json({
      status: true,
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const bill = await billingModel.findByIdAndDelete(req.params.id);

    if (!bill) {
      return res.status(404).json({
        status: false,
        message: "Bill not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Bill deleted successfully",
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};