"use client";
import React, { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import CircularImage from "../General/CircularImage";
import SubmitButton from "../General/SubmitButton";
import { toast } from "react-toastify";

function UpdateShopInfoModal({ close, storeDetail: shopObject }) {
  const router = useRouter();
  const dispetch = useDispatch();

  const storeLogoRef = useRef();
  const [storeDetail, setStoreDetail] = useState(shopObject);
  const [storeLogo, setStoreLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const changestoreLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoreLogo(file);
      setStoreDetail({ ...storeDetail, storeLogo: URL.createObjectURL(file) });
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setStoreDetail({
      ...storeDetail,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("storeName", storeDetail.storeName);
    formData.append("storeDescription", storeDetail.storeDescription);
    formData.append("businessAddress", storeDetail.businessAddress);

    storeLogo && formData.append("logo", storeLogo);

    try {
      const request = await fetch(
        `/api/auth/edit-seller-info`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      const response = await request.json();

      if (response.success) {
        toast.success("Your shop informations successfully updated.");
        close();
      }
    } catch (error) {
      toast.error("Something went wrong.Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="updateProductModal"
      className=" overflow-x-hidden fixed top-0 right-0 left-0 z-20 justify-center items-center w-full md:inset-0 h-full  md:h-full"
    >
      <div className="relative p-4 mx-auto w-full  max-w-2xl  h-full md:h-auto ">
        <div className="relative p-4 bg-white overflow-y-auto top-0 h-full rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <div className="flex justify-between items-center  mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 ">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Store Detail
            </h3>
            <button
              onClick={() => {
                close();
              }}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <AiOutlineClose size={19} />
            </button>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 mx-auto">
                <div
                  className="cursor-pointer rounded-full border-2 border-black"
                  onClick={() => {
                    storeLogoRef.current.click();
                  }}
                >
                  <CircularImage
                    imageUrl={storeDetail?.storeLogo || "/noavatar.png"}
                    size={100}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changestoreLogo}
                    name="storeLogo"
                    id="storeLogo"
                    ref={storeLogoRef}
                    hidden
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="storeName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  id="storeName"
                  value={storeDetail?.storeName || ""}
                  onChange={handleChangeInput}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="storeDescription"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Store Description
                </label>
                <textarea
                  name="storeDescription"
                  id="storeDescription"
                  value={storeDetail?.storeDescription || ""}
                  onChange={handleChangeInput}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                ></textarea>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="businessAddress"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Business Address
                </label>
                <textarea
                  name="businessAddress"
                  id="businessAddress"
                  value={storeDetail?.businessAddress || ""}
                  onChange={handleChangeInput}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                ></textarea>
              </div>
            </div>

            <div className="flex justify-center my-2 ">
              <SubmitButton isLoading={isLoading} text="Update" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateShopInfoModal;
