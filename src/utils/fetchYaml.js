import yaml from 'js-yaml'
import fetchFile from './fetchFile'

const fetchYaml = async path => yaml.load(await fetchFile(path))

export default fetchYaml
