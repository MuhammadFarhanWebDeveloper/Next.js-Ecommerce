import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import cloudinary from '@/util/cloudinary.config';
import { createToken } from '@/lib/server-actions/auth';
import prisma from '@/util/db.config';


export async function POST(request) {
  try {
    const formData = await request.formData();
    const {
      storeName,
      storeDescription,
      businessAddress,
      socialMediaLinks,
      logo,
    } = Object.fromEntries(formData);


    const userId = parseInt(request.headers.get('userId'));
    console.log(userId)
    
    if (!logo) {
      return NextResponse.json({ success: false, message: "Logo is required" }, { status: 400 });
    }
    console.log(logo)

    if (!storeName) {
      return NextResponse.json({ success: false, message: "Store Name is required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (user.isSeller) {
      return NextResponse.json({ success: false, message: "User is already a seller" }, { status: 400 });
    }

    // Upload logo to Cloudinary
    const bytes = await logo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "storeLogos" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const storeLogo = uploadResult.secure_url;

    const seller = await prisma.seller.create({
      data: {
        userId: userId,
        storeName: storeName,
        storeDescription: storeDescription || null,
        storeLogo: storeLogo,
        businessAddress: businessAddress || null,
        socialMediaLinks: socialMediaLinks ? JSON.parse(socialMediaLinks) : null,
      },
    });

    const newUser = await prisma.user.update({
      where: { id: userId },
      data: { isSeller: true },
      include: {
        seller: true,
      },
    });

    const authtoken = await createToken(
      { email: newUser.email, id: newUser.id, sellerId: seller.id },
      "30d"
    );

    // Set the cookie
    cookies().set('authtoken', authtoken, { maxAge: 30 * 24 * 60 * 60 });

    return NextResponse.json({
      success: true,
      message: "Seller profile created successfully",
      user: newUser,
    }, { status: 200 });

  } catch (error) {
    console.error('Error in become seller route:', error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}