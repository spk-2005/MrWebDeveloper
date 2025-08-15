
// pages/api/feedback/bulk.js
import dbConnect from '@/pages/api/lib/mongodb';
import Feedback from '@/pages/api/lib/models/feedback';


export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const { feedbacks } = req.body;

        if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
          return res.status(400).json({
            success: false,
            error: 'feedbacks must be a non-empty array'
          });
        }

        // Validate each feedback
        const validatedFeedbacks = feedbacks.map((feedback, index) => {
          if (!feedback.postId) {
            throw new Error(`Feedback at index ${index} is missing postId`);
          }
          if (!feedback.stars || feedback.stars < 1 || feedback.stars > 5) {
            throw new Error(`Feedback at index ${index} has invalid stars value`);
          }
          return {
            postId: feedback.postId,
            name: feedback.name || 'Anonymous',
            comment: feedback.comment || '',
            stars: Number(feedback.stars),
            section: feedback.section || '',
            item: feedback.item || '',
            timestamp: feedback.timestamp || new Date()
          };
        });

        const result = await Feedback.insertMany(validatedFeedbacks);

        res.status(201).json({
          success: true,
          data: result,
          message: `${result.length} feedbacks created successfully`
        });

      } catch (error) {
        console.error('Error creating bulk feedback:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          details: error.message
        });
      }
      break;

    case 'DELETE':
      try {
        const { postIds, confirm } = req.body;

        if (confirm !== 'DELETE_ALL_FEEDBACK') {
          return res.status(400).json({
            success: false,
            error: 'Confirmation required. Set confirm to "DELETE_ALL_FEEDBACK"'
          });
        }

        let filter = {};
        if (postIds && Array.isArray(postIds)) {
          filter.postId = { $in: postIds };
        }

        const result = await Feedback.deleteMany(filter);

        res.status(200).json({
          success: true,
          message: `${result.deletedCount} feedbacks deleted successfully`
        });

      } catch (error) {
        console.error('Error deleting bulk feedback:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          details: error.message
        });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      res.status(405).json({
        success: false,
        error: `Method ${method} not allowed`
      });
      break;
  }
}