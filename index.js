const searchField = document.getElementById("search-field")
const searchBtn = document.getElementById("search-btn")
const main = document.getElementById("main")

let filmsArray = []
let currentFilm = {}
let filmsHtml = "test"

// ⬇️ EVENT LISTENERS ⬇️

searchBtn.addEventListener("click", function() {
    getFilms()
})

// ⬇️ EVENT HANDLERS ⬇️

async function getFilms() {
    const response = await fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&s=${searchField.value}`)
    const data = await response.json()
    // console.log(data)
    // console.log(typeof data.Search)
    // console.log(data.Search[0])
    const responseArray = data.Search
    // console.log(responseArray[1])

    // console.log("responseArray", typeof responseArray)

    // responseArray.forEach(item => getFilmDetails(item.imdbID))
    await Promise.all(responseArray.map(item => getFilmDetails(item.imdbID)))
    // console.log(responseArray)
    // console.log(filmsArray)
    renderfilmsArray()
    console.log(filmsHtml)
}

async function getFilmDetails(id) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=8c98ceb6&i=${id}`)
    const data = await response.json()

    // console.log("film details", typeof data)
    // console.log("film data details", data)
    // console.log(data.Title)
    filmsArray.push(data)
    buildHTML(data)

    // console.log("filmsArray type", typeof filmsArray)
    // console.log(filmsArray)

    // console.log(filmsArray)
}

function buildHTML(data) {
    filmsHtml += `<div>${data.Title}</div>`
    console.log(filmsHtml)
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
    console.log(filmsArray[0])
    console.log(filmsArray[9])
    console.log(filmsHtml)
    main.innerHTML = ""
    // let currentFilm = getFilm(filmsArray[0].imdbID)
    // let currentFilm = filmsArray[0]

    // getFilm(filmsArray[0].imdbID)
    // console.log(currentFilm)
    console.log("TEST1")

    console.log(typeof filmsArray)

    // let copy = filmsArray
    // console.log(JSON.stringify(copy[0]))
    
    // console.log(typeof filmsArray[0])
    // console.log(Object.values(filmsArray))
    // console.log(filmsArray)

    // filmsArray.forEach(item => console.log("test"))

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

    console.log("TEST2")

}

renderEmptyFilms()