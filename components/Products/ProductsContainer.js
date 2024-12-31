import React from "react";
import ProductCard from "./ProductCard";

async function ProductsContainer({ heading = "Latest Products", products }) {

  return (
    <section className="px-5 py-8  md:py-12">
      <h1 className="text-3xl font-bold mb-5">{heading}</h1>
      <div className="w-full flex items-center  flex-wrap">
        {products?.map((product) => {
          return (
              <ProductCard key={product.id} product={product}/>
          );
        })}
      </div>
    </section>
  );
}

export default ProductsContainer;
