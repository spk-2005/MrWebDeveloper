// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head >

                <meta name="google-adsense-account" content="ca-pub-4966899358935665"></meta>
              <meta name="google-site-verification" content="MoeiZ7kQur1i2YnchsT8JJCrNgmmGYqlvcIIXT_CCAE" />
      </Head>
      <body>
        {/* Theme initialization script to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('codelearn-theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  if (theme === 'dark' || (!theme && systemPrefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                    document.body.style.backgroundColor = '#111827';
                    document.body.style.color = '#ffffff';
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                    document.body.style.backgroundColor = '#ffffff';
                    document.body.style.color = '#111827';
                  }
                } catch (e) {
                  // Fallback to light theme if there's an error
                  document.documentElement.classList.add('light');
                  document.documentElement.style.colorScheme = 'light';
                  document.body.style.backgroundColor = '#ffffff';
                  document.body.style.color = '#111827';
                }
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}