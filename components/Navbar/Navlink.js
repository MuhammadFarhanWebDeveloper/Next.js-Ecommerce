"use client";
import Link from "next/link";
import React from "react";

function Navlink({ title, href }) {
 

  return (
    <li

      className="relative  select-none text-lg font-semibold"
    >
      <Link href={href} className="w-full h-full navlink">{title}</Link>
    </li>
  );
}

export default Navlink;
