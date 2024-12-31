import React from "react";
import ResponsiveCardCarousel from "../carousel/ResponsiveCardCarousel";
import ProductCard from "./ProductCard";

function RecommendedProducts({ products }) {
  return (
    <div className="w-full my-5">
      <h2 className="text-2xl my-5 px-2 font-bold">Recommended Products</h2>

      <ResponsiveCardCarousel>
        {products?.map((product) => {
          return (
            
              <ProductCard key={product.id} product={product} />

          );
        })}
      </ResponsiveCardCarousel>
    </div>
  );
}

export default RecommendedProducts;
