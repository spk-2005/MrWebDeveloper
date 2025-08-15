// pages/api/feedback/index.js
import dbConnect from '@/pages/api/lib/mongodb';
import Feedback from '@/pages/api/lib/models/feedback';


export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const { postId, name, comment, stars, section, item, timestamp } = req.body;

        // Validation
        if (!postId) {
          return res.status(400).json({
            success: false,
            error: 'postId is required'
          });
        }

        if (!stars || stars < 1 || stars > 5) {
          return res.status(400).json({
            success: false,
            error: 'stars must be a number between 1 and 5'
          });
        }

        // Create feedback
        const feedback = await Feedback.create({
          postId,
          name: name || 'Anonymous',
          comment: comment || '',
          stars: Number(stars),
          section: section || '',
          item: item || '',
          timestamp: timestamp || new Date()
        });

        res.status(201).json({
          success: true,
          data: feedback,
          message: 'Feedback submitted successfully'
        });

      } catch (error) {
        console.error('Error creating feedback:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          details: error.message
        });
      }
      break;

    case 'GET':
      try {
        const { 
          postId, 
          stars, 
          page = 1, 
          limit = 10, 
          sortBy = 'createdAt', 
          sortOrder = 'desc' 
        } = req.query;

        // Build filter
        const filter = {};
        if (postId) filter.postId = postId;
        if (stars) filter.stars = Number(stars);

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Execute query
        const feedbacks = await Feedback.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(Number(limit))
          .lean();

        // Get total count for pagination
        const total = await Feedback.countDocuments(filter);

        res.status(200).json({
          success: true,
          data: feedbacks,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        });

      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          details: error.message
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        error: `Method ${method} not allowed`
      });
      break;
  }
}