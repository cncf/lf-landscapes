import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.png" />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
