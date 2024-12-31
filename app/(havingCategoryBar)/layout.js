import CategoryList from "@/components/Categories/CategoryList";
import React from "react";

async function layout({children}) {

  return (
    <div>
      <CategoryList  />
      {children}
    </div>
  );
}

export default layout;
