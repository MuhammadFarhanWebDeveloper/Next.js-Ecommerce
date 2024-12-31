import cloudinary from "@/util/cloudinary.config";
import prisma from "@/util/db.config";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    const { name, description, price, categoryName, stock, oldImages } =
      Object.fromEntries(formData);
    const newImages = formData.getAll("images");

    const sellerId = parseInt(request.headers.get("sellerId"));
    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.sellerId !== sellerId) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to edit this product",
        },
        { status: 403 }
      );
    }

    let category;
    if (categoryName) {
      category = await prisma.category.findUnique({
        where: { name: categoryName },
      });

      if (!category) {
        return NextResponse.json(
          { success: false, message: "Category not found" },
          { status: 404 }
        );
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = parseFloat(price);
    if (description) updateData.description = description;
    if (stock) updateData.stock = parseInt(stock);
    if (category) updateData.categoryId = category.id;

    // Handle image updates
    const currentImages = product.images.map((img) => img.url);
    const oldImagesArray = oldImages ? JSON.parse(oldImages) : [];
    const oldImageUrls = oldImagesArray.map((image) => image.url);
    const imagesToDelete = currentImages.filter(
      (img) => !oldImageUrls.includes(img)
    );

    // Delete removed images from Cloudinary
    for (const imageUrl of imagesToDelete) {
      const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    const newImageUrls = [];
    for (const file of newImages) {
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

      newImageUrls.push(uploadResult.secure_url);
    }

    await prisma.image.deleteMany({
      where: { productId: product.id },
    });

    await prisma.image.createMany({
      data: [...oldImageUrls, ...newImageUrls].map((url) => ({
        url,
        productId: product.id,
      })),
    });

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
      include: { images: true },
    });

    return NextResponse.json(
      { success: true, product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const sellerId = parseInt(request.headers.get("sellerId"));

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.sellerId !== sellerId) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete this product",
        },
        { status: 403 }
      );
    }

    for (const image of product.images) {
      const publicId = image.url.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: parseInt(id, 10) },
      include: { images: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        product: deletedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
