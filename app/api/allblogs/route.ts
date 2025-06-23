import { connectToDatabase } from "@/lib/db";
import Blog from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ visibility: "public" })
      .sort({ publishedAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ visibility: "public" });

    return NextResponse.json({
      status: "success",
      page,
      totalPages: Math.ceil(total / limit),
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ status: "error", error: "Failed to fetch blogs" }, { status: 500 });
  }
}
