"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import AIGenerator from "@/components/myComponent/ai-content-generator"
import {
  Bold,
  Italic,
  Underline,
  Link,
  ImageIcon,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Save,
  Send,
  Sparkles,
} from "lucide-react"

export default function BlogEditor() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [showAIGenerator, setShowAIGenerator] = useState(false)

  // Handle AI-generated content
  const handleAIContentGenerated = (generatedContent: string, type: string) => {
    switch (type) {
      case "title":
        setTitle(generatedContent)
        break
      case "content":
      case "outline":
        setContent(generatedContent)
        break
      case "improve":
      case "expand":
        setContent(generatedContent)
        break
      default:
        setContent(generatedContent)
    }
  }

  const handleAITitlesGenerated = (titles: string[]) => {
    // Titles are handled in the AI generator component
    console.log("Generated titles:", titles)
  }

  // Function to get all editor values
  const getEditorValues = () => {
    return {
      title,
      content,
      tags,
      status: "draft",
      visibility: "public",
      wordCount: content.split(" ").filter((word) => word.length > 0).length,
      characterCount: content.length,
      createdAt: new Date().toISOString(),
    }
  }

  // Function to handle save/publish actions
  const handleSave = async (action: "save" | "publish") => {
    const editorData = getEditorValues()

    console.log("Editor Data:", editorData)
    if(!editorData.title){
      alert("please enter the title");
      return
    }

    try {
      const response = await fetch("/api/save-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editorData,
          action,
        }),
      })

      if (response.ok) {
        console.log(`Post ${action}d successfully!`)
      }
    } catch (error) {
      console.error("Error saving post:", error)
    }
  }

  const exportAsJSON = () => {
    const data = getEditorValues()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `blog-post-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let newText = ""

    switch (format) {
      case "bold":
        newText = `**${selectedText || "bold text"}**`
        break
      case "italic":
        newText = `*${selectedText || "italic text"}*`
        break
      case "underline":
        newText = `<u>${selectedText || "underlined text"}</u>`
        break
      case "h1":
        newText = `# ${selectedText || "Heading 1"}`
        break
      case "h2":
        newText = `## ${selectedText || "Heading 2"}`
        break
      case "h3":
        newText = `### ${selectedText || "Heading 3"}`
        break
      case "link":
        newText = `[${selectedText || "link text"}](https://example.com)`
        break
      case "image":
        newText = `![${selectedText || "alt text"}](/placeholder.svg?height=300&width=600)`
        break
      case "code":
        newText = selectedText.includes("\n")
          ? `\`\`\`\n${selectedText || "code block"}\n\`\`\``
          : `\`${selectedText || "inline code"}\``
        break
      case "ul":
        newText = `- ${selectedText || "list item"}`
        break
      case "ol":
        newText = `1. ${selectedText || "numbered item"}`
        break
      default:
        newText = selectedText
    }

    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + newText.length, start + newText.length)
    }, 0)
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const renderPreview = () => {
    const html = content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/!\[([^\]]*)\]$$([^)]+)$$/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$1. $2</li>')
      .replace(/\n/g, "<br />")

    return { __html: html }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Editor</h1>
            <p className="text-gray-600">Create and edit your blog posts with AI assistance</p>
          </div>
          <Button
            onClick={() => setShowAIGenerator(!showAIGenerator)}
            variant={showAIGenerator ? "default" : "outline"}
            className={showAIGenerator ? "" : "bg-white text-gray-700"}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Post Title</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter your blog post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium"
                />
              </CardContent>
            </Card>

            {/* Formatting Toolbar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex gap-1 border-r pr-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertFormatting("h1")}
                      className="bg-white text-gray-700"
                    >
                      <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertFormatting("h2")}
                      className="bg-white text-gray-700"
                    >
                      <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertFormatting("h3")}
                      className="bg-white text-gray-700"
                    >
                      <Heading3 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex gap-1 border-r pr-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertFormatting("bold")}
                      className="bg-white text-gray-700"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertFormatting("italic")}
                      className="bg-white text-gray-700"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertFormatting("underline")}
                      className="bg-white text-gray-700"
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex gap-1 border-r pr-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertFormatting("ul")}
                      className="bg-white text-gray-700"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertFormatting("ol")}
                      className="bg-white text-gray-700"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertFormatting("link")}
                      className="bg-white text-gray-700"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertFormatting("image")}
                      className="bg-white text-gray-700"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertFormatting("code")}
                      className="bg-white text-gray-700"
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={!isPreview ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPreview(false)}
                      className={!isPreview ? "" : "bg-white text-gray-700"}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={isPreview ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPreview(true)}
                      className={isPreview ? "" : "bg-white text-gray-700"}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>

                  {!isPreview ? (
                    <Textarea
                      id="content-editor"
                      placeholder="Start writing your blog post... Use the toolbar above for formatting or type markdown directly."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                    />
                  ) : (
                    <div
                      className="min-h-[400px] p-4 border rounded-md bg-white prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={renderPreview()}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Generator */}
            {showAIGenerator && (
              <AIGenerator
                onContentGenerated={handleAIContentGenerated}
                onTitleGenerated={handleAITitlesGenerated}
                currentContent={content}
                currentTitle={title}
              />
            )}

            {/* Post Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleSave("save")}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button variant="outline" className="bg-white text-gray-700" onClick={() => handleSave("publish")}>
                    <Send className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                </div>

                <Button variant="outline" size="sm" onClick={exportAsJSON} className="w-full mt-2">
                  Export JSON
                </Button>

                <Separator />

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Badge variant="secondary">Draft</Badge>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Visibility</label>
                  <select className="w-full p-2 border rounded-md text-sm">
                    <option>Public</option>
                    <option>Private</option>
                    <option>Password Protected</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={addTag}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <strong>Bold:</strong> **text** or use toolbar
                </div>
                <div>
                  <strong>Italic:</strong> *text* or use toolbar
                </div>
                <div>
                  <strong>Heading:</strong> # H1, ## H2, ### H3
                </div>
                <div>
                  <strong>Link:</strong> [text](url)
                </div>
                <div>
                  <strong>Image:</strong> ![alt](url)
                </div>
                <div>
                  <strong>Code:</strong> `inline` or \`\`\`block\`\`\`
                </div>
                <div>
                  <strong>List:</strong> - item or 1. item
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
