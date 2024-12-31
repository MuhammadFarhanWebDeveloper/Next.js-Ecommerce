"use client";

import { login } from "@/lib/server-actions/auth";
import ActionButton from "@/components/General/ActionButton";
import { addUser } from "@/lib/redux/slices/user";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useDispatch } from "react-redux";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSubmit = async (formData) => {
    try {
      const response = await login(formData);

      if (response.success) {
        toast.success("Welcome back! You've successfully logged in");
        dispatch(addUser(response.user));
        router.push("/");
      } else {
        toast.error(
          response.message || "Login failed. Please check your credentials."
        );
        console.log(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Sorry, something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Login
      </h2>
      <form action={handleSubmit}>
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
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <ActionButton text="Login" />

        <div className="mt-4 text-center">
          <Link
            href={"/auth/forgot-password"}
            className="text-indigo-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
