"use client";

import ActionButton from "@/components/General/ActionButton";
import SubmitButton from "@/components/General/SubmitButton";
import { addUser } from "@/lib/redux/slices/user";
import { register } from "@/lib/server-actions/auth";
import { useRouter } from "nextjs-toploader/app";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const UserInfoForm = () => {
  const router = useRouter();
  const dispetch = useDispatch();



  const handleSubmit = async (formData) => {
    try {
      const { password, confirmPassword, firstName } =
        Object.fromEntries(formData);
      if (firstName.length < 4 || firstName.length > 20) {
        toast.error("First Name must be between 4 to 20 characters.");
        return ;
      }
      if (password.length < 4) {
        toast.error("Password must be at least 4 characters long.");
        return ;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return ;
      }
      const response = await register(formData);

      if (response.success) {
        toast.success("Registration successful!");
        
        dispetch(addUser(response.user));
        console.log(response)
        router.push("/");
      } else {
        toast.error(
          response.message || "Failed to register. Please try again."
        );
      }
    } catch (error) {
      console.log(error)
      toast.error("Sorry, something went wrong.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        User Information
      </h2>
      <form action={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your first name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your last name"
          />
        </div>

        <div className="mb-4">
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

        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Confirm your password"
            required
          />
        </div>

        <ActionButton />
      </form>
    </div>
  );
};

export default UserInfoForm;
