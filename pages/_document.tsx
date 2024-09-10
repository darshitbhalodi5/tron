import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Add any head elements here */}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Replace your synchronous script with this */}
          <Script
            src="/path/to/your/script.js"
            strategy="afterInteractive"
          />
        </body>
      </Html>
    )
  }
}

export default MyDocument