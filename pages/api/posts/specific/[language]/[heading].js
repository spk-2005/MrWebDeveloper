// pages/api/posts/[language]/[heading].js - Fetch specific post only when needed
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
    const { language, heading } = req.query;

    if (!language || !heading) {
      return res.status(400).json({
        success: false,
        message: 'Both language and heading parameters are required'
      });
    }

    await dbConnect();
    console.log(`🔍 Looking for: ${language} - ${heading}`);

    // Normalize the heading parameter (URL slug to title format)
    const normalizedHeading = heading
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Try multiple search strategies for robust matching
    const searchStrategies = [
      // Strategy 1: Exact match with normalized heading
      {
        language: new RegExp(`^${language}$`, 'i'),
        heading: new RegExp(`^${normalizedHeading}$`, 'i')
      },
      // Strategy 2: Exact match with original heading (space format)
      {
        language: new RegExp(`^${language}$`, 'i'),
        heading: new RegExp(`^${heading.replace(/-/g, ' ')}$`, 'i')
      },
      // Strategy 3: Contains match for partial matches
      {
        language: new RegExp(`^${language}$`, 'i'),
        heading: new RegExp(normalizedHeading.replace(/\s+/g, '\\s+'), 'i')
      },
      // Strategy 4: Flexible matching with common variations
      {
        language: new RegExp(`^${language}$`, 'i'),
        $or: [
          { heading: new RegExp(normalizedHeading, 'i') },
          { heading: new RegExp(heading.replace(/-/g, ' '), 'i') },
          { heading: new RegExp(heading.replace(/-/g, ''), 'i') }
        ]
      }
    ];

    let post = null;
    let usedStrategy = null;

    // Try each search strategy until we find a match
    for (let i = 0; i < searchStrategies.length; i++) {
      const query = {
        ...searchStrategies[i],
        $or: [
          { isPublished: true },
          { isPublished: { $exists: false } },
          { isPublished: null }
        ]
      };

      post = await Post.findOne(query).lean().exec();

      if (post) {
        usedStrategy = i + 1;
        console.log(`✅ Found post using strategy ${usedStrategy}: ${post.heading}`);
        break;
      }
    }

    if (!post) {
      console.log(`❌ Post not found for: ${language} - ${normalizedHeading}`);
      return res.status(404).json({
        success: false,
        message: `Post not found`,
        searchedFor: {
          language,
          heading: normalizedHeading,
          originalSlug: heading
        }
      });
    }

    // Process and return the complete post data
    const processedPost = {
      id: post._id?.toString(),
      language: post.language,
      heading: post.heading,
      code: post.code || '',
      likes: parseInt(post.likes) || 0,
      views: parseInt(post.views) || 0,
      images: Array.isArray(post.images) ? post.images : [],
      difficulty: post.difficulty || 'BEGINNER',
      tags: Array.isArray(post.tags) ? post.tags : [],
      description: post.description || '',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      lastUpdated: post.updatedAt || post.createdAt
    };

    // Optional: Update view count asynchronously (don't await to avoid slowing response)
    Post.findByIdAndUpdate(
      post._id,
      { $inc: { views: 1 } },
      { new: false }
    ).catch(err => console.log('View count update failed:', err));

    return res.status(200).json({
      success: true,
      post: processedPost,
      searchStrategy: usedStrategy
    });

  } catch (error) {
    console.error('❌ Specific post API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch specific post',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}