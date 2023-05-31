const searchField = document.getElementById("search-field")
const searchBtn = document.getElementById("search-btn")

// ⬇️ EVENT LISTENERS ⬇️

searchBtn.addEventListener("click", submitSearch)

// ⬇️ EVENT HANDLERS ⬇️

function submitSearch() {
    console.log(searchField.value)    
    fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=8c98ceb6&t=${searchField.value}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
}

// http://www.omdbapi.com/?i=tt3896198&apikey=8c98ceb6