"use client";
  import React, { useState } from "react";
  import Link from "next/link";
  import { useRouter } from "nextjs-toploader/app";
  import CircularImage from "../General/CircularImage";
  import {
    AiOutlineHome,
    AiOutlineLogout,
    AiOutlineSearch,
    AiOutlineShoppingCart,
  } from "react-icons/ai";
  import { GoPencil } from "react-icons/go";
  import UpdateUserModal from "../UpdateUserModal";
  import { useDispatch, useSelector } from "react-redux";
  import Image from "next/image";
  import LogoutConfirmation from "../General/LogoutConfirmation";
  import { logout } from "@/lib/logoutAction";
  import { addUser } from "@/lib/redux/slices/user";
  
  function Navbar({ user: providedUser }) {
    const [isSearchBarOpened, setIsSearchBarOpened] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const [isUserUpdateModalOpened, setIsUserUpdateModalOpened] = useState(false);
    const [userControlMenuOpened, setUserControlMenuOpened] = useState(false);
    const [isLogoutConfirmationOpened, setIsLogoutConfirmationOpened] =
      useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const handleLogout = async () => {
      await logout();
      dispatch(addUser(null));
      router.push("/auth/login");
    };
  
    const user = useSelector((state) => state.user.user);
    const toggleUserUpdateModal = () => {
      setIsMenuOpened(!isMenuOpened);
      setIsUserUpdateModalOpened(!isUserUpdateModalOpened);
    };
  
    const handleSearchSubmit = (e) => {
      e.preventDefault();
      setIsSearchBarOpened(false);
      if (searchQuery.trim()) {
        router.push(`/products?search=${searchQuery}`);
      }
      setSearchQuery("");
    };
  
    const toggleLogoutModal = (e) => {
      setIsLogoutConfirmationOpened(!isLogoutConfirmationOpened);
    };
  
    return (
      <div className="fixed top-0 bg-slate-300 z-20 w-full px-5">
        {isUserUpdateModalOpened && (
          <UpdateUserModal user={user} close={toggleUserUpdateModal} />
        )}
        <div className="w-full h-[70px] flex items-center justify-between">
          {/* Logo */}
          <div>
            <Link href="/" className="text-3xl font-bold text-rose-800">
              <Image
                src={"/logo.png"}
                width={110}
                height={110}
                alt="Logo"
                className=""
              />
            </Link>
          </div>
  
          {/* Search Bar */}
          <div
            className={`md:w-[30%] bg-slate-300 md:h-full ${
              isSearchBarOpened ? "block" : "hidden md:block"
            }`}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex gap-3 p-3 items-center"
            >
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Products"
                className="w-full p-2 rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all duration-300"
              />
              <button
                type="submit"
                className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-all duration-300"
              >
                <AiOutlineSearch className="text-xl" />
              </button>
            </form>
          </div>
  
          {/* Search Icon (Small Screens) */}
          <div
            onClick={() => setIsSearchBarOpened(!isSearchBarOpened)}
            className="p-1 md:hidden rounded-full bg-slate-400 cursor-pointer"
          >
            <AiOutlineSearch size={25} />
          </div>
  
          {/* Hamburger Menu Icon (Small Screens) */}
          {!user?.isSeller && (
            <div
              onClick={() => setIsMenuOpened(!isMenuOpened)}
              className="p-1 border border-black rounded-full md:hidden cursor-pointer"
            >
              <ul>
                <li className="w-6 h-0.5 bg-black my-1"></li>
                <li className="w-6 h-0.5 bg-black my-1"></li>
                <li className="w-6 h-0.5 bg-black my-1"></li>
              </ul>
            </div>
          )}
  
          {/* Menu Links */}
          <div
            className={`flex items-center gap-7 md:flex-row flex-col md:static absolute bg-slate-300 left-0 right-0 top-16 ${
              isMenuOpened ? "block" : "hidden md:flex"
            }`}
          >
            {user && !user?.isSeller && (
              <Link href="/auth/become-seller" className="text-lg font-semibold">
                Become a seller
              </Link>
            )}
            {user?.isSeller && (
              <Link href="/seller/dashboard" className="text-lg font-semibold">
                Dashboard
              </Link>
            )}
            <Link href="/cart" className="text-lg font-semibold">
              Cart
            </Link>
            {!user && (
              <div className="flex md:gap-4 gap-3 items-center mx-4 flex-col md:flex-row">
                <Link href="/auth/login" className="w-fit">
                  Login
                </Link>
                <Link href="/auth/send-otp" className="w-fit">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
  
          {user && (
            <div className="flex items-center md:gap-4">
              {/* User Account Menu */}
              <div className="relative px-3">
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    setIsMenuOpened(!isMenuOpened);
                  }}
                >
                  <CircularImage
                    imageUrl={
                      user?.profilePicture ||
                      providedUser?.profilePicture ||
                      "/noavatar.png"
                    }
                    size={50}
                  />
                </button>
  
                {isMenuOpened && (
                  <ul className="absolute right-0 top-12 bg-gray-600 text-white rounded-lg w-36 py-2 mt-2 z-20">
                    <li
                      onClick={toggleUserUpdateModal}
                      className="p-2 flex items-center cursor-pointer hover:bg-gray-500"
                    >
                      <GoPencil /> <span className="ml-2">Update Info</span>
                    </li>
                    <li
                      onClick={toggleLogoutModal}
                      className="p-2 flex items-center cursor-pointer hover:bg-gray-500"
                    >
                      {isLogoutConfirmationOpened && (
                        <LogoutConfirmation
                          onCancel={toggleLogoutModal}
                          onConfirm={handleLogout}
                        />
                      )}
                      <AiOutlineLogout /> <span className="ml-2">Logout</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export default Navbar;
  