import Head from 'next/head'
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.png" />
    </Head>
    <ChakraProvider resetCSS>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  </>
}

export default MyApp
