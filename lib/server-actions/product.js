"use server"
import prisma from "@/util/db.config";
export const deleteProductAction = async (formData) => {
    const id = formData.get("id");
  try {
    console.log("Hello")
    console.log(id)
    const product = await prisma.product.delete({
      where: {
        id:parseInt(id),
      },
    });
    
    return {success: true, product};
  } catch (error) {
    console.log(error);
    return {success: false};
  }
};
