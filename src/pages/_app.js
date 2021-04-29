import Head from 'next/head'
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import theme from '../theme'

function MyApp({ Component, pageProps }) {
  return <>
    <style jsx>{`
      main {
        padding: 20px;
      }
    `}</style>
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.png" />
    </Head>
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <main>
          <Component {...pageProps} />
        </main>
      </ColorModeProvider>
    </ChakraProvider>
  </>
}

export default MyApp
