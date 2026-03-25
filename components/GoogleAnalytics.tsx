import Script from 'next/script';

const GoogleAnalytics = () => {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-TP9QMYD5SY"
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-TP9QMYD5SY');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;