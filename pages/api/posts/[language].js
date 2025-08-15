// pages/api/posts/[language].js - Language-specific endpoint for faster fetching
import dbConnect from '@/pages/api/lib/mongodb';
import Post from '@/pages/api/lib/models/post';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { language } = req.query;
    const { 
      limit = 20, 
      fields = 'basic',
      includeCode = 'false' 
    } = req.query;

    if (!language) {
      return res.status(400).json({
        success: false,
        message: 'Language parameter is required'
      });
    }

    await dbConnect();

    // Build query for specific language
    const query = {
      language: new RegExp(`^${language}$`, 'i'), // Exact match, case insensitive
      $or: [
        { isPublished: true },
        { isPublished: { $exists: false } },
        { isPublished: null }
      ]
    };

    // Selective field projection for better performance
    let selectFields = 'language heading _id createdAt updatedAt likes views difficulty description tags';
    
    if (includeCode === 'true') {
      selectFields += ' code images';
    }

    const posts = await Post.find(query)
      .select(selectFields)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean()
      .exec();

    const processedPosts = posts.map((post) => ({
      id: post._id?.toString(),
      language: post.language,
      heading: post.heading,
      ...(includeCode === 'true' && { 
        code: post.code || '',
        images: Array.isArray(post.images) ? post.images : []
      }),
      likes: parseInt(post.likes) || 0,
      views: parseInt(post.views) || 0,
      difficulty: post.difficulty || 'BEGINNER',
      tags: Array.isArray(post.tags) ? post.tags : [],
      description: post.description || '',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      posts: processedPosts,
      language: language,
      count: processedPosts.length
    });

  } catch (error) {
    console.error('❌ Language-specific API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch language-specific posts',
      error: error.message
    });
  }
}