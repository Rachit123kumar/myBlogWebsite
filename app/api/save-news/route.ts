import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import News from "@/models/news";
import Numbering from "@/models/numbering";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();

    if (!Array.isArray(body.articles)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const newsData = body.articles.map((article: any, index: number) => ({
      number: index + 1, // 👈 assign sequential number
      title: article.title,
      description: article.description,
      publishedAt: article.publishedAt,
      url: article.url,
    }));

    await News.deleteMany({});
    const inserted = await News.insertMany(newsData);

    await Numbering.findOneAndUpdate(
      {},
      { number: 0, totalLength: newsData.length, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, insertedCount: inserted.length });
  } catch (err) {
    console.error("Insert failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
