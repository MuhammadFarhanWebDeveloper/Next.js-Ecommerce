"use client";
import React from "react";
import {
  AiOutlineLogout,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";

function LogoutConfirmation({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <AiOutlineLogout size={24} />
          Confirm Logout
        </h2>
        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700"
          >
            <AiOutlineCloseCircle size={20} />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
          >
            <AiOutlineCheckCircle size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmation;
