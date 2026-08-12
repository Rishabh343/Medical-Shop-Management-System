import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LockKeyhole, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/user/reset-password/${token}`,
        {
          password,
        }
      );

      toast.success(
        response.data.message ||
          "Password reset successfully"
      );

      navigate("/login");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eeeae3] p-4">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-3xl bg-[#faf9f6] p-8 shadow-sm">
          <div className="mb-7">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
              Account Recovery
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
              Reset your password
            </h1>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Create a new password for your MediStock account.
            </p>
          </div>

          <form
            onSubmit={handleResetPassword}
            className="space-y-5"
          >
            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                New Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-stone-900 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Updating Password..."
                : "Update Password"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
          >
            <ArrowLeft size={15} />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}