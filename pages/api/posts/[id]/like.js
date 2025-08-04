// pages/api/posts/[id]/like.js
import mongoose from 'mongoose';
// Adjust this import path to match your actual Post model location
// Common paths: '../../../lib/models/post' or '../../../../lib/models/post'
import Post from '@/pages/api/lib/models/post';

// MongoDB connection function
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for like API');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Only POST requests are supported.' 
    });
  }

  try {
    await connectDB();
    
    const { id } = req.query;
    const { action } = req.body;

    console.log('Like API called with:', { id, action }); // Debug log

    if (!id) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    if (!action || !['like', 'unlike'].includes(action)) {
      return res.status(400).json({ 
        error: 'Valid action (like/unlike) is required' 
      });
    }

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }

    // Find the post
    const post = await Post.findById(id);
    
    if (!post) {
      console.log('Post not found with ID:', id); // Debug log
      return res.status(404).json({ error: 'Post not found' });
    }

    // Update likes count
    let newLikesCount;
    if (action === 'like') {
      newLikesCount = (post.likes || 0) + 1;
    } else {
      newLikesCount = Math.max((post.likes || 0) - 1, 0);
    }

    console.log('Updating likes from', post.likes, 'to', newLikesCount); // Debug log

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: newLikesCount },
      { new: true, runValidators: true }
    );

    console.log('Post updated successfully:', updatedPost.likes); // Debug log

    res.status(200).json({
      success: true,
      likes: updatedPost.likes,
      message: `Post ${action}d successfully`
    });

  } catch (error) {
    console.error('Error updating post likes:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}