import React, { useEffect, useState } from 'react';
import { Star, Send, MessageCircle, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function Feedback({ activeSection, activeItem, postId }) {
  const [feedback, setFeedback] = useState({
    postId: postId || null,
    name: '',
    comment: '',
    stars: 0
  });

  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState({});
  const [existingStats, setExistingStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Update postId when it changes
  useEffect(() => {
    if (postId) {
      setFeedback(prev => ({
        ...prev,
        postId
      }));
      
      // Load existing feedback stats for this post
      loadFeedbackStats();
    }
  }, [postId]);

  // Load existing feedback statistics
  const loadFeedbackStats = async () => {
    if (!postId) return;
    
    setLoadingStats(true);
    try {
      const response = await fetch(`/api/feedback/${postId}?includeStats=true&limit=0`);
      if (response.ok) {
        const data = await response.json();
        setExistingStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading feedback stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const newValidation = {};
    
    if (feedback.stars === 0) {
      newValidation.stars = 'Please provide a star rating';
    }
    
    if (feedback.comment && feedback.comment.length > 500) {
      newValidation.comment = 'Comment cannot exceed 500 characters';
    }
    
    if (feedback.name && feedback.name.length > 100) {
      newValidation.name = 'Name cannot exceed 100 characters';
    }

    setValidation(newValidation);
    return Object.keys(newValidation).length === 0;
  };

  const handleStarClick = (starIndex) => {
    setFeedback(prev => ({
      ...prev,
      stars: starIndex
    }));
    
    // Clear star validation error
    if (validation.stars) {
      setValidation(prev => ({
        ...prev,
        stars: undefined
      }));
    }
  };

  const handleSubmit = async () => {
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    if (!feedback.postId) {
      setError('Post ID is required for feedback submission');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: feedback.postId,
          name: feedback.name || 'Anonymous',
          comment: feedback.comment,
          stars: feedback.stars,
          section: activeSection,
          item: activeItem,
          timestamp: new Date().toISOString()
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to submit feedback`);
      }
      
      console.log('Feedback submitted successfully:', data);
      
      setIsSubmitted(true);
      
      // Reload stats after successful submission
      setTimeout(loadFeedbackStats, 1000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
    
    // Reset form after 3 seconds if successful
    if (!error) {
      setTimeout(() => {
        setIsSubmitted(false);
        setFeedback({
          postId: postId || null,
          name: '',
          comment: '',
          stars: 0
        });
        setValidation({});
      }, 3000);
    }
  };

  const handleInputChange = (field, value) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validation[field]) {
      setValidation(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const getStarDescription = (stars) => {
    const descriptions = {
      1: "We'd love to know how we can improve",
      2: "Thank you for your feedback",
      3: "Good! We appreciate your input",
      4: "Great! We're glad you enjoyed it",
      5: "Awesome! Thank you so much! 🎉"
    };
    return descriptions[stars] || '';
  };

  const renderStarDistribution = () => {
    if (!existingStats || existingStats.total === 0) return null;

    const { averageRating, starDistribution, total } = existingStats;

    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-semibold text-gray-900 mb-3 text-center">
          Current Feedback Summary
        </h3>
        
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-lg">{averageRating}</span>
            <span className="text-gray-600">({total} review{total !== 1 ? 's' : ''})</span>
          </div>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starDistribution[star] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center space-x-2 text-sm">
                <span className="w-8 text-right">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-gray-600">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You! 🎉</h2>
          <p className="text-gray-600 mb-4">
            Your feedback has been submitted successfully. We really appreciate your input!
          </p>
          <div className="flex items-center justify-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= feedback.stars 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {feedback.stars} out of 5 stars
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
            <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{width: '100%'}}></div>
          </div>
          <p className="text-xs text-gray-500">Resetting form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Share Your Feedback</h1>
              <p className="text-blue-100">
                {activeSection && activeItem 
                  ? `Help us improve "${activeItem}" in ${activeSection}`
                  : 'Help us improve your experience'
                }
              </p>
              {postId && (
                <p className="text-xs text-blue-200 mt-1">Post ID: {postId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Existing Feedback Stats */}
        <div className="p-6 pb-0">
          {loadingStats ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Loading existing feedback...</span>
            </div>
          ) : (
            renderStarDistribution()
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Submission Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate your experience? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center justify-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors duration-200 ${
                      star <= (hoveredStar || feedback.stars)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {validation.stars && (
              <p className="text-sm text-red-600 mb-2">{validation.stars}</p>
            )}
            {feedback.stars > 0 && (
              <p className="text-sm text-gray-600">
                {getStarDescription(feedback.stars)}
              </p>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Your Name</span>
                <span className="text-xs text-gray-500">(Optional)</span>
              </div>
            </label>
            <input
              type="text"
              id="name"
              value={feedback.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your name (optional)"
              maxLength={100}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${
                validation.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {validation.name && (
              <p className="text-sm text-red-600 mt-1">{validation.name}</p>
            )}
            <div className="text-right mt-1">
              <span className="text-xs text-gray-400">
                {feedback.name.length}/100 characters
              </span>
            </div>
          </div>

          {/* Comment Field */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Additional Comments</span>
                <span className="text-xs text-gray-500">(Optional)</span>
              </div>
            </label>
            <textarea
              id="comment"
              value={feedback.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Tell us more about your experience... What did you like? What could be improved?"
              rows="4"
              maxLength={500}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none ${
                validation.comment ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {validation.comment && (
              <p className="text-sm text-red-600 mt-1">{validation.comment}</p>
            )}
            <div className="text-right mt-1">
              <span className={`text-xs ${feedback.comment.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                {feedback.comment.length}/500 characters
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || feedback.stars === 0 || !postId}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
            
            {(!postId || feedback.stars === 0) && (
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                  {!postId && 'Post ID is required. '}
                  {feedback.stars === 0 && 'Please provide a rating to submit.'}
                </p>
              </div>
            )}
          </div>

      

  
        </div>
      </div>
    </div>
  );
}