import medicineModel from "../models/medicineModel.js";
import supplierModel from "../models/supplierModel.js";
import customerModel from "../models/customerModel.js";
import billingModel from "../models/billingModel.js";

export const getDashboard = async (req, res) => {
  try {
    // ==========================
    // Dashboard Cards
    // ==========================

    const totalMedicines = await medicineModel.countDocuments();

    const totalSuppliers = await supplierModel.countDocuments();

    const totalCustomers = await customerModel.countDocuments();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaySales = await billingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
            $lte: endOfToday,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const monthlyRevenue = await billingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: firstDayOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const lowStockMedicines = await medicineModel.countDocuments({
      $expr: {
        $lte: ["$stockQuantity", "$reorderLevel"],
      },
    });

    const expiredMedicines = await medicineModel.countDocuments({
      expiryDate: {
        $lt: new Date(),
      },
    });

    // ==========================
    // Monthly Sales Chart
    // ==========================

    const monthlySales = await billingModel.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          totalSales: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // ==========================
    // Category Wise Sales
    // ==========================

    const categoryWiseSales = await billingModel.aggregate([
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "medicines",
          localField: "items.medicine",
          foreignField: "_id",
          as: "medicine",
        },
      },
      {
        $unwind: "$medicine",
      },
      {
        $group: {
          _id: "$medicine.category",
          totalSales: {
            $sum: "$items.totalPrice",
          },
        },
      },
      {
        $sort: {
          totalSales: -1,
        },
      },
    ]);

    // ==========================
    // Top Selling Medicines
    // ==========================

    const topSellingMedicines = await billingModel.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.medicine",
          totalQuantity: {
            $sum: "$items.quantity",
          },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $limit: 5,
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
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMedicines,
        totalSuppliers,
        totalCustomers,

        todaySales:
          todaySales.length > 0
            ? todaySales[0].total
            : 0,

        monthlyRevenue:
          monthlyRevenue.length > 0
            ? monthlyRevenue[0].total
            : 0,

        lowStockMedicines,

        expiredMedicines,

        monthlySales,

        categoryWiseSales,

        topSellingMedicines,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};