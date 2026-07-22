import medicineModel from "../models/medicineModel.js";

export const addMedicine = async (req, res) => {
  try {
    const response = await medicineModel.create({ ...req.body });
    return res.status(201).json({
      status: true,
      message: "Medicine added successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Medicine not added, check console",
      error: error.message,
    });
  }
};
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await medicineModel.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found, check console",
      });
    }
    await medicineModel.deleteOne(req.params.id);
    return res.status(200).json({
      status: true,
      message: "Medicine deleted successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Medicine not deleted, check console",
      error: error.message,
    });
  }
};
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await medicineModel.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found, check console",
      });
    }
    await medicineModel.updateOne({ ...req.body });
    return res.status(200).json({
      status: true,
      message: "Medicine updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Medicine not updated, check console",
      error: error.message,
    });
  }
};
export const searchMedicine = async (req, res) => {
  try {
    const { keyword } = req.body;
    const response = await medicineModel.find({
      $or: [
        { medicineName: { $regex: keyword, options: "i" } },
        { genericName: { $regex: keyword, options: "i" } },
      ],
    });
    res.status(200).json({
      success: true,
      count: response.length,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Medicine not searched, check console",
      error: error.message,
    });
  }
};
export const filterMedicine = async (req, res) => {
  try {
    const { category, company, expiryDate } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (company) {
      filter.company = company;
    }
    if (expiryDate) {
      filter.expiryDate = expiryDate;
    }
    const response = await medicineModel.find(filter);
    res.status(200).json({
      success: true,
      count: response.length,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Medicine not searched, check console",
      error: error.message,
    });
  }
};
export const getAllMedicine = async (req, res) => {
  try {
    const medicine = await medicineModel.find();

    return res.status(200).json({
      status: true,
      message: "Medicine fetched successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "All Medicines are not fetched, check console",
      error: error.message,
    });
  }
};
export const getOneMedicine = async (req, res) => {
  try {
    const medicine = await medicineModel.findById(req.params.id);

    return res.status(200).json({
      status: true,
      message: "Medicine fetched successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "one Medicine are not fetched, check console",
      error: error.message,
    });
  }
};
