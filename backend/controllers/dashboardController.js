import medicineModel from "../models/medicineModel.js";
import supplierModel from "../models/supplierModel.js";
import customerModel from "../models/customerModel.js";
import billingModel from "../models/billingModel.js";

export const getDashboard = async (req, res) => {
  try {
    const totalMedicines = await medicineModel.countDocuments();
    const totalSuppliers = await supplierModel.countDocuments();
    const totalCustomers = await customerModel.countDocuments();
    const totalSales = await billingModel.countDocuments();
    const totalPurchases = await supplierModel.countDocuments(); // Update this if you have a purchaseModel
    const stockAgg = await medicineModel.aggregate([
      { $group: { _id: null, totalStock: { $sum: "$stockQuantity" } } },
    ]);
    const totalStock = stockAgg.length > 0 ? stockAgg[0].totalStock : 0;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Today's Revenue (Sum of finalAmount)
    const todaySalesData = await billingModel.aggregate([
      { $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } } },
      { $group: { _id: null, total: { $sum: "$finalAmount" } } },
    ]);
    const todaySales = todaySalesData.length > 0 ? todaySalesData[0].total : 0;
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const monthlyRevenueData = await billingModel.aggregate([
      { $match: { createdAt: { $gte: firstDayOfMonth } } },
      { $group: { _id: null, total: { $sum: "$finalAmount" } } },
    ]);
    const monthlyRevenue =
      monthlyRevenueData.length > 0 ? monthlyRevenueData[0].total : 0;

    const lowStockMedicines = await medicineModel
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
      .select("medicineName stockQuantity reorderLevel company category")
      .sort({ stockQuantity: 1 })
      .limit(10);

    const expiredMedicines = await medicineModel
      .find({ expiryDate: { $lt: new Date() } })
      .select("medicineName expiryDate stockQuantity company batchNumber")
      .limit(10);

  
    const next30Days = new Date();
    next30Days.setDate(next30Days.getDate() + 30);
    const expiringMedicines = await medicineModel
      .find({ expiryDate: { $gte: new Date(), $lte: next30Days } })
      .select("medicineName expiryDate stockQuantity company category")
      .limit(10);

    const monthlySales = await billingModel.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalSales: { $sum: "$finalAmount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const categorySales = await billingModel.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "medicinemodels", 
          localField: "items.medicine",
          foreignField: "_id",
          as: "medicine",
        },
      },
      { $unwind: "$medicine" },
      {
        $group: {
          _id: "$medicine.category",
          totalSales: { $sum: "$items.totalPrice" },
        },
      },
      { $sort: { totalSales: -1 } },
    ]);

    const topSellingMedicines = await billingModel.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.medicine",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "medicinemodels", 
          localField: "_id",
          foreignField: "_id",
          as: "medicine",
        },
      },
      { $unwind: "$medicine" },
      {
        $project: {
          _id: 0,
          medicineName: "$medicine.medicineName",
          quantitySold: "$totalQuantity",
        },
      },
    ]);

    const recentSales = await billingModel
      .find()
      .sort({ createdAt: -1 })
      .select("billNumber finalAmount paymentMethod createdAt ")
      .populate("customer", "customerName")
      .limit(5);

    const recentPurchases = await medicineModel
      .find()
      .sort({ createdAt: -1 })
      .select("medicineName purchasePrice stockQuantity company createdAt")
      .populate("supplier", "supplierName")
      .limit(5);

    res.status(200).json({
      success: true,
      totalMedicines,
      totalSuppliers,
      totalCustomers,
      totalPurchases,
      totalSales,
      totalStock,
      todaySales,
      monthlyRevenue,
      lowStockMedicines,
      expiredMedicines,
      expiringMedicines,
      monthlySales,
      categorySales,
      recentPurchases,
      recentSales,
      topSellingMedicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
