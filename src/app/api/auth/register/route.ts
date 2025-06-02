import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { generateTokens } from "../../../../lib/jwt";

export async function POST(request: {
  json: () => Promise<{ username: any; password: any; adminKey: any }>;
}) {
  try {
    await connectDB();

    const { username, password, adminKey } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // Determine role - check for admin key
    let role = "user";
    if (
      adminKey === process.env.ADMIN_KEY ||
      adminKey === "snapchefAdmin"
    ) {
      role = "admin";
    }

    // Create new user
    const user = new User({
      username,
      password,
      role,
    });

    await user.save();

    // Generate tokens
    const { accessToken, user: userInfo } = generateTokens(user);

    // Create response
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: userInfo,
        token: accessToken,
      },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);

    if (
      error instanceof Error &&
      typeof (error as any).code === "number" &&
      (error as any).code === 11000
    ) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
