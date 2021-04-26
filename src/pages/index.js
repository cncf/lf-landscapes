import { useState, useEffect } from 'react'
import fetchYaml from '../utils/fetchYaml'
import fetchFile from '../utils/fetchFile'

const dateTimeFormat = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false })

const StatusBadge = ({ deployUrl, statusUrl }) => {
  if (!statusUrl) {
    return 'Loading...'
  }

  return <a href={deployUrl}>
    <img src={statusUrl} />
  </a>
}

export default function Home({ landscapes }) {
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

  return <main>
    <style jsx>{`
      a img {
        height: 30px;
      }
    `}</style>
    <table>
      <thead>
        <tr>
          <th>Organization</th>
          <th>Landscape</th>
          <th>Repo</th>
          <th>Status</th>
          <th>Published</th>
          <th>Data Refreshed</th>
        </tr>
      </thead>
      <tbody>
        { landscapes.map(landscape => {
          const landscapeData = data[landscape.repo] || {}
          return <tr key={landscape.name}>
            <td><a href={landscape.company_url}><img src={`${landscape.url}/images/right-logo.svg`} /></a></td>
            <td><a href={landscape.url}>{landscape.short_domain}</a></td>
            <td><a href={`https://github.com/${landscape.repo}`}>{landscape.repo}</a></td>
            <td><StatusBadge statusUrl={landscapeData.statusUrl} deployUrl={landscapeData.deployUrl} /></td>
            <td>{landscapeData.publishedAt || 'Loading...'}</td>
            <td>{landscapeData.updatedAt || 'Loading...'}</td>
          </tr>
        })}
      </tbody>
    </table>
  </main>
}

export async function getStaticProps() {
  const data = await fetchYaml('cncf/landscapeapp/HEAD/landscapes.yml')

  const landscapes = await Promise.all(data.landscapes.map(async ({ repo }) => {
    const  { global } = await fetchYaml(`${repo}/HEAD/settings.yml`)
    const { website: url, short_name: name, short_domain, company_url } = global

    return { name, repo, url, short_domain, company_url }

  }))

  return { props: { landscapes } }
}
