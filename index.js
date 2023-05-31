const searchField = document.getElementById("search-field")
const searchBtn = document.getElementById("search-btn")
const main = document.getElementById("main")

let searchResults = []

// ⬇️ EVENT LISTENERS ⬇️

searchBtn.addEventListener("click", function() {
    submitSearch()
})

// ⬇️ EVENT HANDLERS ⬇️

function submitSearch() {
    console.log(searchField.value)    
    fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&s=${searchField.value}`)
        .then(res => res.json())
        .then(data => {
            searchResults = data.Search
            renderSearchResults()
        })
}

function getFilm(id) {
    console.log(id)    
    fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&i=${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            // searchResults = data.Search
            // renderSearchResults()
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

function renderSearchResults() {
    console.log(searchResults)
    getFilm(searchResults[0].imdbID)
}

renderEmptyFilms()