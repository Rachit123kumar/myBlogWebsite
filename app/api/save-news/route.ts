// app/api/fetch-and-insert-news/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import News from "@/models/news";
import Numbering from "@/models/numbering";

export async function GET() {
  await connectToDatabase();

  try {
    // const apiKey = "837cc33aed82cf0429bd669d8e4532a6";
    const apiKey = process.env.MEDIASTACK_API_KEY!;


    const res = await fetch(`http://api.mediastack.com/v1/news?access_key=${apiKey}&languages=en&limit=25`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!Array.isArray(data.data)) {
      return NextResponse.json({ error: "Invalid response from Mediastack" }, { status: 400 });
    }

    const newsData = data.data.map((article: any, index: number) => ({
      number: index + 1,
      title: article.title,
      description: article.description,
      publishedAt: article.published_at,
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
    console.error("Failed to fetch and insert:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
