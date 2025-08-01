// pages/api/posts/all.js
import mongoose from 'mongoose';
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
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed. Only GET requests are supported.' 
    });
  }

  try {
    // Connect to database
    await connectDB();
    
    // Fetch all posts from MongoDB
    const posts = await Post.find({})
      .select('language heading code likes images createdAt') // Select specific fields
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // Return plain JavaScript objects for better performance

    // Process posts to add computed fields
    const processedPosts = posts.map(post => ({
      id: post._id.toString(),
      language: post.language,
      heading: post.heading,
      title: `${post.heading} - ${post.language} Tutorial`, // Computed title
      content: `Learn ${post.heading} in ${post.language} with detailed examples and explanations.`, // Computed content
      code: post.code,
      likes: post.likes || 0,
      views: Math.floor(Math.random() * 5000) + 100, // Random views (you can replace with actual views from your schema)
      images: post.images || [],
      readingTime: estimateReadingTime(post.code), // Computed reading time
      lastUpdated: post.createdAt,
      createdAt: post.createdAt
    }));

    // Group posts by language for easy access
    const postsByLanguage = processedPosts.reduce((acc, post) => {
      if (!acc[post.language]) {
        acc[post.language] = [];
      }
      acc[post.language].push(post);
      return acc;
    }, {});

    // Send successful response
    res.status(200).json({ 
      success: true, 
      posts: processedPosts,
      postsByLanguage,
      total: processedPosts.length,
      languages: Object.keys(postsByLanguage),
      message: 'Posts fetched successfully'
    });
    
  } catch (error) {
    console.error('Error fetching all posts:', error);
    
    // Send error response
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch posts from database',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      posts: [], // Return empty array as fallback
      total: 0
    });
  }
}

// Helper function to estimate reading time based on code length
function estimateReadingTime(code) {
  if (!code) return '2 mins';
  
  const wordCount = code.split(/\s+/).length;
  const linesOfCode = code.split('\n').length;
  
  // Estimate: 200 words per minute for reading, plus extra time for code comprehension
  const readingMinutes = Math.ceil((wordCount / 200) + (linesOfCode / 20));
  
  if (readingMinutes <= 1) return '1-2 mins';
  if (readingMinutes <= 3) return '2-3 mins';
  if (readingMinutes <= 5) return '3-5 mins';
  if (readingMinutes <= 10) return '5-10 mins';
  return `${readingMinutes} mins`;
}

// Alternative version with additional filtering and pagination support
// Uncomment the sections below if you need these features

/*
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    await connectDB();
    
    // Extract query parameters for filtering/pagination
    const { 
      language, 
      limit = 100, 
      page = 1, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build filter object
    const filter = {};
    if (language) {
      filter.language = { $regex: new RegExp(language, 'i') }; // Case-insensitive search
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    // Fetch posts with filtering and pagination
    const [posts, totalCount] = await Promise.all([
      Post.find(filter)
        .select('language heading code likes images createdAt')
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Post.countDocuments(filter)
    ]);

    const processedPosts = posts.map(post => ({
      id: post._id.toString(),
      language: post.language,
      heading: post.heading,
      title: `${post.heading} - ${post.language} Tutorial`,
      content: `Learn ${post.heading} in ${post.language} with detailed examples and explanations.`,
      code: post.code,
      likes: post.likes || 0,
      views: Math.floor(Math.random() * 5000) + 100,
      images: post.images || [],
      readingTime: estimateReadingTime(post.code),
      lastUpdated: post.createdAt,
      createdAt: post.createdAt
    }));

    res.status(200).json({ 
      success: true, 
      posts: processedPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalPosts: totalCount,
        hasNextPage: skip + posts.length < totalCount,
        hasPrevPage: parseInt(page) > 1
      },
      total: totalCount
    });
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch posts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}
*/