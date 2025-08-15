// pages/api/posts/all.js - Optimized version with selective fetching
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

    // Get query parameters for optimization
    const { 
      language, 
      limit = 50,     // Default reduced limit
      page = 1,       // Pagination support
      fields = 'basic' // Control which fields to fetch
    } = req.query;

    // Build query based on parameters
    let query = {
      $or: [
        { isPublished: true },
        { isPublished: { $exists: false } },
        { isPublished: null }
      ]
    };

    // Add language filter if specified
    if (language) {
      query.language = new RegExp(language, 'i'); // Case insensitive
    }

    // Define field selection based on request
    let selectFields;
    switch (fields) {
      case 'minimal':
        // Only essential fields for listings
        selectFields = 'language heading _id createdAt updatedAt likes views difficulty';
        break;
      case 'basic':
        // Essential fields plus description and tags
        selectFields = 'language heading _id createdAt updatedAt likes views difficulty description tags';
        break;
      case 'full':
        // All fields including code content
        selectFields = ''; // Empty string means select all
        break;
      default:
        selectFields = 'language heading _id createdAt updatedAt likes views difficulty description tags';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    console.log('🔍 Query params:', { language, limit, page, fields, skip });

    // Optimized query with projection and pagination
    const postsQuery = Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Convert to plain objects for better performance

    // Apply field selection if specified
    if (selectFields) {
      postsQuery.select(selectFields);
    }

    const posts = await postsQuery.exec();

    // Get total count for pagination (only when needed)
    let totalCount = null;
    if (req.query.includeTotal === 'true') {
      totalCount = await Post.countDocuments(query);
    }

    console.log(`✅ Found ${posts.length} posts`);

    // Process posts for consistent structure
    const processedPosts = posts.map((post) => ({
      id: post._id?.toString(),
      language: post.language || 'UNKNOWN',
      heading: post.heading || 'Untitled',
      code: post.code || '', // Only include if full fields requested
      likes: parseInt(post.likes) || 0,
      views: parseInt(post.views) || 0,
      images: Array.isArray(post.images) ? post.images : [],
      difficulty: post.difficulty || 'BEGINNER',
      tags: Array.isArray(post.tags) ? post.tags : [],
      description: post.description || '',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    const response = {
      success: true,
      posts: processedPosts,
      count: processedPosts.length,
      page: parseInt(page),
      limit: parseInt(limit),
      message: `Successfully fetched ${processedPosts.length} posts`
    };

    // Include total count if requested
    if (totalCount !== null) {
      response.total = totalCount;
      response.hasMore = skip + processedPosts.length < totalCount;
    }

    return res.status(200).json(response);

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
      count: 0
    });
  }
}