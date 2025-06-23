import { connectToDatabase } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import Blog from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, tags, visibility, author = "maria" } = body;

    await connectToDatabase();

    const wordCount = content.trim().split(/\s+/).length;
    const characterCount = content.length;
    const readTime = Math.ceil(wordCount / 200); // ~200 words per min

    let slug = slugify(title);
    let count = 1;
    let existingPost = await Blog.findOne({ slug });

    while (existingPost) {
      slug = slugify(`${title}-${count}`);
      count++;
      existingPost = await Blog.findOne({ slug });
    }

    const newPost = await Blog.create({
      title,
      content,
      tags,
      author,
      visibility,
      wordCount,
      characterCount,
      readTime,
      slug,
    });

    return NextResponse.json({
      status: "success",
      post: newPost,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    return NextResponse.json(
      { status: "error", error: "Failed to create post" },
      { status: 500 }
    );
  }
}
