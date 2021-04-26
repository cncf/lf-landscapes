const fetchFile = async path => await (await fetch(`https://raw.githubusercontent.com/${path}`)).text()

export default fetchFile
