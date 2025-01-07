import ProductsContainer from "@/components/Products/ProductsContainer";
import SimpleCarousel from "@/components/carousel/SimpleCarousel";
import { getProducts } from "@/lib/data";
import Image from "next/image";

export const dynamic = "force-dynamic";
export default async function Home() {
  const { products } = await getProducts();

  return (
    <div>
      <SimpleCarousel>
        <div className="md:h-[430px] h-fit">
          <Image
            src={"/slide-1.webp"}
            width={1366}
            height={400}
            alt="A Product Image"
          />
        </div>
        <div className="md:h-[430px] h-fit">
          <Image
            src={"/slide-2.webp"}
            width={1366}
            height={400}
            alt="A Product Image"
          />
        </div>
        <div className="md:h-[430px] h-fit">
          <Image
            src={"/slide-3.webp"}
            width={1366}
            height={400}
            alt="A Product Image"
          />
        </div>
      </SimpleCarousel>

      <ProductsContainer products={products} />
    </div>
  );
}
