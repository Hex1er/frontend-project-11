import { subscribe } from 'valtio/vanilla'

export default (state, elements) => {
  const render = () => {
    const { error, success } = state.form

    if (error) {
      elements.input.classList.add('is-invalid')
      elements.input.classList.remove('is-valid')

      elements.feedback.textContent = error
      elements.feedback.classList.remove('text-success')
      elements.feedback.classList.add('text-danger')

      return
    }

    if (success) {
      elements.input.classList.remove('is-invalid')
      elements.input.classList.add('is-valid')

      elements.feedback.textContent = success
      elements.feedback.classList.remove('text-danger')
      elements.feedback.classList.add('text-success')

      return
    }

    elements.input.classList.remove('is-invalid', 'is-valid')
    elements.feedback.textContent = ''
    elements.feedback.classList.remove('text-danger', 'text-success')
  }

  // первый рендер
  render()

  subscribe(state, render)
}