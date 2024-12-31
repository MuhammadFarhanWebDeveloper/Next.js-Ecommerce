"use client";
import React from "react";
import { toast } from "react-toastify";

function AddtoCart({ product }) {
  const handleAddToCart = () => {
    // Get existing cart items from localStorage
    const storedCart = localStorage.getItem("cartItems");
    const cartItems = storedCart ? JSON.parse(storedCart) : [];

    // Check if the product is already in the cart
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      // Update quantity if product exists
      existingItem.quantity += 1;
    } else {
      // Add new product to cart
      cartItems.push({ ...product, quantity: 1 });
    }

    // Save updated cart back to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    toast.success(`${product.name} has been added to the cart.`);
  };

  return (
    <div>
      <button
        onClick={handleAddToCart}
        className="bg-rose-500 text-white w-full p-2 rounded-lg hover:bg-rose-600"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default AddtoCart;
