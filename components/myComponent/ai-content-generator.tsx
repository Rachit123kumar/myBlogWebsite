"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Wand2, FileText, PlusCircle, RefreshCw, Loader2 } from "lucide-react"

interface AIGeneratorProps {
  onContentGenerated: (content: string, type: string) => void
  onTitleGenerated: (titles: string[]) => void
  currentContent: string
  currentTitle: string
}

export default function AIGenerator({
  onContentGenerated,
  onTitleGenerated,
  currentContent,
  currentTitle,
}: AIGeneratorProps) {
  const [headline, setHeadline] = useState("")
  const [keyword, setKeyword] = useState("")
  const [generationType, setGenerationType] = useState("content")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])

  const generateContent = async () => {
    if (!headline.trim() && !["improve", "expand"].includes(generationType)) {
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          headline: headline.trim() || currentTitle,
          keyword: keyword.trim(),
          type: generationType,
          existingContent: currentContent,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (generationType === "title") {
          const titles = data.content.split("\n").filter((title: string) => title.trim())
          setGeneratedTitles(titles)
          onTitleGenerated(titles)
        } else {
          onContentGenerated(data.content, generationType)
        }
      } else {
        console.error("Generation failed:", data.error)
        alert("Failed to generate content. Please try again.")
      }
    } catch (error) {
      console.error("Error generating content:", error)
      alert("Error generating content. Please check your connection and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const quickHeadlines = [
    "How to Build a Successful Startup in 2024",
    "The Ultimate Guide to Web Development",
    "10 Digital Marketing Strategies That Actually Work",
    "Artificial Intelligence: The Future is Now",
    "Sustainable Living: Simple Steps for a Better Planet",
  ]

  const quickKeywords = [
    "SEO optimization",
    "digital marketing",
    "web development",
    "artificial intelligence",
    "sustainable living",
    "productivity tips",
    "business growth",
    "technology trends",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Blog Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generation Type Selector */}
        <div>
          <label className="text-sm font-medium mb-2 block">Generation Type</label>
          <Select value={generationType} onValueChange={setGenerationType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="content">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Full Blog Post
                </div>
              </SelectItem>
              <SelectItem value="title">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Blog Titles
                </div>
              </SelectItem>
              <SelectItem value="outline">
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Blog Outline
                </div>
              </SelectItem>
              <SelectItem value="improve">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Improve Content
                </div>
              </SelectItem>
              <SelectItem value="expand">
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Expand Content
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Headline Input */}
        {!["improve", "expand"].includes(generationType) && (
          <div>
            <label className="text-sm font-medium mb-2 block">Blog Headline</label>
            <Input
              placeholder="Enter your blog headline..."
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="mb-2"
            />

            {/* Quick Headlines */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Quick Headlines</label>
              <div className="flex flex-wrap gap-1">
                {quickHeadlines.slice(0, 3).map((quickHeadline, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-purple-50 text-xs"
                    onClick={() => setHeadline(quickHeadline)}
                  >
                    {quickHeadline.length > 30 ? quickHeadline.substring(0, 30) + "..." : quickHeadline}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Keyword Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Target Keyword {!["improve", "expand"].includes(generationType) && "(Optional)"}
          </label>
          <Input
            placeholder="Enter your target keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mb-2"
          />

          {/* Quick Keywords */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Popular Keywords</label>
            <div className="flex flex-wrap gap-1">
              {quickKeywords.slice(0, 4).map((quickKeyword, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 text-xs"
                  onClick={() => setKeyword(quickKeyword)}
                >
                  {quickKeyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Current Content Info for Improve/Expand */}
        {["improve", "expand"].includes(generationType) && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Current Content:</strong> {currentContent.length} characters
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {generationType === "improve"
                ? "AI will enhance your existing content for better readability and SEO"
                : "AI will expand your content with more details and examples"}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={generateContent}
          disabled={
            isGenerating ||
            (!headline.trim() && !["improve", "expand"].includes(generationType)) ||
            (["improve", "expand"].includes(generationType) && !currentContent.trim())
          }
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate {generationType === "title" ? "Titles" : "Content"}
            </>
          )}
        </Button>

        {/* Generated Titles */}
        {generatedTitles.length > 0 && (
          <div>
            <Separator className="my-4" />
            <label className="text-sm font-medium mb-2 block">Generated Titles</label>
            <div className="space-y-2">
              {generatedTitles.map((title, index) => (
                <div
                  key={index}
                  className="p-2 border rounded cursor-pointer hover:bg-gray-50 text-sm"
                  onClick={() => onContentGenerated(title.replace(/^\d+\.\s*/, ""), "title")}
                >
                  {title.replace(/^\d+\.\s*/, "")}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Tips */}
        <div className="text-xs text-gray-600 space-y-1 pt-2 border-t">
          <div>
            <strong>Full Blog Post:</strong> Generates 800-1000 word blog with SEO optimization
          </div>
          <div>
            <strong>Blog Titles:</strong> Creates 5 SEO-friendly title options
          </div>
          <div>
            <strong>Blog Outline:</strong> Structured outline with headings and key points
          </div>
          <div>
            <strong>Improve/Expand:</strong> Enhances existing content with better structure
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
