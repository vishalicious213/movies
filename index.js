const searchField = document.getElementById("search-field")
const searchBtn = document.getElementById("search-btn")

// ⬇️ EVENT LISTENERS ⬇️

searchBtn.addEventListener("click", submitSearch)

// ⬇️ EVENT HANDLERS ⬇️

function submitSearch() {
    console.log(searchField.value)    
}