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

function getFilms() {
    console.log(searchField.value)    
    fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&s=${searchField.value}`)
        .then(res => res.json())
        .then(data => {
            let searchResults = data.Search
            searchResults.forEach(item => getFilmDetails(item.imdbID))
            // renderfilmsArray()
        })
}

function getFilmDetails(id) {
    console.log(id)    
    fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&i=${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            filmsArray += data
            // currentFilm = data
            // filmsArray = data.Search
            // renderfilmsArray()
        })
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

function renderfilmsArray() {
    console.log(filmsArray)
    // let currentFilm = getFilm(filmsArray[0].imdbID)
    // let currentFilm = filmsArray[0]

    // getFilm(filmsArray[0].imdbID)
    // console.log(currentFilm)

    main.innerHTML = `
        <div class="film">
            <img src="${currentFilm.Poster}">
            <h2>${currentFilm.Title}</h2>
            <p>${currentFilm.imdbRating}</p>
            <p>${currentFilm.Runtime}</p>
            <p>${currentFilm.Genre}</p>
            <p>${currentFilm.Plot}</p>
        </div>
    `
}

renderEmptyFilms()