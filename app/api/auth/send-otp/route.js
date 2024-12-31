import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "@/util/db.config";
import sendVerificationEmail from "@/lib/email/sendVerificationEmail";
import { createToken } from "@/lib/server-actions/auth";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Generate and hash OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcryptjs.hash(otp, 10);

    // Send OTP email
    await sendVerificationEmail(email, otp);

    // Save hashed OTP in a secure cookie
    const token = await createToken({ email, otp: hashedOTP });
    cookies().set("otpsent", token, {
      maxAge: 15 * 60, // 15 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Verification email sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send OTP API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing the request.",
      },
      { status: 500 }
    );
  }
}
