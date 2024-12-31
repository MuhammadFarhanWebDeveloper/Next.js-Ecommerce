import cloudinary from "@/util/cloudinary.config";
import prisma from "@/util/db.config";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const { firstName, lastName, bio, address, phoneNumber, profilePicture } =
      Object.fromEntries(formData);

    const userId = parseInt(request.headers.get("userId"));
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 }
      );
    }

    if (firstName.length < 4) {
      return NextResponse.json(
        {
          success: false,
          messages: "first name must be greater than 4 characters",
        },
        { status: 400 }
      );
    }
    const updateData = { firstName, lastName, bio, address, phoneNumber };

    if (profilePicture) {
      const file = profilePicture instanceof File ? profilePicture : null;

      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "profilePictures" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(buffer);
        });

        updateData.profilePicture = uploadResult.secure_url;
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid profile picture file" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
