import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import prisma from "@/util/db.config";
import sendPasswordResetEmail from "@/lib/email/sendPasswordResetEmail";
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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcryptjs.hash(otp, 10);
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedOTP,
        resetTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendPasswordResetEmail(email, otp);
    const payload = {
      email: user.email,
      id: user.id,
    };
    const resetPasswordToken = await createToken(payload);
    const response = NextResponse.json(
      { success: true, message: "Password reset OTP sent to your email." },
      { status: 200 }
    );
    response.cookies.set("resetpasswordtoken", resetPasswordToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 15,
    });
    return response;
  } catch (error) {
    console.error("Error in forgot password API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing the request.",
      },
      { status: 500 }
    );
  }
}
