import cloudinary from "@/util/cloudinary.config";
import prisma from "@/util/db.config";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const { name, description, price, categoryName, stock } = Object.fromEntries(formData);
    const images = formData.getAll("images");

    const sellerId = parseInt(request.headers.get("sellerId"));
    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 }
      );
    }

    if (!name || !description || !price || !categoryName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 400 }
      );
    }

    const imageUrls = [];
    if (images) {
      const imageFiles = images instanceof File ? [images] : images;

      for (const file of imageFiles) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(buffer);
        });

        imageUrls.push(uploadResult.secure_url);
      }
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 1,
        sellerId: sellerId,
        categoryId: category.id,
      },
    });

    await prisma.image.createMany({
      data: imageUrls.map((url) => ({
        url,
        productId: product.id,
      })),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product uploaded successfully",
        product: {
          ...product,
          images: imageUrls.map((url) => ({ url })),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}