"use client";
import { initializeProducts } from "@/lib/redux/slices/products";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SellerProductCard from "./SellerProductCard";

function SellerProductContailer({ fetchedProducts }) {
  const user = useSelector((state) => state.user.user);
  const sellerId = user?.seller?.id || 0;
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeProducts(fetchedProducts));
  }, []);

  return (
    <div className="flex gap-2 flex-wrap content-start items-center">
      {products && products.length > 0 ? (
        products.map((product) => {
          return <SellerProductCard key={product.id} product={product} />;
        })
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
}

export default SellerProductContailer;
