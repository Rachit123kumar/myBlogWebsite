import { slugify } from '@/lib/slugify'
import mongoose, { Schema, model, models, Document } from 'mongoose'

export interface IBlog extends Document {
  title: string
  slug: string
  excerpt: string
  content: string

  tags: string[]
  publishedAt: Date
  readTime: number
  likes: number
  author: string,
  wordCount: number,
  characterCount: number,
  visibilty: string
}


const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },

    tags: { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now },
    readTime: { type: Number, default: 5 },
    likes: { type: Number, default: 0 },
    author: { type: String, required: true },
    wordCount: { type: Number, required: true },
    characterCount: { type: Number, required: true },
    visibilty: {
      type: String,
      enum: ['public', 'private', "draft"],
      default: "draft"
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
)


// BlogSchema.pre("save", async function (next) {
//   const post = this as IBlog
//   if (!post.slug) {
//     const baseSlug = slugify(post.title);
//     let slug = baseSlug
//     let count = 1

//     // checking for duplicates

//     while (await mongoose.models.Blog.findOne({ slug })) {
//       slug = `${baseSlug}-${count}`;
//       count++
//     }
//     post.slug = slug




//   }
//   if (!post.author) {
//     post.author = "maria"

//   }

//   next()
// })




// Prevent re-compilation of model in dev
const Blog = models.Blog || model<IBlog>('Blog', BlogSchema)

export default Blog
