import Image from "next/image";
import Link from "next/link";
import React from "react";
import AddtoCart from "../AddtoCart";

function ProductCard({ product }) {
  return (
    <div className="p-2 border border-black mx-1 rounded-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <div className="rounded-lg p-2 flex flex-col gap-3 relative h-[370px]">
        <Link href={`/product/${product.id}`} className="w-full">
          <Image
            src={product.images[0].url}
            width={1500}
            height={1000}
            alt="Product Image"
            className="w-[1500px] h-[200px] object-cover rounded-lg"
          />
        </Link>
        <div className="text-lg font-semibold">
          {product.name.length > 27
            ? `${product.name.slice(0, 24)}...`
            : product.name}
        </div>
        <div className="">
          {product.description.length > 70
            ? `${product.description.slice(0, 65)}...`
            : product.description}
        </div>
        <div className="text-lg absolute bottom-1">
          RS:{" "}
          <span className="text-rose-500 font-semibold">{product.price}</span>
        </div>
      </div>
        <AddtoCart product={product} />
    </div>
  );
}

export default ProductCard;
