"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const ResetPassword = ({ params }: { params: { username: string } }) => {
  const router = useRouter();
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/reset-password/${params.username}`, {
        resetToken,
        password,
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Password reset successfully",
        });
        router.push("/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to reset password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while resetting the password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="resetToken">
              Reset Token
            </label>
            <input
              id="resetToken"
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter the reset token"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"} // Toggle input type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your new password"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-600" />
                )}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} // Toggle input type
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Confirm your new password"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-600" />
                )}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-200 ease-in-out hover:opacity-90 ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
