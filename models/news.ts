import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  number: Number, // 👈 add this line
  title: String,
  description: String,
  publishedAt: Date,
  url: String,
});

const News = mongoose.models.News || mongoose.model("News", newsSchema);
export default News;
