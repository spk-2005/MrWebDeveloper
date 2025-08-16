// pages/api/[id]/like.js
import dbConnect from "../lib/mongodb"; // Adjust path based on your project structure
import Post from "../lib/models/post"; // Adjust path based on your project structure

export default async function handler(req, res) {
  // Enable CORS for faster requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST and GET methods
  if (!['POST', 'GET'].includes(req.method)) {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ 
      success: false, 
      error: `Method ${req.method} Not Allowed` 
    });
  }

  const { id } = req.query;

  // Validate ID parameter
  if (!id) {
    return res.status(400).json({ 
      success: false, 
      error: 'Post ID is required' 
    });
  }

  try {
    await dbConnect();

    switch (req.method) {
      case 'POST':
        const { action, timestamp } = req.body;
        
        // Validate action
        if (!['like', 'unlike'].includes(action)) {
          return res.status(400).json({ 
            success: false, 
            error: 'Action must be either "like" or "unlike"' 
          });
        }

        // Update like count based on action
        const increment = action === 'like' ? 1 : -1;
        
        const updatedPost = await Post.findByIdAndUpdate(
          id,
          { 
            $inc: { likes: increment },
            $set: { lastLiked: new Date() }
          },
          { new: true, runValidators: true }
        );

        if (!updatedPost) {
          return res.status(404).json({ 
            success: false, 
            error: 'Post not found' 
          });
        }

        // Ensure likes don't go below 0
        if (updatedPost.likes < 0) {
          await Post.findByIdAndUpdate(id, { likes: 0 });
          updatedPost.likes = 0;
        }

        // Fast response - include timestamp for client-side verification
        return res.status(200).json({ 
          success: true, 
          likes: updatedPost.likes,
          action: action,
          timestamp: Date.now(),
          postId: id
        });

      case 'GET':
        const post = await Post.findById(id).select('likes lastLiked');
        
        if (!post) {
          return res.status(404).json({ 
            success: false, 
            error: 'Post not found' 
          });
        }

        return res.status(200).json({ 
          success: true, 
          likes: post.likes || 0,
          lastLiked: post.lastLiked
        });

      default:
        return res.status(405).json({ 
          success: false, 
          error: `Method ${req.method} Not Allowed` 
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid post ID format' 
      });
    }

    if (error.name === 'MongoTimeoutError') {
      return res.status(408).json({ 
        success: false, 
        error: 'Database timeout - please try again' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}