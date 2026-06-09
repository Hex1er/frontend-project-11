import axios from 'axios'

const getProxyUrl = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get')
  proxyUrl.searchParams.set('disableCache', 'true')
  proxyUrl.searchParams.set('url', url)
  return proxyUrl.toString()
}

const fetchFeed = (url) => {
  return axios
    .get(getProxyUrl(url))
    .then(response => response.data.contents)
}

export default fetchFeed