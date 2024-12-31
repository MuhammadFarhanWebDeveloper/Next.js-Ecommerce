"use client";
import React from "react";
import Slider from "react-slick";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SimpleCarousel({ children }) {
  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10 hidden md:block"
      onClick={onClick}
    >
      <AiOutlineLeft size={24} />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10 hidden md:block"
      onClick={onClick}
    >
      <AiOutlineRight size={24} />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div className="slider-container relative   mx-auto p-4">
      <Slider {...settings} className="h-full w-full">
        {children}
      </Slider>
    </div>
  );
}

export default SimpleCarousel;
