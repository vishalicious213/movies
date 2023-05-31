const searchField = document.getElementById("search-field")
const searchBtn = document.getElementById("search-btn")
const main = document.getElementById("main")

let filmsArray = []

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
            filmsArray = data.Search
            renderfilmsArray()
        })
}

function getFilm(id) {
    console.log(id)    
    fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&i=${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
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
    getFilm(filmsArray[0].imdbID)
}

renderEmptyFilms()