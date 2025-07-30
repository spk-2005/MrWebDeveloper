// pages/api/posts.js
 // Adjust path based on your setup
import { ObjectId } from 'mongodb';
import connectMongo from './lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectMongo();
    const collection = db.collection('posts'); // Adjust collection name as needed

    // Extract query parameters
    const { 
      language, 
      heading, 
      limit = 10, 
      page = 1, 
      exclude,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build the filter object
    let filter = {};
    
    if (language && language !== 'all') {
      filter.language = { $regex: new RegExp(language, 'i') };
    }
    
    if (heading && heading !== 'all') {
      filter.heading = { $regex: new RegExp(heading, 'i') };
    }

    // Exclude specific post (for related posts)
    if (exclude) {
      if (ObjectId.isValid(exclude)) {
        filter._id = { $ne: new ObjectId(exclude) };
      } else {
        // If exclude is a slug, find the post and exclude by ID
        const excludePost = await collection.findOne({ slug: exclude });
        if (excludePost) {
          filter._id = { $ne: excludePost._id };
        }
      }
    }

    console.log(`[Posts API] Filter:`, filter);
    console.log(`[Posts API] Limit: ${limit}, Page: ${page}`);

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort = {};
    sort[sortBy] = sortOrder;

    // Calculate pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const posts = await collection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    // Get total count for pagination info
    const totalCount = await collection.countDocuments(filter);
    
    // Add generated slugs to posts if they don't exist
    const postsWithSlugs = posts.map(post => ({
      ...post,
      slug: post.slug || generateSlug(post.title || `${post.language}-${post.heading}-${post._id}`),
      url: generatePostUrl(post)
    }));

    console.log(`[Posts API] Found ${posts.length} posts out of ${totalCount} total`);

    res.status(200).json({ 
      success: true,
      posts: postsWithSlugs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalPosts: totalCount,
        hasNext: pageNum * limitNum < totalCount,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('[Posts API Error]:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Failed to fetch posts from database'
    });
  }
}

// Helper function to generate slug from title
function generateSlug(title) {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing spaces
}

// Helper function to generate post URL
function generatePostUrl(post) {
  const languageSlug = post.language.toLowerCase();
  const headingSlug = generateSlug(post.heading);
  const postSlug = post.slug || generateSlug(post.title || `${post.language}-${post.heading}-${post._id}`);
  
  return `/${languageSlug}/${headingSlug}/${postSlug}`;
}