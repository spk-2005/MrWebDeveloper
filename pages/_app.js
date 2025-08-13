// pages/_app.js
import '../styles/globals.css';
import { PostsProvider } from './components/PostContext';
import AppLoadingScreen from './components/AppLoadingScreen';

function MyApp({ Component, pageProps }) {
 
  return (
    <>
      <PostsProvider>
        <AppLoadingScreen>
          {/* Theme toggle should be available globally */}
          
          {/* Main app content */}
          <div className="min-h-screen transition-colors duration-300 bg-white text-gray-900 ">
            <Component {...pageProps} />
          </div>
        </AppLoadingScreen>
      </PostsProvider>
   </>);
}

export default MyApp;