import Supplier from "../models/supplier.model.js";
export const createSupplier = async (req, res) => {
  try {
    const { supplierName, contactNumber, email, address, gstNumber } = req.body;

    if (!supplierName || !contactNumber || !address || !gstNumber) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    const supplierExists = await Supplier.findOne({
      supplierName: supplierName.trim(),
    });

    if (supplierExists) {
      return res.status(409).json({
        success: false,
        message: "Supplier already exists.",
      });
    }

    const supplier = await Supplier.create({
      supplierName,
      contactNumber,
      email,
      address,
      gstNumber,
    });

    res.status(201).json({
      success: true,
      message: "Supplier created successfully.",
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: suppliers.length,
      suppliers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found.",
      });
    }

    res.status(200).json({
      success: true,
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully.",
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found.",
      });
    }

    await supplier.deleteOne();

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

