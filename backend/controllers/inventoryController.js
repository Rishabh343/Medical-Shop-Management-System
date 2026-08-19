import mongoose from "mongoose";
import billingModel from "../models/billingModel.js";
import medicineModel from "../models/medicineModel.js";

import stockMovement from "../models/stockMovement.js";

export const getAllInventory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalMedicines = await medicineModel.countDocuments();
    const inventory = await medicineModel
      .find()
      .populate("supplier", "supplierName")
      .select(
        "-purchasePrice -sellingPrice -gstPercentage -medicineImage -description -stockIn -stockOut",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: true,
      message: "Inventory fetched successfully",
      inventory,
      currentPage: page,
      totalPages: Math.ceil(totalMedicines / limit),
      totalMedicines,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getStockMovement = async (req, res) => {
  try {
    const stockHistory = await stockMovement
      .find()
      .populate("medicine", "medicineName company")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stockHistory.length,
      data: stockHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchInventory = async (req, res) => {
  try {
    const { keyword } = req.query;

    const medicines = await medicineModel
      .find({
        medicineName: {
          $regex: keyword,
          $options: "i",
        },
      })
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getInventoryByMedicine = async (req, res) => {
  try {
    const medicine = await medicineModel
      .findById(req.params.id)
      .populate("supplier", "supplierName");

    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      status: true,
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const increaseStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const addedQuantity = Number(quantity);

    if (!quantity || Number.isNaN(addedQuantity) || addedQuantity <= 0) {
      return res.status(400).json({
        status: false,
        message: "Enter a valid quantity",
      });
    }

    const medicine = await medicineModel.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found",
      });
    }

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const updatedMedicine = await medicineModel
          .findByIdAndUpdate(
            req.params.id,
            {
              $inc: {
                stockQuantity: addedQuantity,
                stockIn: addedQuantity,
              },
            },
            { new: true, session },
          )
          .populate("supplier", "supplierName");

        await stockMovement.create(
          [
            {
              medicine: medicine._id,
              type: "IN",
              quantity: addedQuantity,
              remarks: "Stock Added",
            },
          ],
          { session },
        );

        medicine.stockQuantity = updatedMedicine.stockQuantity;
        medicine.stockIn = updatedMedicine.stockIn;
      });
    } finally {
      session.endSession();
    }

    res.status(200).json({
      status: true,
      message: "Stock increased successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const adjustStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const stockOutQuantity = Number(quantity);

    if (!quantity || Number.isNaN(stockOutQuantity) || stockOutQuantity <= 0) {
      return res.status(400).json({
        status: false,
        message: "Enter a valid quantity",
      });
    }

    const medicine = await medicineModel.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found",
      });
    }

    if (medicine.stockQuantity < stockOutQuantity) {
      return res.status(400).json({
        status: false,
        message: "Insufficient stock",
      });
    }

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const updatedMedicine = await medicineModel
          .findByIdAndUpdate(
            req.params.id,
            {
              $inc: {
                stockQuantity: -stockOutQuantity,
                stockOut: stockOutQuantity,
              },
            },
            { new: true, session },
          )
          .populate("supplier", "supplierName");

        await stockMovement.create(
          [
            {
              medicine: medicine._id,
              type: "OUT",
              quantity: stockOutQuantity,
              remarks: "Stock Adjustment",
            },
          ],
          { session },
        );

        medicine.stockQuantity = updatedMedicine.stockQuantity;
        medicine.stockOut = updatedMedicine.stockOut;
      });
    } finally {
      session.endSession();
    }

    res.status(200).json({
      status: true,
      message: "Stock adjusted successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getLowStock = async (req, res) => {
  try {
    const medicines = await medicineModel
      .find({
        $expr: {
          $and: [
            {
              $lte: [
                "$stockQuantity",
                {
                  $convert: {
                    input: "$reorderLevel",
                    to: "int",
                    onError: 0,
                    onNull: 0,
                  },
                },
              ],
            },
            {
              $gt: [
                {
                  $convert: {
                    input: "$reorderLevel",
                    to: "int",
                    onError: 0,
                    onNull: 0,
                  },
                },
                0,
              ],
            },
          ],
        },
      })
      .select("-medicineImage")
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      message: "Low stock medicines",
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getOutOfStock = async (req, res) => {
  try {
    const medicines = await medicineModel
      .find({
        stockQuantity: 0,
      })
      .select("-medicineImage")
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      message: "Out of stock medicines",
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getExpiredInventory = async (req, res) => {
  try {
    const medicines = await medicineModel
      .find({
        expiryDate: { $lt: new Date() },
      })
      .select("-medicineImage")
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      message: "Expired medicines",
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getNearExpiryInventory = async (req, res) => {
  try {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const medicines = await medicineModel
      .find({
        expiryDate: {
          $gte: today,
          $lte: next30Days,
        },
      })
      .select("-medicineImage")
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      message: "Near expiry medicines",
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getStockHistory = async (req, res) => {
  try {
    const medicine = await medicineModel.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found",
      });
    }

    const history = await stockMovement
      .find({ medicine: req.params.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: {
        currentStock: medicine.stockQuantity,
        totalStockIn: medicine.stockIn,
        totalStockOut: medicine.stockOut,
        history,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
