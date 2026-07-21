import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
export const Register = async (req, res) => {
  try {
    const { name, email, role, age, phone, password } = req.body;
    if (age < 18) {
      res.status(400).json({
        status: false,
        message: "Age should be 18+",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        status: false,
        message: "User already Registered",
      });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be 8 chars,1 capital, 1 number, 1 special char",
      });
    }
    const userdata = {
      name,
      email,
      role,
      age,
      phone,
      password: hashedPassword,
    };

    const response = await userModel.create(userdata);

    res.status(201).json({
      status: true,
      message: "User Registered Successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "User not registered",
      error: error.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({
        status: false,
        message: " Invalid Password",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      "secretkey",
      { expiresIn: "1d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      status: 200,
      message: "Login Successfull",
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};