import './style.css'
import { proxy } from 'valtio/vanilla'
import * as yup from 'yup'
import i18next from 'i18next'

import initView from './view.js'
import resources from './locales/index.js'
import fetchFeed from './api.js'
import parseRss from './parser.js'
import generateId from './utils.js'
import updateFeeds from './updateFeeds.js'

const i18n = i18next.createInstance()

await i18n.init({
  lng: 'ru',
  debug: false,
  resources,
})

yup.setLocale({
  mixed: {
    required: () => ({ key: 'errors.required' }),
    notOneOf: () => ({ key: 'errors.duplicate' }),
  },
  string: {
    url: () => ({ key: 'errors.invalidUrl' }),
  },
})

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),

  // modal
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body p'),
  modalLink: document.querySelector('.full-article'),
}

const state = proxy({
  form: {
    error: null,
    success: null,
    loading: false,
  },

  feeds: [],
  posts: [],

  ui: {
    viewedPosts: [],
    modalPostId: null,
  },
})

initView(state, elements, i18n)
updateFeeds(state)

const makeUrlSchema = (feeds) =>
  yup
    .string()
    .required()
    .url()
    .notOneOf(feeds.map((feed) => feed.url))

elements.posts.addEventListener('click', (e) => {
  const { id } = e.target.dataset
  if (!id) return

  if (!state.ui.viewedPosts.includes(id)) {
    state.ui.viewedPosts.push(id)
  }

  state.ui.modalPostId = id
})

elements.form.addEventListener('submit', (e) => {
  e.preventDefault()

  const url = elements.input.value.trim()

  state.form.error = null
  state.form.success = null
  state.form.loading = true

  const schema = makeUrlSchema(state.feeds)

  schema.validate(url)
    .then((validUrl) => fetchFeed(validUrl))
    .then((xml) => parseRss(xml))
    .then(({ feed, posts }) => {
      const feedId = generateId()

      state.feeds.push({
        id: feedId,
        url,
        title: feed.title,
        description: feed.description,
      })

      const newPosts = posts.map((post) => ({
        id: generateId(),
        feedId,
        title: post.title,
        link: post.link,
        description: post.description,
      }))

      state.posts.push(...newPosts)

      state.form.success = 'success.feedAdded'

      elements.input.value = ''
      elements.input.focus()
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        state.form.error = err.message
      } else if (err.message === 'parsing') {
        state.form.error = { key: 'errors.parsing' }
      } else {
        state.form.error = { key: 'errors.network' }
      }
    })
    .finally(() => {
      state.form.loading = false
    })
})

console.log('RSS Aggregator ready')