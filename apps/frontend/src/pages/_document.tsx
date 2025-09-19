import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Balise de vérification Google Search Console */}
        <meta
          name="google-site-verification"
          content="BClj06C1NSHiXTWlvaOCC0jU-1ztv_HaxddZ_A2bRMQ"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
