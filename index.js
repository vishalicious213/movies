const searchSection = document.getElementById("search-section")
const searchField = document.getElementById("search-field")
const searchBtn = document.getElementById("search-btn")
const main = document.getElementById("main")
const toggle = document.getElementById("list-toggle")

let filmsArray = []
let watchlistArray = []

// ⬇️ EVENT LISTENERS ⬇️

// listen for clicks on search button
searchBtn.addEventListener("click", function() {
    getFilms()
})

// listen for clicks on watchlist/search text in header
toggle.addEventListener("click", function() {
    if (toggle.textContent === "My Watchlist") {
        console.log("go to watchlist")
        renderWatchlist()
    } else if (toggle.textContent === "Search for movies" && filmsArray.length === 0) {
        console.log("go to empty films")
        renderEmptyFilms()
    } else if (toggle.textContent === "Search for movies" && filmsArray.length > 0) {
        console.log("go to film search")
        renderFilmsArray()
    }
})

// listen for clicks on a film's 'add to watchlist' button
main.addEventListener("click", function(e) {
    // if (e.target === )
})

// ⬇️ EVENT HANDLERS ⬇️

async function getFilms() {
    const response = await fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&s=${searchField.value}`)
    const data = await response.json()

    if (data.Response === "False") {
        console.log(data)
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
                        <p class="watchlist" data-id="${item.imdbID}"><span class="plus">+</span> Watchlist</p>
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

    if (watchlistArray.length === 0) {
        main.innerHTML = `
            <section class="empty-watchlist">
                <div>Your watchlist is looking a little empty...</div>
                <div><span>+</span> Let's add some movies!</div>            
            </section>
        `        
    } else {
        main.innerHTML = `
            <div>WATCHLIST</div>
        `
    }

}

renderEmptyFilms()