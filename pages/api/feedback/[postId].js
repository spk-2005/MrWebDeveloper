import dbConnect from '@/pages/api/lib/mongodb';
import Feedback from '@/pages/api/lib/models/feedback';

export default async function handler(req, res) {
  const {
    query: { postId },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const feedbacks = await Feedback.find({ postId })
          .sort({ createdAt: -1 })
          .lean();

        if (!feedbacks.length) {
          return res.status(404).json({
            success: false,
            error: 'No feedback found for this post'
          });
        }

        // Calculate statistics
        const stats = {
          total: feedbacks.length,
          averageRating: feedbacks.reduce((sum, f) => sum + f.stars, 0) / feedbacks.length,
          starDistribution: {
            1: feedbacks.filter(f => f.stars === 1).length,
            2: feedbacks.filter(f => f.stars === 2).length,
            3: feedbacks.filter(f => f.stars === 3).length,
            4: feedbacks.filter(f => f.stars === 4).length,
            5: feedbacks.filter(f => f.stars === 5).length,
          }
        };

        res.status(200).json({
          success: true,
          data: feedbacks,
          stats
        });

      } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          details: error.message
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).json({
        success: false,
        error: `Method ${method} not allowed`
      });
      break;
  }
}