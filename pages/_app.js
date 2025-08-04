// pages/_app.js
import '../styles/globals.css';
import { PostsProvider } from './components/PostContext';
import AppLoadingScreen from './components/AppLoadingScreen';
import { useEffect } from 'react';
function MyApp({ Component, pageProps }) {
  // Apply initial theme-related styles to prevent flash
  useEffect(() => {
    // Ensure the HTML element has the proper classes for Tailwind
    const html = document.documentElement;
    
    // Add transition classes for smooth theme switching
    html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Cleanup function
    return () => {
      html.style.transition = '';
    };
  }, []);

  return (
    <>
      <PostsProvider>
        <AppLoadingScreen>
          {/* Theme toggle should be available globally */}
          
          {/* Main app content */}
          <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <Component {...pageProps} />
          </div>
        </AppLoadingScreen>
      </PostsProvider>
   </>);
}

export default MyApp;