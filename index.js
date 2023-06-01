const searchField = document.getElementById("search-field")
const searchBtn = document.getElementById("search-btn")
const main = document.getElementById("main")

let filmsArray = []
let currentFilm = {}

// ⬇️ EVENT LISTENERS ⬇️

searchBtn.addEventListener("click", function() {
    getFilms()
})

// ⬇️ EVENT HANDLERS ⬇️

async function getFilms() {
    const response = await fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&s=${searchField.value}`)
    const data = await response.json()
    const responseArray = data.Search

    await Promise.all(responseArray.map(item => getFilmDetails(item.imdbID)))
    renderFilmsArray()
}

async function getFilmDetails(id) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&i=${id}`)
    const data = await response.json()

    filmsArray.push(data)
}

// ⬇️ RENDER APP ⬇️

function renderEmptyFilms() {
    main.innerHTML = `
        <div id="filler">
            <img src="./img/reel.png" alt="">
            <p>Start exploring</p>
        </div>
    `
}

function renderFilmsArray() {
    console.log(filmsArray)
    let htmlString = ""
    main.innerHTML = ""

    filmsArray.forEach(item => {
        console.log(item)
        htmlString += `
            <div class="film">
                <div class="poster">
                    <img src="${item.Poster}">
                </div>
                <div class="film-details-container">
                    <h2>${item.Title}</h2>
                    <div class="film-details">
                        <p>${item.imdbRating}</p>
                        <p>${item.Runtime}</p>
                        <p>${item.Genre}</p>
                    </div>
                    <p>${item.Plot}</p>
                </div>
            </div>
        `
    })

    main.innerHTML = htmlString
}

renderEmptyFilms()