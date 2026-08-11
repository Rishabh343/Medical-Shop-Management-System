import medicineModel from "../models/medicineModel.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
export const addMedicine = async (req, res) => {
  try {
    const existingMedicine = await medicineModel.findOne({
      medicineName: req.body.medicineName,
      batchNumber: req.body.batchNumber,
    });

    if (existingMedicine) {
      return res.status(400).json({
        status: false,
        message: "Medicine already exists",
      });
    }

    let medicineImage = "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "medistock/medicines",
      );

      medicineImage = uploadResult.secure_url;
    }

    const medicine = await medicineModel.create({
      ...req.body,
      medicineImage,
    });

    res.status(201).json({
      status: true,
      message: "Medicine added successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getAllMedicine = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalMedicines = await medicineModel.countDocuments();

    const medicines = await medicineModel
      .find()
      .populate("supplier", "supplierName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      medicines,
      currentPage: page,
      totalPages: Math.ceil(totalMedicines / limit),
      totalMedicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getOneMedicine = async (req, res) => {
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

export const updateMedicine = async (req, res) => {
  try {
    const { stockQuantity, ...updateData } = req.body;

    // If new image is uploaded
    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "medistock/medicines"
      );

      updateData.medicineImage = uploadResult.secure_url;
    }

    const medicine = await medicineModel
      .findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("supplier", "supplierName");

    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Medicine updated successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await medicineModel.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Medicine deleted successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const searchMedicine = async (req, res) => {
  try {
    const { keyword } = req.query;

    const medicines = await medicineModel
      .find({
        $or: [
          { medicineName: { $regex: keyword, $options: "i" } },
          { genericName: { $regex: keyword, $options: "i" } },
          { company: { $regex: keyword, $options: "i" } },
        ],
      })
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const filterMedicine = async (req, res) => {
  try {
    const { category, company, supplier } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (company) filter.company = company;
    if (supplier) filter.supplier = supplier;

    const medicines = await medicineModel
      .find(filter)
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
