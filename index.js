const searchSection = document.getElementById("search-section")
const searchField = document.getElementById("search-field")
const searchBtn = document.getElementById("search-btn")
const main = document.getElementById("main")
const toggle = document.getElementById("list-toggle")
const title = document.getElementById("header-title")
const more = document.getElementById("more")

let filmsArray = []
let watchlistArray = []
let localWatchlist = localStorage.getItem("watchlist")
let numOfPages = 0
let lastPage = 1
let searchTerm = ""

// ⬇️ EVENT LISTENERS ⬇️

// listen for clicks on search button
searchBtn.addEventListener("click", function() {
    getFilms()
})

// listen for enter key to be pressed
searchField.addEventListener("keypress", function(e) {
    if (searchField.value && e.key === "Enter") {
        getFilms()
    }
})

// listen for clicks on more button
more.addEventListener("click", getMoreFilms)

// listen for clicks on watchlist/search text in header
toggle.addEventListener("click", function() {
    if (toggle.textContent === "My Watchlist") {
        renderWatchlist()
    } else if (toggle.textContent === "Search for movies" && filmsArray.length === 0) {
        renderEmptyFilms()
    } else if (toggle.textContent === "Search for movies" && filmsArray.length > 0) {
        renderFilmsArray()
    }
})

// listen for clicks on a film's 'watchlist' or 'remove' button
main.addEventListener("click", function(e) {
    // add movie to watchlist
    if (e.target.dataset.id) {
        const target = watchlistArray.find(item => item.imdbID === e.target.dataset.id)
        if (target) {
            return
        } else {
            addToWatchlist(e.target.dataset.id)
        }
    }

    // remove movie from watchlist
    if (e.target.dataset.remove) {
        removeFromWatchlist(e.target.dataset.remove)
    }
})

// ⬇️ EVENT HANDLERS ⬇️

// get array of first page of search results
async function getFilms() {
    const response = await fetch(`https://www.omdbapi.com/?apikey=8c98ceb6&s=${searchField.value}`)
    const data = await response.json()
    numOfPages = Math.ceil(data.totalResults / 10) // tracks # of pages for additional films

    if (data.Response === "False") {
        renderFilmNotFound()
    } else {
        filmsArray = []
        const responseArray = data.Search
        await Promise.all(responseArray.map(item => getFilmDetails(item.imdbID)))
        searchTerm = searchField.value
        searchField.value = ""
        renderFilmsArray()
    }
}

// get individual film details
async function getFilmDetails(id) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=8c98ceb6&i=${id}`)
    const data = await response.json()

    filmsArray.push(data)
}

// add films from search results to watchlist
function addToWatchlist(id) {
    let filmToAdd = filmsArray.find(item => item.imdbID === id)
    watchlistArray.push(filmToAdd)
    localStorage.setItem("watchlist", JSON.stringify(watchlistArray))
    renderFilmsArray()
}

// remove films from watchlist
function removeFromWatchlist(movie) {
    const target = watchlistArray.find(item => item.imdbID === movie)
    const targetIndex = watchlistArray.indexOf(target)
    watchlistArray.splice(targetIndex, 1)
    localStorage.setItem("watchlist", JSON.stringify(watchlistArray))
    renderWatchlist()
}

// if watchlist is saved in localStorage, get it
function getWatchlist() {
    if (localWatchlist) {
        watchlistArray = JSON.parse(localStorage.getItem("watchlist"))
    } else {
        return
    }
}

// get arrays of additional pages of search results
async function getMoreFilms() {
    // track what page we're on and hide "more" button when end reached
    if (lastPage < numOfPages) {
        lastPage ++
        if (lastPage === numOfPages) {
            numOfPages = 1
            more.classList.add("hidden")
        }
    }

    const response = await fetch(`https://www.omdbapi.com/?apikey=8c98ceb6&s=${searchTerm}&page=${lastPage}`)
    const data = await response.json()

    const responseArray = data.Search
    await Promise.all(responseArray.map(item => getFilmDetails(item.imdbID)))
    renderFilmsArray()
}

// ⬇️ RENDER APP ⬇️

