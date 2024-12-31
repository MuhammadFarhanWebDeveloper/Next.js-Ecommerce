"use client";
import CircularImage from "@/components/General/CircularImage";
import SubmitButton from "@/components/General/SubmitButton";
import { addUser } from "@/lib/redux/slices/user";
import { useRouter } from "nextjs-toploader/app";

import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function page() {
  const logoRef = useRef();
  const router = useRouter();
  const dispetch = useDispatch();
  const [formInputs, setFormInputs] = useState({
    storeName: "",
    storeDescription: "",
    businessAddress: "",
    logo: "",
  });
  const [logo, setLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChangeLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setFormInputs({ ...formInputs, logo: URL.createObjectURL(file) });
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInputs({
      ...formInputs,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('logo', logo);
      
      Object.keys(formInputs).forEach(key => key!=='logo' && formData.append(key, formInputs[key]));
  
      const response = await fetch('/api/auth/become-seller', {
        method: 'POST',
        body: formData,
      });
  
      const sellerDetail = await response.json();
  
      if (response.ok && sellerDetail?.success) {
        toast.success("You can now sell your products.");
        dispetch(addUser(sellerDetail.user));
        router.push("/seller/dashboard");
      } else {
        toast.error(
          sellerDetail.message || "Failed to become a seller. Please try again."
        );
      }
    } catch (error) {
      toast.error("Failed to become a seller. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Become a Seller
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col items-center gap-2">
          <div
            className="cursor-pointer rounded-full border-2 border-black w-fit h-fit mx-auto"
            onClick={() => {
              logoRef.current.click();
            }}
          >
            <CircularImage
              imageUrl={formInputs.logo || "/noavatar.png"}
              size={100}
            />
          </div>
          <label
            className="text-lg font-semibold mx-auto text-center h-fit cursor-pointer"
            htmlFor="logo"
          >
            Store Logo
          </label>
          <input
            type="file"
            name="logo"
            id="logo"
            ref={logoRef}
            accept="images/*"
            onChange={handleChangeLogo}
            hidden
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="storeName"
          >
            Store Name
          </label>
          <input
            type="text"
            name="storeName"
            id="storeName"
            value={formInputs.storeName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your store name"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="storeDescription"
          >
            Store Description
          </label>
          <textarea
            name="storeDescription"
            id="storeDescription"
            value={formInputs.storeDescription}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your Store Description..."
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="businessAddress"
          >
            Business Address
          </label>
          <textarea
            name="businessAddress"
            id="businessAddress"
            value={formInputs.businessAddress}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your Store Description..."
            required
          />
        </div>

        <SubmitButton isLoading={isLoading} text="Become Seller" />
      </form>
    </div>
  );
}

export default page;
