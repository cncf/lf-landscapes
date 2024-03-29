import Head from 'next/head'
import fetchYaml from '../utils/fetchYaml'
import { SimpleGrid, Link, VStack } from '@chakra-ui/react'

const PreviewPage = ({ landscapes }) => {
  return <SimpleGrid minChildWidth={450} gap={5}>
    <style jsx>{`
      .logo {
        height: 40px;
      }
    `}</style>
    <Head>
      <title>Previews | Linux Foundation Landscapes</title>
    </Head>
    { landscapes.map(landscape => {
      return <VStack key={landscape.url}>
        <Link href={landscape.company_url} isExternal>
          <img src={`${landscape.url}/images/right-logo.svg`} className="logo" alt={landscape.name}  />
        </Link>
        <Link href={landscape.url} isExternal>
          <img src={`${landscape.url}/images/landscape_preview.png`} alt={`${landscape.name} Landscape`} />
        </Link>
      </VStack>
    }) }
  </SimpleGrid>
}

export async function getStaticProps() {
  const data = await fetchYaml('cncf/landscapeapp/HEAD/landscapes.yml')

  const landscapes = await Promise.all(data.landscapes.map(async ({ repo, name: key }) => {
    const  { global } = await fetchYaml(`${repo}/HEAD/settings.yml`)
    const { website: url, company_url, short_name: name } = global

    return { url, company_url, name }
  }))

  return { props: { landscapes } }
}

export default PreviewPage
