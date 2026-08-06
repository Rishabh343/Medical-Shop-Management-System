import billingModel from "../models/billingModel.js";
import customerModel from "../models/customerModel.js";
export const createCustomer = async (req, res) => {
  try {
    const { customerName, phoneNumber, email, address } = req.body;
    if (!customerName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Name and Phone Number are required.",
      });
    }
    const customerExists = await customerModel.findOne({ phoneNumber });
    if (customerExists) {
      return res.status(409).json({
        success: false,
        message: "Customer already exists.",
      });
    }
    const customer = await customerModel.create({
      customerName,
      phoneNumber,
      email,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully.",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getCustomerPurchaseHistory = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    const bills = await billingModel
      .find({ customer: req.params.id })
      .populate("customer")
      .populate(
        "customer",
        "customerName phoneNumber rewardPoints lifetimePurchase totalOrders",
      )
      .populate("items.medicine")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bills.length,
      customer,
      bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await customerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully.",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchCustomer = async (req, res) => {
  try {
    const { keyword } = req.query;

    const customers = await customerModel.find({
      $or: [{ customerName: { $regex: keyword, $options: "i" } }],
    });

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
