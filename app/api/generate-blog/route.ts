import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

const API_KEY = process.env.GEMINI_API_KEY!
console.log(API_KEY)
const MODEL_NAME = "gemini-1.5-flash" // or gemini-2.5-flash when available to your API key

export async function POST(req: NextRequest) {
  const { headline, keyword, type, existingContent } = await req.json()

  let prompt = ""

  switch (type) {
    case "title":
      prompt = `Generate 5 creative and SEO-friendly blog titles related to the topic: "${headline}". 
Include the keyword "${keyword}" naturally in the titles. Return only the titles, one per line.`
      break

    case "outline":
      prompt = `Create a detailed blog outline for the headline: "${headline}".
Include the keyword "${keyword}" naturally throughout the outline. 
Structure it with main headings, subheadings, and key points to cover.`
      break

    case "content":
      prompt = `Write a detailed blog post of around 800-1000 words with the headline: "${headline}".
Include the keyword "${keyword}" naturally in the post. Format the blog with proper headings, subheadings, and paragraphs. Write in markdown.`
      break

    case "improve":
      prompt = `Improve this blog content while keeping the focus on "${headline}" and naturally including the keyword "${keyword}":

${existingContent}

Focus on:
- Better readability and flow
- More engaging language
- Improved structure and formatting
- SEO optimization
- Keep the same markdown formatting`
      break

    case "expand":
      prompt = `Expand this blog content with more details, examples, and insights while maintaining focus on "${headline}" and naturally including the keyword "${keyword}":

${existingContent}

Add more depth, examples, and valuable information while keeping the same tone and style.`
      break

    default:
      prompt = `Write a detailed blog post of around 800-1000 words with the headline: "${headline}".
Include the keyword "${keyword}" naturally in the post. Format the blog with proper headings, subheadings, and paragraphs. Write in markdown.`
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      throw new Error("No content generated")
    }

    return NextResponse.json({
      success: true,
      content,
      type,
    })
  } catch (error: any) {
    console.error("Gemini API Error:", error.response?.data || error.message)
    return NextResponse.json({ error: "Failed to generate blog content" }, { status: 500 })
  }
}
