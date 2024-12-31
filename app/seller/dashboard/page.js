import SellerHeader from "@/components/Seller Dashboard/SellerHeader";
import SellerProductContailer from "@/components/Seller Dashboard/SellerProductContailer";
import { getProducts } from "@/lib/data";
import { headers } from "next/headers";

import React from "react";
export const dynamic = "force-dynamic";
async function page() {
  const header = await headers()
  const sellerId = parseInt(header.get("sellerId"));
  const response = await getProducts(1, "", "", sellerId);
  console.log(response)
  return (
    <div className="flex gap-2">
      <div className="md:px-10 w-full flex flex-col gap-2">
        <SellerHeader />
        <SellerProductContailer fetchedProducts={response?.products} />
      </div>
    </div>
  );
}

export default page;
