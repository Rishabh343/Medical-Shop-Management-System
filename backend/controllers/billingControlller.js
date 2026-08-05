import billingModel from "../models/billingModel.js";
import customerModel from "../models/customerModel.js";
import medicineModel from "../models/medicineModel.js";

export const createBill = async (req, res) => {
  try {
    const {
      customerId,
      paymentMethod,
      medicines,
      rewardPointsToRedeem = 0,
    } = req.body;

    // Find Customer
    const customer = await customerModel.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        status: false,
        message: "Customer not found",
      });
    }

    let totalAmount = 0;
    const items = [];

    // Validate Medicines & Calculate Total
    for (const item of medicines) {
      const medicine = await medicineModel.findById(item.medicineId);

      if (!medicine) {
        return res.status(404).json({
          status: false,
          message: `${item.medicineId} not found`,
        });
      }

      if (medicine.stockQuantity < item.quantity) {
        return res.status(400).json({
          status: false,
          message: `${medicine.medicineName} has insufficient stock`,
        });
      }

      // Reduce Stock
      medicine.stockQuantity -= item.quantity;
      await medicine.save();

      const totalPrice = medicine.sellingPrice * item.quantity;

      totalAmount += totalPrice;

      items.push({
        medicine: medicine._id,
        quantity: item.quantity,
        sellingPrice: medicine.sellingPrice,
        totalPrice,
      });
    }
    // Validate Reward Points
    if (rewardPointsToRedeem > customer.rewardPoints) {
      return res.status(400).json({
        status: false,
        message: "Insufficient Reward Points",
      });
    }
    // Reward Discount
    let discount = rewardPointsToRedeem;

    if (discount > totalAmount) {
      discount = totalAmount;
    }
    // Final Payable Amount
    const finalAmount = totalAmount - discount;
    // Earn Reward Points
    const earnedPoints = Math.floor(finalAmount / 100);
    // Invoice Number
    const count = await billingModel.countDocuments();
    const billNumber = `INV-${String(count + 1).padStart(5, "0")}`;
    // Create Bill
    const bill = await billingModel.create({
      billNumber,
      customer: customerId,
      paymentMethod,
      paymentStatus: "Paid",
      items,
      totalAmount,
      discount,
      finalAmount,
      rewardPointsEarned: earnedPoints,
      rewardPointsRedeemed: rewardPointsToRedeem,
    });

    // Update Customer
    customer.rewardPoints =
      customer.rewardPoints - rewardPointsToRedeem + earnedPoints;
    customer.lifetimePurchase += finalAmount;
    customer.totalOrders += 1;
    customer.lastPurchase = new Date();
    await customer.save();

    res.status(201).json({
      status: true,
      message: "Bill created successfully",
      billNumber,
      totalAmount,
      discount,
      finalAmount,
      earnedPoints,
      rewardPoints: customer.rewardPoints,
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
      .populate("customer", "customerName phone")
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
      .populate("customer")
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
