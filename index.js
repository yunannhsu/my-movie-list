(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const dataPanel = document.getElementById('data-panel')

  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const modeSelector = document.getElementById('mode-selector')

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let currentPage = 1
  let paginationData = []
  let displayMode = "mode_Card"


  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    getTotalPages(data)
    getPageData(currentPage, data, displayMode)
  }).catch((err) => console.log(err))


  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    let results = data.filter(
      movie => movie.title.toLowerCase().includes(input)
    )
    console.log(results)
    getTotalPages(results)
    display_Card(results)
  })

  modeSelector.addEventListener('click', (event) => {
    if (event.target.matches('#mode-list')) {
      displayMode = 'mode_Bar'
      getPageData(currentPage, data, displayMode)
    }
    else if (event.target.matches('#mode-card')) {
      displayMode = 'mode_Card'
      getPageData(currentPage, data, displayMode)
    }
  })

  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      console.log(event.target.dataset.id)
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      if (displayMode === "mode_Bar") {
        getPageData(event.target.dataset.page, data, displayMode)
      }
      else if (displayMode === "mode_Card") {
        getPageData(event.target.dataset.page, data, displayMode)
      }
    }
  })


  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
       <li class="page-item">
       <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
       </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data, displayMode) {
    currentPage = pageNum || currentPage
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    if (displayMode === 'mode_Bar') {
      display_Bar(pageData)
    }
    else if (displayMode === 'mode_Card') {
      display_Card(pageData)
    }
  }

  function display_Bar(data) {
    let htmlContent = ''
    data.forEach(item => {
      htmlContent += `
          <div class="col-6 barItem">${item.title}</div>
            <div class="col-6 text-right mb-2">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>`
    })
    dataPanel.innerHTML = htmlContent
  }

  function display_Card(data) {
    let htmlContent = ''
    data.forEach(item => {
      htmlContent += `
         <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
     `
    })
    dataPanel.innerHTML = htmlContent
  }
  function showMovie(id) {
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    const url = INDEX_URL + `/${id}`
    console.log(url)

    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      modalTitle.innerHTML = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.innerText = `release at: ${data.release_date}`
      modalDescription.innerText = `${data.description}`
    })


  }
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }




})()