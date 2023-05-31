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
    fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=8c98ceb6&s=${searchField.value}`)
        .then(res => res.json())
        .then(data => {
            searchResults = data.Search
            renderSearchResults()
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
}

renderEmptyFilms()