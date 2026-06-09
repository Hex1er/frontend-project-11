const parseRss = (xmlString) => {
  const parser = new DOMParser()

  const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

  const errorNode = xmlDoc.querySelector('parsererror')

  if (errorNode) {
    throw new Error('parsing')
  }

  const channel = xmlDoc.querySelector('channel')

  const feed = {
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
  }

  const posts = [...xmlDoc.querySelectorAll('item')]
    .map((item) => ({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    }))

  return {
    feed,
    posts,
  }
}

export default parseRss