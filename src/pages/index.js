import { useState, useEffect } from 'react'
import fetchYaml from '../utils/fetchYaml'
import fetchFile from '../utils/fetchFile'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link as ChakraLink,
  Spinner
} from '@chakra-ui/react'

import { ExternalLinkIcon } from '@chakra-ui/icons'

const dateTimeFormat = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false })

const Link = ({ children, ...rest }) => {
  const textOnly = typeof children === 'string'

  return <ChakraLink isExternal {...rest}>
      {children} {textOnly && <ExternalLinkIcon mx="2px" />}
  </ChakraLink>
}

const StatusBadge = ({ deployUrl, statusUrl }) => {
  return <>
    <style jsx>{`
      img {
        max-width: none;
      }
    `}</style>

    { !statusUrl ? <Spinner speed="1s" /> : <Link href={deployUrl}>
      <img src={statusUrl} />
    </Link> }
  </>
}

export default function Home({ landscapes, ip }) {
  const [data, setData] = useState({})

  const setRepoData = (repo, repoData) => setData(data => ({ ...data, [repo]: { ...data[repo], ...repoData } }))

  useEffect(() => {
    landscapes.forEach(async landscape => {
      const readme = await fetchFile(`${landscape.repo}/HEAD/README.md`)
      const statusUrl = readme.match(/https:\/\/api.netlify.com\/api\/v1\/badges[^)]*/)[0]
      const deployUrl = readme.match(/https:\/\/app.netlify.com\/sites[^)]*/)[0]

      setRepoData(landscape.repo, { statusUrl, deployUrl })
    })

    landscapes.forEach(async landscape => {
      const landscapeIndex = await (await fetch(landscape.url)).text()
      const publishedAt = landscapeIndex.match(/Updated:\s*([^"]*)/)[1]

      setRepoData(landscape.repo, { publishedAt: publishedAt ? dateTimeFormat.format(new Date(publishedAt)) : 'UNKNOWN' })
    })

    landscapes.forEach(async landscape => {
      const { updated_at } = await fetchYaml(`${landscape.repo}/HEAD/processed_landscape.yml`)
      const updatedAt = updated_at ? dateTimeFormat.format(new Date(updated_at)) : 'UNKNOWN'

      setRepoData(landscape.repo, { updatedAt })
    })
  }, [])

  return <div>
    <style jsx>{`
      .logo {
        height: 30px;
      }
    `}</style>
    <Table >
      <Thead>
        <Tr>
          <Th>Organization</Th>
          <Th>Landscape</Th>
          <Th>Repo</Th>
          <Th>Status</Th>
          <Th>Published</Th>
          <Th>Data Refreshed</Th>
          <Th>Update Logs</Th>
        </Tr>
      </Thead>
      <Tbody>
        { landscapes.map(landscape => {
          const landscapeData = data[landscape.repo] || {}
          return <Tr key={landscape.name}>
            <Td>
              <Link href={landscape.company_url} isExternal>
                <img src={`${landscape.url}/images/right-logo.svg`} alt={landscape.name} className="logo"/>
              </Link>
            </Td>
            <Td><Link href={landscape.url}>{landscape.short_domain}</Link></Td>
            <Td><Link href={`https://github.com/${landscape.repo}`}>{landscape.repo}</Link></Td>
            <Td><StatusBadge statusUrl={landscapeData.statusUrl} deployUrl={landscapeData.deployUrl} /></Td>
            <Td>{landscapeData.publishedAt || <Spinner speed="1s" />}</Td>
            <Td>{landscapeData.updatedAt || <Spinner speed="1s" />}</Td>
            <Td><Link href={`http://${ip}/${landscape.key}.html`}>View Logs</Link></Td>
          </Tr>
        })}
      </Tbody>
    </Table>
  </div>
}

export async function getStaticProps() {
  const data = await fetchYaml('cncf/landscapeapp/HEAD/landscapes.yml')

  const landscapes = await Promise.all(data.landscapes.map(async ({ repo, name: key }) => {
    const  { global } = await fetchYaml(`${repo}/HEAD/settings.yml`)
    const { website: url, short_name: name, short_domain, company_url } = global

    return { name, repo, url, short_domain, company_url, key }

  }))

  return { props: { landscapes, ip: data.ip } }
}
