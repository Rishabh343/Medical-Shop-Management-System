import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export default function Login() {
  const navigate = useNavigate();

  const { loginUser, loading } = useContext(UserContext);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(loginData);

      alert(response.message);

      localStorage.setItem("isLoggedIn", "true");
      console.log(response.role);
      if (response.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (response.role === "Pharmacist") {
        navigate("/pharmacist/medicine");
      } else {
        navigate("/");
      }

      setLoginData({
        email: "",
        password: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Pharmacy Management
          </h1>

          <p className="text-gray-500 mt-2">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          {/* <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Forgot Password?
            </button>
          </div> */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          {/* Signup */}
          <div className="text-center border-t pt-5">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
