const searchSection = document.getElementById("search-section")
const searchField = document.getElementById("search-field")
const searchBtn = document.getElementById("search-btn")
const main = document.getElementById("main")
const toggle = document.getElementById("list-toggle")
const title = document.getElementById("header-title")

let filmsArray = []
let watchlistArray = []
let localWatchlist = localStorage.getItem("watchlist")

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
        if (watchlistArray.includes(e.target.dataset.id)) {
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

async function getFilms() {
    const response = await fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&s=${searchField.value}`)
    const data = await response.json()

    if (data.Response === "False") {
        renderFilmNotFound()
    } else {
        filmsArray = []
        const responseArray = data.Search
        await Promise.all(responseArray.map(item => getFilmDetails(item.imdbID)))
        searchField.value = ""
        renderFilmsArray()
    }
}

async function getFilmDetails(id) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&i=${id}`)
    const data = await response.json()

    filmsArray.push(data)
}

function addToWatchlist(id) {
    let filmToAdd = filmsArray.find(item => item.imdbID === id)
    watchlistArray.push(filmToAdd)
    localStorage.setItem("watchlist", JSON.stringify(watchlistArray))
}

function removeFromWatchlist(movie) {
    const target = watchlistArray.find(item => item.imdbID === movie)
    const targetIndex = watchlistArray.indexOf(target)
    watchlistArray.splice(targetIndex, 1)
    localStorage.setItem("watchlist", JSON.stringify(watchlistArray))
    renderWatchlist()
}

function getWatchlist() {
    if (localWatchlist) {
        watchlistArray = JSON.parse(localStorage.getItem("watchlist"))
    } else {
        return
    }
}

// ⬇️ RENDER APP ⬇️

function renderEmptyFilms() {
    toggle.textContent = "My Watchlist"
    title.textContent = "Find your film"
    searchSection.classList.remove("hidden")
    main.innerHTML = `
        <div id="filler">
            <img src="./img/reel.png" alt="">
            <p>Start exploring</p>
        </div>
    `
}

function renderFilmNotFound() {
    toggle.textContent = "My Watchlist"
    title.textContent = "Find your film"
    searchSection.classList.remove("hidden")
    main.innerHTML = `
        <div id="not-found">
            <p>Unable to find what you're looking for. Please try another search.</p>
        </div>
    `
}

function renderFilmsArray() {
    toggle.textContent = "My Watchlist"
    title.textContent = "Find your film"
    searchSection.classList.remove("hidden")
    let htmlString = ""
    main.innerHTML = ""

    filmsArray.forEach(item => {
        htmlString += `
            <div class="film-container">
                <div class="poster">
                    <img src="${item.Poster}">
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
                    <p class="watchlist-add" data-id="${item.imdbID}"><span class="plus">-</span> Add to watchlist</p>
                </div>
            </div>
        `
    })

    main.innerHTML = htmlString
}

function renderWatchlist() {
    toggle.textContent = "Search for movies"
    title.textContent = "Your watchlist"
    searchSection.classList.add("hidden")
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
                    <img src="${film.Poster}">
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
                    <p class="watchlist-add remove" data-remove="${film.imdbID}"><span class="plus remove">-</span> Remove from watchlist</p>
                </div>
            </div>
        `
        })

        main.innerHTML = htmlString
    }
}

renderEmptyFilms()