"use client"
import React from "react";
import { useFormStatus } from "react-dom";
import { AiOutlineDelete } from "react-icons/ai";

function SellerProductCardDeleteButton() {
    const {pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="rounded-full p-2 bg-slate-300"
    >
      {!pending ? (
        <AiOutlineDelete size={20} />
      ) : (
        <img src="/loading.gif" width={"18px"} height={"18px"} />
      )}
    </button>
  );
}

export default SellerProductCardDeleteButton;
