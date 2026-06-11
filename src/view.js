import { subscribe } from 'valtio/vanilla'

export default (state, elements, i18n) => {

  const renderFeedback = () => {
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

      elements.feedback.textContent = i18n.t(success)

      elements.feedback.classList.remove('text-danger')
      elements.feedback.classList.add('text-success')

      return
    }

    elements.feedback.textContent = ''
    elements.input.classList.remove('is-invalid', 'is-valid')
    elements.feedback.classList.remove('text-danger', 'text-success')
  }

  const renderFeeds = () => {
    elements.feeds.innerHTML = ''

    if (state.feeds.length === 0) return

    const card = document.createElement('div')
    card.classList.add('card', 'border-0')

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    const title = document.createElement('h2')
    title.classList.add('card-title', 'h4')
    title.textContent = i18n.t('feeds')

    cardBody.append(title)

    const list = document.createElement('ul')
    list.classList.add('list-group', 'border-0', 'rounded-0')

    state.feeds.forEach((feed) => {
      const item = document.createElement('li')
      item.classList.add('list-group-item', 'border-0', 'border-end-0')

      const feedTitle = document.createElement('h3')
      feedTitle.classList.add('h6', 'm-0')
      feedTitle.textContent = feed.title

      const description = document.createElement('p')
      description.classList.add('m-0', 'text-black-50')
      description.textContent = feed.description

      item.append(feedTitle, description)
      list.append(item)
    })

    card.append(cardBody, list)
    elements.feeds.append(card)
  }

  const renderPosts = () => {
    elements.posts.innerHTML = ''

    if (state.posts.length === 0) return

    const card = document.createElement('div')
    card.classList.add('card', 'border-0')

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    const title = document.createElement('h2')
    title.classList.add('card-title', 'h4')
    title.textContent = i18n.t('posts')

    cardBody.append(title)

    const list = document.createElement('ul')
    list.classList.add('list-group', 'border-0', 'rounded-0')

    state.posts.forEach((post) => {
      const item = document.createElement('li')
      item.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0',
      )

      const link = document.createElement('a')
      link.href = post.link
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.textContent = post.title
      link.dataset.id = post.id

      const isRead = state.ui.viewedPosts.includes(post.id)
      link.classList.add(isRead ? 'fw-normal' : 'fw-bold')

      const button = document.createElement('button')
      button.type = 'button'
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm')

      button.textContent = i18n.t('modal.preview')

      button.dataset.id = post.id
      button.setAttribute('data-bs-toggle', 'modal')
      button.setAttribute('data-bs-target', '#postModal')

      item.append(link, button)
      list.append(item)
    })

    card.append(cardBody, list)
    elements.posts.append(card)
  }

  const renderModal = () => {
    const id = state.ui.modalPostId
    if (!id) return

    const post = state.posts.find((p) => p.id === id)
    if (!post) return
    elements.modalTitle.textContent = post.title
    elements.modalBody.textContent = post.description
    elements.modalLink.href = post.link
    elements.modalLink.textContent = i18n.t('modal.readFull')
  }

  const render = () => {
    renderFeedback()
    renderFeeds()
    renderPosts()
    renderModal()
  }

  render()

  subscribe(state, render)
}