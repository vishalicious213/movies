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
    main.innerHTML = ""

    // filmsArray.forEach(item => {
    //     console.log(item)
    //     // main.innerHTML += `
    //     //     <div class="film">
    //     //         <img src="${item.Poster}">
    //     //         <h2>${item.Title}</h2>
    //     //         <p>${item.imdbRating}</p>
    //     //         <p>${item.Runtime}</p>
    //     //         <p>${item.Genre}</p>
    //     //         <p>${item.Plot}</p>
    //     //     </div>
    //     // `
    // })
}

renderEmptyFilms()