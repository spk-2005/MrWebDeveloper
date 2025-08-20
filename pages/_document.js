// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>







        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-1W96RC0DLJ`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-1W96RC0DLJ', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

         {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          data-ad-client="ca-pub-4966899358935665"
          crossOrigin="anonymous"
        ></script>
        <script async custom-element="amp-auto-ads"
        src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
</script>
      </Head>
      <body>
        <amp-auto-ads type="adsense"
        data-ad-client="ca-pub-4966899358935665">
</amp-auto-ads>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
