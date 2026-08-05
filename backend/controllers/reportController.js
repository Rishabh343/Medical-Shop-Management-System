import billingModel from "../models/billingModel.js";
import medicineModel from "../models/medicineModel.js";

export const getTodaySalesReport = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const bills = await billingModel
      .find({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
      .populate("customer", "customerName phoneNumber")
      .sort({ createdAt: -1 });

    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    res.status(200).json({
      success: true,
      totalBills: bills.length,
      totalSales,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getWeeklySalesReport = async (req, res) => {
  try {
    const today = new Date();

    const lastWeek = new Date();

    lastWeek.setDate(today.getDate() - 7);

    const bills = await billingModel
      .find({
        createdAt: {
          $gte: lastWeek,
          $lte: today,
        },
      })
      .populate("customer", "customerName phoneNumber")
      .sort({ createdAt: -1 });

    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    res.status(200).json({
      success: true,
      totalBills: bills.length,
      totalSales,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMonthlySalesReport = async (req, res) => {
  try {
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const end = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const bills = await billingModel
      .find({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
      .populate("customer", "customerName phoneNumber")
      .sort({ createdAt: -1 });

    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    res.status(200).json({
      success: true,
      totalBills: bills.length,
      totalSales,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getProfitReport = async (req, res) => {
  try {
    const bills = await billingModel
      .find()
      .populate("items.medicine")
      .sort({ createdAt: -1 });

    let totalSales = 0;
    let totalPurchase = 0;

    const report = [];

    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        const medicine = item.medicine;

        if (!medicine) return;

        const purchase = medicine.purchasePrice * item.quantity;

        const selling = item.sellingPrice * item.quantity;

        const profit = selling - purchase;

        totalSales += selling;
        totalPurchase += purchase;

        report.push({
          billNumber: bill.billNumber,

          medicine: medicine.medicineName,

          quantity: item.quantity,

          purchasePrice: medicine.purchasePrice,

          sellingPrice: item.sellingPrice,

          purchaseAmount: purchase,

          sellingAmount: selling,

          profit,
        });
      });
    });

    res.status(200).json({
      success: true,

      totalSales,

      totalPurchase,

      totalProfit: totalSales - totalPurchase,

      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getPurchaseReport = async (req, res) => {
  try {
    const medicines = await medicineModel
      .find()
      .populate("supplier")
      .sort({ createdAt: -1 });

    const totalPurchase = medicines.reduce(
      (sum, medicine) => sum + medicine.purchasePrice * medicine.stockQuantity,
      0,
    );

    res.status(200).json({
      success: true,

      totalPurchase,

      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getBestSellingMedicines = async (req, res) => {
  try {
    const medicines = await billingModel.aggregate([
      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.medicine",

          totalSold: {
            $sum: "$items.quantity",
          },
        },
      },

      {
        $sort: {
          totalSold: -1,
        },
      },

      {
        $limit: 10,
      },

      {
        $lookup: {
          from: "medicines",

          localField: "_id",

          foreignField: "_id",

          as: "medicine",
        },
      },

      {
        $unwind: "$medicine",
      },

      {
        $project: {
          _id: 0,

          medicineName: "$medicine.medicineName",

          category: "$medicine.category",

          totalSold: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,

      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getLowStockReport = async (req, res) => {
  try {
    const medicines = await medicineModel
      .find({
        $expr: {
          $lte: ["$stockQuantity", "$reorderLevel"],
        },
      })
      .populate("supplier", "supplierName")
      .sort({ stockQuantity: 1 });

    res.status(200).json({
      success: true,
      totalMedicines: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getExpiryReport = async (req, res) => {
  try {
    const today = new Date();

    const medicines = await medicineModel
      .find({
        expiryDate: {
          $lte: today,
        },
      })
      .populate("supplier", "supplierName")
      .sort({ expiryDate: 1 });

    res.status(200).json({
      success: true,
      totalMedicines: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getNearExpiryReport = async (req, res) => {
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
      .populate("supplier", "supplierName")
      .sort({ expiryDate: 1 });

    res.status(200).json({
      success: true,
      totalMedicines: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
