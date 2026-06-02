import './style.css'
import { proxy } from 'valtio/vanilla'
import * as yup from 'yup'
import initView from './view.js'

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
}

const state = proxy({
  form: {
    error: null,
    success: null,
    loading: false,
  },
  feeds: [],
})

// Инициализация View
initView(state, elements)

// Схема валидации
const makeUrlSchema = (feeds) => yup
  .string()
  .required('Не должно быть пустым')
  .url('Ссылка должна быть валидным URL')
  .notOneOf(
    feeds.map(feed => feed.url),
    'Этот RSS уже добавлен',
  )

// Контроллер
elements.form.addEventListener('submit', (e) => {
  e.preventDefault()

  const url = elements.input.value.trim()

  state.form.error = null
  state.form.success = null
  state.form.loading = true

  const schema = makeUrlSchema(state.feeds)

  schema.validate(url)
    .then((validUrl) => {
      state.feeds.push({ url: validUrl })

      state.form.success = 'RSS успешно добавлен'

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

console.log('RSS Aggregator ready')