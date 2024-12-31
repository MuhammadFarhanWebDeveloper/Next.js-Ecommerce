import CategoryList from '@/components/Categories/CategoryList';
import ProductsContainer from '@/components/Products/ProductsContainer';
import { getProducts } from '@/lib/data';
import React from 'react'


export const dynamic = 'force-dynamic';
async function page({searchParams}) {
  const page = searchParams.page || 1;
  const category = searchParams.category || "";
  const search = searchParams.search || "";
  
  const {products} = await getProducts(page,  category, search);
  
  return (
    <div>
      <ProductsContainer products={products}heading=''  />
    </div>
  )
}

export default page
