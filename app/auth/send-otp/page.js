"use client";
import SubmitButton from "@/components/General/SubmitButton";
import { useRouter } from "nextjs-toploader/app";

import { useState } from "react";
import { toast } from "react-toastify";

const SendOtp = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const request = await fetch(
        `/api/auth/send-otp`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const response = await request.json();
      if (response.success) {
        toast.success("Please check your email for OTP");
        router.push("/auth/verify-email");
      } else {
        toast.error(
          response.message || "Sorry! something went wrong. Please try again."
        );
      }
    } catch (error) {
      toast.error("Sorry! something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Enter Your Email
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <SubmitButton isLoading={isLoading} text="Send" />
      </form>
    </div>
  );
};

export default SendOtp;
