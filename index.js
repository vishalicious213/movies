const searchSection = document.getElementById("search-section")
const searchField = document.getElementById("search-field")
const searchBtn = document.getElementById("search-btn")
const main = document.getElementById("main")
const toggle = document.getElementById("list-toggle")

let filmsArray = []
let watchlistArray = []
let localWatchlist = localStorage.getItem("watchlist")

// ⬇️ EVENT LISTENERS ⬇️

// listen for clicks on search button
searchBtn.addEventListener("click", function() {
    getFilms()
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
        const target = watchlistArray.find(item => item.imdbID === e.target.dataset.remove)
        const targetIndex = watchlistArray.indexOf(target)
        watchlistArray.splice(targetIndex, 1)
        localStorage.setItem("watchlist", JSON.stringify(watchlistArray))
        renderWatchlist()
    }
})

// ⬇️ EVENT HANDLERS ⬇️

async function getFilms() {
    const response = await fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&s=${searchField.value}`)
    const data = await response.json()

    if (data.Response === "False") {
        renderFilmNotFound()
    } else {
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

function getWatchlist() {
    if (localWatchlist) {
        // console.log(localWatchlist)
        watchlistArray = JSON.parse(localStorage.getItem("watchlist"))
        // console.log("from getWatchlist", watchlistArray)
    } else {
        console.log("no watchlist saved")
    }
}

// ⬇️ RENDER APP ⬇️

function renderEmptyFilms() {
    toggle.textContent = "My Watchlist"
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
    searchSection.classList.remove("hidden")
    main.innerHTML = `
        <div id="not-found">
            <p>Unable to find what you're looking for. Please try another search.</p>
        </div>
    `
}

function renderFilmsArray() {
    toggle.textContent = "My Watchlist"
    searchSection.classList.remove("hidden")
    let htmlString = ""
    main.innerHTML = ""

    filmsArray.forEach(item => {
        htmlString += `
            <div class="film">
                <div class="poster">
                    <img src="${item.Poster}">
                </div>
                <div class="film-details-container">
                    <div class="title-rating">
                        <h2>${item.Title} <span class="year">(${item.Year})</span></h2>
                        <p><span class="star">&#9733;</span> ${item.imdbRating}</p>
                    </div>
                    <div class="film-details">
                        <p class="runtime">${item.Runtime}</p>
                        <p class="genre">${item.Genre}</p>
                        <p class="watchlist-add" data-id="${item.imdbID}"><span class="plus">+</span> Watchlist</p>
                    </div>
                    <p class="plot">${item.Plot}</p>
                </div>
            </div>
        `
    })

    main.innerHTML = htmlString
}

function renderWatchlist() {
    toggle.textContent = "Search for movies"
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
            // let filmDetails = watchlistArray.find(item => item.imdbID === film)

            htmlString += `
            <div class="film">
                <div class="poster">
                    <img src="${film.Poster}">
                </div>
                <div class="film-details-container">
                    <div class="title-rating">
                        <h2>${film.Title} <span class="year">(${film.Year})</span></h2>
                        <p><span class="star">&#9733;</span> ${film.imdbRating}</p>
                    </div>
                    <div class="film-details">
                        <p class="runtime">${film.Runtime}</p>
                        <p class="genre">${film.Genre}</p>
                        <p class="watchlist-add" data-remove="${film.imdbID}"><span class="plus">-</span> Remove</p>
                    </div>
                    <p class="plot">${film.Plot}</p>
                </div>
            </div>
        `
        })

        main.innerHTML = htmlString
    }
}

renderEmptyFilms()