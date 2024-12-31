"use client";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import SubmitButton from "./General/SubmitButton";
import { toast } from "react-toastify";

function BuyModal({ close, product }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [buy, setBuy] = useState({
    quantity: 1,
    address: user?.address || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setBuy({
      ...buy,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!buy.address || buy.address.length < 5) {
      toast.error("Please provide a valid address.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/buy/${product.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: buy.quantity,
            address: buy.address,
          }),
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Your order has been placed successfully.");
        close();
      } else {
        toast.error(result.message || "Sorry, something went wrong.");
      }
    } catch (error) {
      toast.error("Sorry, something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="buyProductModal"
      className="fixed inset-0 z-20 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50"
    >
      <div className="relative p-6 bg-white rounded-lg shadow dark:bg-gray-800 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Place Order
          </h3>
          <button
            onClick={close}
            type="button"
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={buy.quantity}
              onChange={handleChangeInput}
              min="1"
              className="w-full p-2 mt-1 bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Delivery Address
            </label>
            <textarea
              name="address"
              id="address"
              value={buy.address}
              onChange={handleChangeInput}
              className="w-full p-2 mt-1 bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500"
              placeholder="Enter your delivery address"
            ></textarea>
          </div>

          <div className="flex justify-center mt-4">
            <SubmitButton isLoading={isLoading} text="Place Order" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default BuyModal;
