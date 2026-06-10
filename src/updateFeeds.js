import _ from 'lodash'
import fetchFeed from './api.js'
import parseRss from './parser.js'
import generateId from './utils.js'

const updateFeeds = (state) => {
  const promises = state.feeds.map((feed) => {
    return fetchFeed(feed.url)
      .then(parseRss)
      .then(({ posts }) => {
        const currentPosts = state.posts.filter(
          post => post.feedId === feed.id,
        )

        const newPosts = _.differenceBy(
          posts,
          currentPosts,
          'link',
        )

        newPosts.forEach((post) => {
          state.posts.unshift({
            id: generateId(),
            feedId: feed.id,
            title: post.title,
            description: post.description,
            link: post.link,
          })
        })
      })
      .catch(() => {
      })
  })

  Promise.all(promises)
    .finally(() => {
      setTimeout(() => updateFeeds(state), 5000)
    })
}

export default updateFeeds