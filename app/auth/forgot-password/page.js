"use client";

import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import SubmitButton from "@/components/General/SubmitButton";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const request = await fetch(`/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const response = await request.json();
      if (response.success) {
        toast.success("Please check your for OTP.");
        router.push("/auth/reset-password");
      } else {
        toast.error(
          response.message || "Sorry! we couldn't send OTP.Please try again."
        );
      }
    } catch (error) {
      toast.error("Sorry! we couldn't send OTP.Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Forgot Password
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <SubmitButton isLoading={isLoading} text="Send OTP" />
      </form>
    </div>
  );
};

export default ForgotPassword;
