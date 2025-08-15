// pages/api/feedback/stats.js
import dbConnect from '@/pages/api/lib/mongodb';
import Feedback from '@/pages/api/lib/models/feedback';


export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      error: `Method ${method} not allowed`
    });
  }

  try {
    const { postId, startDate, endDate } = req.query;

    // Build match stage for aggregation
    const matchStage = {};
    if (postId) matchStage.postId = postId;
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    // Aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          averageRating: { $avg: '$stars' },
          starDistribution: {
            $push: '$stars'
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalFeedback: 1,
          averageRating: { $round: ['$averageRating', 2] },
          starDistribution: {
            1: {
              $size: {
                $filter: {
                  input: '$starDistribution',
                  cond: { $eq: ['$$this', 1] }
                }
              }
            },
            2: {
              $size: {
                $filter: {
                  input: '$starDistribution',
                  cond: { $eq: ['$$this', 2] }
                }
              }
            },
            3: {
              $size: {
                $filter: {
                  input: '$starDistribution',
                  cond: { $eq: ['$$this', 3] }
                }
              }
            },
            4: {
              $size: {
                $filter: {
                  input: '$starDistribution',
                  cond: { $eq: ['$$this', 4] }
                }
              }
            },
            5: {
              $size: {
                $filter: {
                  input: '$starDistribution',
                  cond: { $eq: ['$$this', 5] }
                }
              }
            }
          }
        }
      }
    ];

    const result = await Feedback.aggregate(pipeline);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalFeedback: 0,
          averageRating: 0,
          starDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        }
      });
    }

    res.status(200).json({
      success: true,
      data: result[0]
    });

  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}
