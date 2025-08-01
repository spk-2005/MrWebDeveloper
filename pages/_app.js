import '../styles/globals.css';
import { PostsProvider } from '../pages/components/PostContext';
import AppLoadingScreen from '@/pages/components/AppLoadingScreen';

function MyApp({ Component, pageProps }) {
  return (
    <PostsProvider>
      <AppLoadingScreen>
        <Component {...pageProps} />
      </AppLoadingScreen>
    </PostsProvider>
  );
}

// Add this to maintain Next.js compatibility
MyApp.getInitialProps = async (appContext) => {
  // Call page-level getInitialProps if it exists
  let appProps = {};
  
  if (appContext.Component.getInitialProps) {
    appProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { ...appProps };
};

export default MyApp;