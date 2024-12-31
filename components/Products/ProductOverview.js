"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import CircularImage from "../General/CircularImage";
import { useSelector } from "react-redux";
import Link from "next/link";
import BuyModal from "../BuyModal";
import AddtoCart from "../AddtoCart";

function ProductOverview({ product }) {
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });

  const [activeImage, setActiveImage] = useState(product.images[0].url || "");
  const [isShowZooming, setIsShowZooming] = useState(false);
  const [isBuyOpened, setIsBuyOpened] = useState(false);
  const user = useSelector((state) => state.user.user);
  const handleImageZooming = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({ x, y });
  };
  const changeActiveImage = (url) => {
    setActiveImage(url);
  };
  const toggleBuyModal = () => {
    setIsBuyOpened(!isBuyOpened);
  };
  return (
    <>
      {isBuyOpened && <BuyModal close={toggleBuyModal} product={product} />}
      <div className="flex md:flex-row flex-col gap-3 md:min-h-[400px] h-auto">
        <div className="md:w-[110px]  order-2 md:order-1 p-2 flex flex-row md:flex-col  gap-2 md:h-full ">
          {product.images?.map((image) => {
            return (
              <div
                key={image.id}
                onClick={() => {
                  changeActiveImage(image.url);
                }}
                onMouseEnter={() => {
                  changeActiveImage(image.url);
                }}
                className={`rounded-lg border-gray-500 border cursor-pointer overflow-hidden  w-[90px] h-[90px] ${activeImage ==image.url && "border-4 "}`}
              >
                <Image
                  src={image.url}
                  width={90}
                  height={90}
                  alt="An Image"
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
        {/* Product image */}
        <div className="relative md:order-2 order-1 p-2 md:h-full md:w-[470px]">
          <img
            src={activeImage}
            alt="Camera Image"
            className="w-full border cursor-zoom-in border-black h-full object-contain"
            onMouseMove={handleImageZooming}
            onMouseEnter={() => setIsShowZooming(true)}
            onMouseLeave={() => setIsShowZooming(false)}
          />
          {/* Product image zoom */}
          {isShowZooming && (
            <div className="hidden p-2 lg:block absolute min-w-[350px] z-10 -right-[358px] top-1 min-h-[350px]  bg-slate-200">
              <div
                className="w-full h-full min-w-[350px]  min-h-[350px] bg-slate-200 mix-blend-multiply"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                    zoomImageCoordinate.y * 100
                  }%`,
                  backgroundSize: "170%",
                }}
              ></div>
            </div>
          )}
        </div>
        <div className=" order-3  w-full p-2 flex flex-col">
          <h1 className="font-bold text-2xl">{product.name}</h1>
          <div className="opacity-35 font-medium">{product.category.name}</div>
          <div className="text-3xl font-bold">
            RS: <span className=" text-red-700"> {product.price}</span>
          </div>
          <div className="text-xl font-semibold">
            Available Quantity:{" "}
            <span className=" text-red-700"> {product.stock}</span>
          </div>

        
          <div className="my-2 w-[110px]">
            
            <AddtoCart product={product} />
          </div>

          <div className="md:min-w-1/2 text-lg">{product.description}</div>
          <div className="text-xl font-semibold flex items-center gap-2">
            <CircularImage
              imageUrl={product.seller?.storeLogo || "/noavatar.png"}
            />
            <p>{product.seller.storeName}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductOverview;
