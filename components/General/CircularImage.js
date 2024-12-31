import Image from "next/image";
import React from "react";

function CircularImage({ imageUrl, size = 40 }) {
  return (
    <div
      className={`rounded-full border-2 border-gray-300  overflow-hidden`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <Image
        src={imageUrl}
        width={size}
        height={size}
        className={`object-cover`} style={{width:`${size}px`, height:`${size}px`}}
        alt="Profile picture"
      />
    </div>
  );
}

export default CircularImage;
