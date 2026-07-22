import supplierModel from "../models/supplierModel";

export const createPurchase = async (req, res) => {
  try {
    const { supplier, invoiceNumber, purchaseDate, items } = req.body;
    if (!supplier || !invoiceNumber || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    const supplierExists = await supplierModel.findById(supplier);
    if (!supplierExists) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.purchasePrice * item.quantity;

      // Increase Medicine Stock
      await Medicine.findByIdAndUpdate(item.medicine, {
        $inc: {
          stockQuantity: item.quantity,
        },
      });
    }
    const purchase = await Purchase.create({
      supplier,
      invoiceNuumber,
      purchaseDate,
      itmes,
      totalAmount,
    });
    res.status(201).json({
      success: true,
      message: "Purchase Created Successfully",
      purchase,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Purchase failed",
      error: error.message,
    });
  }
};
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier", "supplierName")
      .populate("items.medicine", "medicineName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier")
      .populate("items.medicine");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    res.status(200).json({
      success: true,
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};