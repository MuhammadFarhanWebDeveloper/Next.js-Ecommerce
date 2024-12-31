"use client";
import React, { useState } from "react";
import ProductActionModal from "./ProductActionModal";
import { useSelector } from "react-redux";
import UpdateShopInfoModal from "./UpdateShopInfoModal";
import CircularImage from "../General/CircularImage";

function SellerHeader() {
  const [IsAddProductOpened, setIsAddProductOpened] = useState(false);
  const [isEditStoreOpened, setIsEditStoreOpened] = useState(false);
  const user = useSelector((state) => state.user.user);

  const toggleAddProductModal = () => {
    setIsAddProductOpened(!IsAddProductOpened);
  };

  const toggleEditStoreModal = () => {
    setIsEditStoreOpened(!isEditStoreOpened);
  };
console.log(user.seller)

  return (
    <>
      {IsAddProductOpened && (
        <ProductActionModal close={toggleAddProductModal} />
      )}
      {isEditStoreOpened && user.seller && (
        <UpdateShopInfoModal
          storeDetail={user.seller}
          close={toggleEditStoreModal}
        />
      )}

      <div className="p-4 rounded bg-slate-300 flex items-center justify-between ">
        <div className="flex items-center gap-2">
        <CircularImage imageUrl={user.seller?.storeLogo || "/noavatar.png"}/>
          <button
            onClick={toggleEditStoreModal}
            className="p-2 rounded-full bg-blue-700 text-white"
          >
            Edit Shop Info
          </button>
        </div>
        <div className="">
                    
          <button
            onClick={toggleAddProductModal}
            className="p-2 rounded-full bg-blue-700 text-white"
          >
            Upload Product
          </button>
        </div>
      </div>
    </>
  );
}

export default SellerHeader;