function renderEmptyFilms() {
    toggle.textContent = "My Watchlist"
    title.textContent = "Watch This!"
    searchSection.classList.remove("hidden")
    main.classList.add("main-center")
    main.innerHTML = `
        <div id="filler">
            <img src="./img/reel.png" alt="">
            <p>Start exploring</p>
        </div>
    `
}

function renderFilmNotFound() {
    toggle.textContent = "My Watchlist"
    title.textContent = "Watch This!"
    searchSection.classList.remove("hidden")
    main.classList.add("main-center")
    main.innerHTML = `
        <div id="not-found">
            <p>Unable to find what you're looking for. Please try another search.</p>
        </div>
    `
}

function renderFilmsArray() {
    toggle.textContent = "My Watchlist"
    title.textContent = "Watch This!"
    searchSection.classList.remove("hidden")
    main.classList.remove("main-center")
    let htmlString = ""
    main.innerHTML = ""
    
    filmsArray.forEach(item => {
        let inWatchlist = false
        let watchButton = ""
        let filmToFind = watchlistArray.find(watchlistFilm => item.imdbID === watchlistFilm.imdbID)
        let image = ""

        if (filmToFind) {
            inWatchlist = true
            watchButton = `<p class="watchlist-add in-watchlist" data-id="${item.imdbID}"><span class="symbol hashtag">#</span> In watchlist</p>`
        } else {
            watchButton = `<p class="watchlist-add" data-id="${item.imdbID}"><span class="symbol plus">+</span> Add to watchlist</p>`
        }

        if (item.Poster === "N/A") {
            image = "./img/no-image.jpg"
        } else {
            image = item.Poster
        }

        htmlString += `
            <div class="film-container">
                <div class="poster">
                    <img src="${image}" alt="${item.Title}">
                </div>
                <div class="film-details-container">
                    <div class="film-title">
                        <h2>${item.Title}</h2>
                    </div>
                    <div class="film-details">
                        <p class="runtime">${item.Runtime}</p>
                        <p class="rating"><span class="star">&#9733;</span> ${item.imdbRating}</p>
                        <p class="year">${item.Year}</p>
                    </div>
                    <p class="genre">${item.Genre}</p>
                    <p class="plot">${item.Plot}</p>
                    ${watchButton}
                </div>
            </div>
        `
    })

    main.innerHTML = htmlString

    if (numOfPages > 1) {
        more.classList.remove("hidden")
    } else {
        more.classList.add("hidden")
    }
}

function renderWatchlist() {
    toggle.textContent = "Search for movies"
    title.textContent = "Your watchlist"
    searchSection.classList.add("hidden")
    main.classList.remove("main-center")
    more.classList.add("hidden")
    main.innerHTML = ""

    getWatchlist()

    if (watchlistArray.length === 0) {
        main.innerHTML = `
            <section class="empty-watchlist">
                <div id="empty-msg">Your watchlist is looking a little empty...</div>
                <div id="empty-add"><span id="add-msg">+</span> Let's add some movies!</div>            
            </section>
        `
        document.getElementById("empty-add").addEventListener("click", renderFilmsArray)
    } else {
        let htmlString = ""

        watchlistArray.forEach(film => {
            htmlString += `
            <div class="film-container">
                <div class="poster">
                    <img src="${film.Poster}" alt="${film.Title}">
                </div>
                <div class="film-details-container">
                    <div class="film-title">
                        <h2>${film.Title}</h2>
                    </div>
                    <div class="film-details">
                        <p class="runtime">${film.Runtime}</p>
                        <p class="rating"><span class="star">&#9733;</span> ${film.imdbRating}</p>
                        <p class="year">${film.Year}</p>
                    </div>
                    <p class="genre">${film.Genre}</p>
                    <p class="plot">${film.Plot}</p>
                    <p class="watchlist-add remove" data-remove="${film.imdbID}"><span class="symbol minus">-</span> Remove from watchlist</p>
                </div>
            </div>
        `
        })

        main.innerHTML = htmlString
    }
}

getWatchlist()
renderEmptyFilms()