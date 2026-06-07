import { subscribe } from 'valtio/vanilla'

export default (state, elements, i18n) => {
  const render = () => {
    const { error, success } = state.form

    if (error) {
      elements.input.classList.add('is-invalid')
      elements.input.classList.remove('is-valid')

      elements.feedback.textContent = i18n.t(error.key)

      elements.feedback.classList.remove('text-success')
      elements.feedback.classList.add('text-danger')

      return
    }

    if (success) {
      elements.input.classList.remove('is-invalid')
      elements.input.classList.add('is-valid')

      elements.feedback.textContent =
        i18n.t('success.feedAdded')

      elements.feedback.classList.remove('text-danger')
      elements.feedback.classList.add('text-success')

      return
    }

    elements.feedback.textContent = ''

    elements.input.classList.remove(
      'is-invalid',
      'is-valid',
    )

    elements.feedback.classList.remove(
      'text-danger',
      'text-success',
    )
  }

  render()

  subscribe(state, render)
}