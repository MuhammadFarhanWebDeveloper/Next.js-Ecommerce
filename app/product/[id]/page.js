import ProductOverview from "@/components/Products/ProductOverview";
import RecommendedProducts from "@/components/Products/RecommendedProducts";
import { getProducts } from "@/lib/data";
import prisma from "@/util/db.config";
import React from "react";

async function page({ params }) {
  const fetchedproduct = await prisma.product.findFirst({
    where: {
      id: parseInt(params.id),
    },
    include: {
      seller: true,
      category: true,
      images: true,
    },
  });
  const { createdAt, updatedAt, ...product} = fetchedproduct
  const data = await getProducts(1, product.category.name);
  const products = data?.products?.filter((p) => p.id !== product.id);
  return (
    <div className="md:p-3 p-1">
      <ProductOverview product={product} /> 
      {products?.length > 0 && <RecommendedProducts products={products} />}
    </div>
  );
}

export default page;
