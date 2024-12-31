"use client";
import React, { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import CircularImage from "./General/CircularImage";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addUser } from "@/lib/redux/slices/user";
import SubmitButton from "./General/SubmitButton";
import { toast } from "react-toastify";

function UpdateUserModal({ close, user: userObject }) {
  const router = useRouter();
  const dispetch = useDispatch();

  const profilePictureRef = useRef();
  const [user, setUser] = useState(userObject);
  const [profilePicture, setProfilePicture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log(user);

  const changeProfilePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setUser({ ...user, profilePicture: URL.createObjectURL(file) });
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("profilePicture", profilePicture); // Add profile picture
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("bio", user.bio);
    formData.append("address", user.address);
    formData.append("phoneNumber", user.phoneNumber);

    try {
      const request = await fetch(`/api/auth/update-user`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const response = await request.json();

      if (response.success) {
        toast.success("Your informations successfully updated");
        dispetch(addUser(response.user));
        close();
      } else {
        toast.error(response.message || "Sorry something went wrong.");
      }
    } catch (error) {
      toast.error("Sorry, something went wrong.");
    } finally {
      setIsLoading(false);
    }

    // setError("");
  };

  return (
    <div
      id="updateProductModal"
      className=" overflow-x-hidden fixed top-0 right-0 left-0 z-10 justify-center items-center w-full md:inset-0 h-full  md:h-full"
    >
      <div className="relative p-4 mx-auto w-full  max-w-2xl  h-full md:h-auto ">
        <div className="relative p-4 bg-white overflow-y-auto top-0 h-full rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <div className="flex justify-between items-center  mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 ">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Update User
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
                    profilePictureRef.current.click();
                  }}
                >
                  <CircularImage
                    imageUrl={user?.profilePicture || "/noavatar.png"}
                    size={100}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changeProfilePicture}
                    name="profilePicture"
                    id="profilePicture"
                    ref={profilePictureRef}
                    hidden
                  />
                </div>
              </div>
              <div className="">
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={user?.firstName || ""}
                  onChange={handleChangeInput}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div className="">
                <label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={user?.lastName || ""}
                  onChange={handleChangeInput}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="phoneNumber"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="w-5 h-5 text-gray-500 "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0v10h12V5H4zm3 2a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={user?.phoneNumber}
                    onChange={handleChangeInput}
                    className=" bg-gray-700 text-white text-sm rounded-lg  block w-full pl-10 p-2.5 "
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="bio"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  value={user?.bio || ""}
                  onChange={handleChangeInput}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                ></textarea>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  value={user?.address || ""}
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

export default UpdateUserModal;
