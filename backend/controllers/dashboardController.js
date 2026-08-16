import medicineModel from "../models/medicineModel.js";
import supplierModel from "../models/supplierModel.js";
import customerModel from "../models/customerModel.js";
import billingModel from "../models/billingModel.js";

export const getDashboard = async (req, res) => {
  try {
    const totalMedicines = await medicineModel.countDocuments();
    const totalSuppliers = await supplierModel.countDocuments();
    const totalCustomers = await customerModel.countDocuments();

    // totalSales = Total number of bills generated
    const totalSales = await billingModel.countDocuments();

    // If you have a separate Purchase model, use it here.
    // For now, we will count total suppliers or set a fallback.
    const totalPurchases = await supplierModel.countDocuments(); // Update this if you have a purchaseModel

    // Calculate total stock across all medicines
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

    // Monthly Revenue (Sum of finalAmount)
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

    // Low Stock (Stock <= Reorder Level)
    const lowStockMedicines = await medicineModel
      .find({ $expr: { $lte: ["$stockQuantity", "$reorderLevel"] } })
      .select("medicineName stockQuantity reorderLevel company category")
      .limit(10);

    // Expired Medicines
    const expiredMedicines = await medicineModel
      .find({ expiryDate: { $lt: new Date() } })
      .select("medicineName expiryDate stockQuantity company batchNumber")
      .limit(10);

    // Near Expiry (Next 30 Days)
    const next30Days = new Date();
    next30Days.setDate(next30Days.getDate() + 30);
    const expiringMedicines = await medicineModel
      .find({ expiryDate: { $gte: new Date(), $lte: next30Days } })
      .select("medicineName expiryDate stockQuantity company category")
      .limit(10);

    // Monthly Sales Chart
    const monthlySales = await billingModel.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalSales: { $sum: "$finalAmount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // Category Wise Sales (Using correct "medicinemodels" collection name)
    const categorySales = await billingModel.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "medicinemodels", // Correct Mongoose collection name
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

    // Top Selling Medicines (Using correct "medicinemodels" collection name)
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
          from: "medicinemodels", // Correct Mongoose collection name
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

    // Recent 5 Sales (Invoices)
    const recentSales = await billingModel
      .find()
      .sort({ createdAt: -1 })
      .select("billNumber finalAmount paymentMethod createdAt ")
      .populate("customer", "customerName")
      .limit(5);

    // Recent 5 Medicines added (Acting as recent purchases)
    const recentPurchases = await medicineModel
      .find()
      .sort({ createdAt: -1 })
      .select("medicineName purchasePrice stockQuantity company createdAt")
      .populate("supplier", "supplierName")
      .limit(5);

    res.status(200).json({
      success: true,

      // Top Stat Cards
      totalMedicines,
      totalSuppliers,
      totalCustomers,
      totalPurchases,
      totalSales,
      totalStock,
      todaySales,
      monthlyRevenue,

      // Alerts
      lowStockMedicines,
      expiredMedicines,
      expiringMedicines,

      // Charts
      monthlySales,
      categorySales,

      // Tables / Lists
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
