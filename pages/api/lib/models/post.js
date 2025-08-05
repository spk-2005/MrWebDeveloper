// src/app/lib/models/post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String], // This will store Base64 strings
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;