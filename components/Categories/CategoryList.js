"use client";
import { useRouter } from "nextjs-toploader/app";

import React, { useRef, useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useSelector } from "react-redux";

function CategoryList() {
  const listRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const categories = useSelector((state) => state.categories?.categories);
  // Scroll to the left
  const handleScrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // Scroll to the right
  const handleScrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Check if scrolling is possible and update arrow visibility
  useEffect(() => {
    const handleScrollCheck = () => {
      if (listRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = listRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    handleScrollCheck();

    // Add scroll event listener
    const list = listRef.current;
    if (list) {
      list.addEventListener("scroll", handleScrollCheck);
    }

    // Cleanup listener
    return () => {
      if (list) {
        list.removeEventListener("scroll", handleScrollCheck);
      }
    };
  }, []);
  const router = useRouter();

  const handleCategoryClick = (categoryName) => {
    const encodedCategoryName = encodeURIComponent(categoryName);
    router.push(`/products?category=${encodedCategoryName}`);
  };
  return (
    <div className=" shadow-md w-full p-2 flex justify-between gap-3 items-center max-w-full overflow-hidden">
      {/* Left arrow (conditionally hidden if scrolling left is not possible) */}
      <div
        onClick={handleScrollLeft}
        className={`bg-slate-400 border border-black p-2 rounded-full cursor-pointer ${
          !canScrollLeft ? "hidden" : ""
        }`}
      >
        <AiOutlineLeft size={18} />
      </div>

      {/* Scrollable list */}
      <div className="w-full overflow-hidden flex justify-center">
        <ul
          ref={listRef}
          className="inline-flex overflow-x-auto whitespace-nowrap gap-3 items-center justify-start max-w-full no-scrollbar"
        >
          <li
            onClick={() => {
              router.push(`/products?limit=16`);
            }}
            className="p-1 rounded-full bg-blue-500 px-4 text-white font-medium cursor-pointer hover:bg-blue-600 transition-all"
          >
            All
          </li>
          {categories?.map((category) => {
            return (
              <li
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="p-1 rounded-full bg-blue-500 px-4 text-white font-medium cursor-pointer hover:bg-blue-600 transition-all"
              >
                {category.name}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right arrow (conditionally hidden if scrolling right is not possible) */}
      <div
        onClick={handleScrollRight}
        className={`bg-slate-400 p-2 rounded-full cursor-pointer ${
          !canScrollRight ? "hidden" : ""
        }`}
      >
        <AiOutlineRight size={18} />
      </div>
    </div>
  );
}

export default CategoryList;
