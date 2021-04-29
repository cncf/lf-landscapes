import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ChakraProvider, ColorModeProvider, Divider, Heading, Link as ChakraLink, HStack } from '@chakra-ui/react'
import theme from '../theme'

const NavLink = ({ children, href }) => {
  const router = useRouter()
  if (router.asPath === href) {
    return null
  }

  return <ChakraLink as={Link} href={href}>{children}</ChakraLink>
}

function MyApp({ Component, pageProps }) {
  return <>
    <style jsx>{`
      header, main {
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
        <header>
          <HStack justify="space-between">
            <Heading size="xl">Linux Foundation Landscapes</Heading>
            <NavLink href="/">Details</NavLink>
            <NavLink href="/previews">Previews</NavLink>
          </HStack>
        </header>
        <Divider/>
        <main>
          <Component {...pageProps} />
        </main>
      </ColorModeProvider>
    </ChakraProvider>
  </>
}

export default MyApp
