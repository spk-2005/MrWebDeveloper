// pages/api/posts/all.js - Fixed version with Mongoose
import dbConnect from '@/pages/api/lib/mongodb';
import Post from '@/pages/api/lib/models/post';

export default async function handler(req, res) {
  console.log('🔄 API /posts/all called');

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Connect to MongoDB
    await dbConnect();
    console.log('✅ Connected to MongoDB successfully');
    
    // Debug: Check if Post model has the required methods
    console.log('🔍 Post model methods:', typeof Post.find);
    
    // Fetch posts - Try different queries
    console.log('📊 Fetching posts from code_posts collection...');
    
    // First, try without any filter
    const allPosts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .lean()
      .exec();
    
    console.log(`🔍 Total posts without filter: ${allPosts.length}`);
    
    // Then try with more inclusive filter
    const posts = await Post.find({ 
      $or: [
        { isPublished: true },
        { isPublished: { $exists: false } },
        { isPublished: null }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(500)
      .lean()
      .exec();
    
    console.log(`🔍 Posts with inclusive filter: ${posts.length}`);
    
    console.log(`✅ Found ${posts.length} posts`);
    
    // Log sample post structure
    if (posts.length > 0) {
      console.log('📝 Sample post structure:', {
        id: posts[0]._id,
        language: posts[0].language,
        heading: posts[0].heading?.substring(0, 50) + '...',
        hasCode: !!posts[0].code,
        createdAt: posts[0].createdAt
      });
    }
    
    return res.status(200).json({
      success: true,
      posts: posts,
      total: posts.length,
      message: `Successfully fetched ${posts.length} posts`
    });
    
  } catch (error) {
    console.error('❌ API Error Details:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: 'Database query failed',
      error: error.message,
      posts: [],
      total: 0
    });
  }
}