import React, { useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
export default function UpdateProfile() {
  const { updateProfile, getProfile, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Get existing profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();

        if (data) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await updateProfile(formData);

      if (data) {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });

        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-[#faf9f6] text-stone-600 shadow-sm transition hover:border-stone-300 hover:bg-white hover:text-stone-900"
          title="Go Back"
        >
          <ArrowLeft size={15} />
        </button>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
            Account Settings
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            Update Profile
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Manage your personal information and account details.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
        {/* Card Header */}
        <div className="border-b border-stone-200 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-lg font-semibold text-white">
              {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div>
              <h2 className="text-base font-semibold text-stone-900">
                Personal Information
              </h2>

              <p className="mt-0.5 text-xs text-stone-500">
                Keep your profile details up to date.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-medium text-stone-600">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-medium text-stone-600">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-xs font-medium text-stone-600">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-stone-200" />

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
