import React from 'react';
import { usePostsContext } from '../components/PostContext';
import { Loader2, BookOpen, Zap } from 'lucide-react';

export default function AppLoadingScreen({ children }) {
  const { isInitialLoading, error } = usePostsContext();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-2xl border border-white/20">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center">
              <span className="text-red-500 text-4xl">⚠️</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Failed to Load Content</h2>
          <p className="text-slate-600 mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 max-w-md">
          <div className="relative mb-6">
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full mx-auto animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Initializing CodeLearn</h2>
          <p className="text-slate-500 mb-4">Loading all tutorials for faster experience...</p>
          
          <div className="flex justify-center items-center space-x-4 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-green-500" />
              <span>Tutorials</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Examples</span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}