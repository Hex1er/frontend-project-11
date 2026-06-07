import './style.css'
import { proxy } from 'valtio/vanilla'
import * as yup from 'yup'
import i18next from 'i18next'

import initView from './view.js'
import resources from './locales/index.js'

const i18n = i18next.createInstance()

await i18n.init({
  lng: 'ru',
  debug: false,
  resources,
})

yup.setLocale({
  mixed: {
    required: () => ({
      key: 'errors.required',
    }),

    notOneOf: () => ({
      key: 'errors.duplicate',
    }),
  },

  string: {
    url: () => ({
      key: 'errors.invalidUrl',
    }),
  },
})

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
}

const state = proxy({
  form: {
    error: null,
    success: false,
    loading: false,
  },

  feeds: [],
})

initView(state, elements, i18n)

const makeUrlSchema = (feeds) => yup
  .string()
  .required()
  .url()
  .notOneOf(
    feeds.map(feed => feed.url),
  )

elements.form.addEventListener('submit', (e) => {
  e.preventDefault()

  const url = elements.input.value.trim()

  state.form.error = null
  state.form.success = false
  state.form.loading = true

  const schema = makeUrlSchema(state.feeds)

  schema.validate(url)
    .then((validUrl) => {
      state.feeds.push({ url: validUrl })

      state.form.success = true

      elements.input.value = ''
      elements.input.focus()
    })
    .catch((err) => {
      state.form.error = err.message
    })
    .finally(() => {
      state.form.loading = false
    })
})