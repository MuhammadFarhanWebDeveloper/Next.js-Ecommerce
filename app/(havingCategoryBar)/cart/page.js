"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function Cart() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Update localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <div className="lg:flex lg:justify-between">
          <div className="space-y-4 lg:w-2/3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between border-b pb-4"
              >
                {/* Product Image */}
                <div className="flex items-center gap-4">
                  <Image
                    src={item.images[0].url}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <div className="flex flex-col gap-1 w-[70%]">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-500"><span className="font-normal">RS</span>:{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border rounded-md">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.min(item.stock, item.quantity + 1)
                          )
                        }
                        className="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Total Price Section */}
          <div className="lg:w-1/3 lg:ml-5 bg-gray-100 p-5 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-3">Order Summary</h2>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span><span className="font-normal">RS</span>: {calculateTotal()}</span>
            </div>
            <button className="w-full mt-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Checkout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
