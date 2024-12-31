"use server";
import { SignJWT, jwtVerify } from "jose";
import bcryptjs from "bcryptjs";
import prisma from "@/util/db.config";
import { cookies } from "next/headers";
// import cloudinary from "@/util/cloudinary.config";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Helper: Create a JWT
export async function createToken(payload, expiration = "15m") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiration)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

// Helper: Verify a JWT
export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload;
}

function setCookie(name, value, maxAge) {
  cookies().set({
    name,
    value,
    httpOnly: true,
    maxAge,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

// Action: Verify OTP
export async function verifyOTP(formData) {
  const otp = formData.get("otp");
  const token = cookies().get("otpsent")?.value;

  if (!token) {
    return { success: false, message: "OTP token not found." };
  }

  try {
    const payload = await verifyToken(token);
    const isValidOTP = await bcryptjs.compare(otp, payload.otp);

    if (!isValidOTP) {
      return { success: false, message: "Invalid OTP." };
    }

    const verifiedToken = await createToken({ email: payload.email });
    setCookie("verified", verifiedToken, 15 * 60); // 15 minutes

    return {
      success: true,
      message: "User verified successfully.",
    };
  } catch {
    return { success: false, message: "Invalid or expired OTP token." };
  }
}

// Action: Register User
export async function register(formData) {
  const { firstName, lastName = "", password } = Object.fromEntries(formData);
  const token = cookies().get("verified")?.value;

  if (!token) {
    return { success: false, message: "Verification token not found." };
  }

  try {
    if (!firstName) {
      return { success: false, message: "First Name is required" };
    }
    if (!password) {
      return { success: false, message: "Password, is required" };
    }
    const { email } = await verifyToken(token);

    const username = email.split("@")[0];
    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });
    if (existingUser) {
      return { success: false, message: "User already exists." };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const newUserWithSeller = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: { seller: true },
    });

    const sellerId = newUserWithSeller.isSeller
      ? newUserWithSeller.seller.id
      : null;
    const authToken = await createToken(
      { email: newUser.email, id: newUser.id, sellerId },
      "30d"
    );
    setCookie("authtoken", authToken, 30 * 24 * 60 * 60); // 20 days

    return {
      success: true,
      user: newUser,
      message: "User registered successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Invalid or expired verification token.",
    };
  }
}

// Action: Login
export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        seller: true,
      },
    });

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return { success: false, message: "Invalid email or password." };
    }

    const { password: _, createdAt, updatedAt, ...userWithoutPassword } = user;
    const sellerId = user.isSeller ? user.seller.id : null;
    const token = await createToken(
      { email: user.email, id: user.id, sellerId: sellerId },
      "30d"
    );
    setCookie("authtoken", token, 30 * 24 * 60 * 60); // 30 days
    return { success: true, user: userWithoutPassword };
  } catch {
    return { success: false, message: "Internal server error." };
  }
}

export async function resetPassword(formData) {
  const otp = formData.get("otp");
  const newPassword = formData.get("newPassword");

  try {
    const token = cookies().get("resetpasswordtoken")?.value;
    if (!token) {
      return {
        success: false,
        message: "You've no authorization to reset the password",
      };
    }

    const { email } = await verifyToken(token);
    const user = await prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      !(await bcryptjs.compare(otp, user.resetToken)) ||
      new Date() > user.resetTokenExpiresAt
    ) {
      return { success: false, message: "Invalid or expired OTP" };
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });
    cookies().delete("resetpasswordtoken");

    return {
      success: true,
      message: "Password reset successfully.",
    };
  } catch (error) {
    return { success: false, message: error.message || "An error occurred." };
  }
}

// Action: Logout
export async function logout() {
  try {
    cookies().delete("authtoken");
    return {
      success: true,
      message: "Successfully logged out.",
    };
  } catch {
    return { success: false, message: "Internal server error." };
  }
}

export const becomeSeller = async (formData) => {
  try {
    const {
      storeName,
      storeDescription,
      businessAddress,
      socialMediaLinks,
      logo,
      userId,
    } = Object.fromEntries(formData);
    if (!logo) {
      return { success: false, message: "Logo is required" };
    }

    const uploadResult = await cloudinary.uploader.upload(logo.path, {
      folder: "storeLogos",
    });
    let storeLogo = uploadResult.secure_url;

    if (!storeName) {
      return {
        success: false,
        message: "Store Name is required",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.isSeller) {
      return { success: false, message: "User is already a seller" };
    }

    const seller = await prisma.seller.create({
      data: {
        userId: userId,
        storeName: storeName,
        storeDescription: storeDescription || null,
        storeLogo: storeLogo || null,
        businessAddress: businessAddress || null,
        socialMediaLinks: socialMediaLinks
          ? JSON.parse(socialMediaLinks)
          : null,
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
      { email: newUser.email, id: newUser.email, sellerId: seller.id },
      "30d"
    );
    setCookie("authtoken", authtoken, 30 * 24 * 60 * 60);
    return {
      success: true,
      message: "Seller profile created successfully",
      user: newUser,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal server error" };
  }
};

export const updateSellerInfo = async (formData) => {
  try {
    const {
      storeName,
      storeDescription,
      businessAddress,
      socialMediaLinks,
      sellerId,
      logo,
    } = Object.fromEntries(formData);

    const seller = await prisma.seller.findUnique({
      where: { id: parseInt(sellerId) },
    });

    if (!seller) {
      return { success: false, message: "Seller not found" };
    }

    let storeLogo = null;

    if (logo) {
      const uploadResult = await cloudinary.uploader.upload(logo.path, {
        folder: "storeLogos",
      });
      storeLogo = uploadResult.secure_url;
    }

    const updatedSeller = await prisma.seller.update({
      where: { id: seller.id },
      data: {
        storeName: storeName || seller.storeName,
        storeDescription: storeDescription || seller.storeDescription,
        businessAddress: businessAddress || seller.businessAddress,
        socialMediaLinks: socialMediaLinks
          ? JSON.parse(socialMediaLinks)
          : seller.socialMediaLinks,
        storeLogo: storeLogo || seller.storeLogo,
      },
    });

    return {
      success: true,
      message: "Seller information updated successfully",
      seller: updatedSeller,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal server error" };
  }
};
