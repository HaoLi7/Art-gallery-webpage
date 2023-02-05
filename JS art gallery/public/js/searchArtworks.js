let seachResult = [];
const PAGE_LIMIT = 10;
let pageNum = 0;
let curPage = 1;

document.getElementById("search").addEventListener("click", search);

function search() {
    let artworkName = document.getElementById("name").value;
    let artistName = document.getElementById("artistName").value;
    let category = document.getElementById("category").value;
    if (artworkName === "" && artistName === "" && category === "") {
        alert("You must specify at least one option");
    }else {
        let query = {};
        if (artworkName !== "") {query.name = artworkName;}
        if (artistName !== "") {query.artist = artistName;}
        if (category !== "") {query.category = category;}
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // update the current page use search results
                showResults(JSON.parse(this.response));
            }
        }
        xhttp.open("PUT", "/artworks/search");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(query));
    }
}

function showResults(array) {
    seachResult = array;
    pageNum = (seachResult.length/PAGE_LIMIT) + 1;
    let result = "";
    result += `<br><h3>Search results:</h3><p>${seachResult.length} results in total</p>`
    for (let i = (curPage-1)*PAGE_LIMIT; i < curPage*PAGE_LIMIT && i < seachResult.length; i++) {
        result += `<div><a href="/artworks/${seachResult[i]._id}">${seachResult[i].name}</a><br>`
        result += `<a href=${seachResult[i].image}><img src=${seachResult[i].image} alt="Artwork: ${seachResult[i].name}" width="30%"></img></a></div><br>`
    }
    document.getElementById("results").innerHTML = result;
    result = '<input type="button" id="previous" value="Previous page" onclick="previous()">'
    result += '<input type="button" id="next" value="Next page" onclick="next()">'
    document.getElementById("pageButton").innerHTML = result;
}

function next() {
    let result = "";
    if (curPage + 1 < pageNum) {
        curPage++;
        for (let i = (curPage-1)*PAGE_LIMIT; i < curPage*PAGE_LIMIT && i < seachResult.length; i++) {
            result += `<div><a href="/artworks/${seachResult[i]._id}">${seachResult[i].name}</a><br>`
            result += `<a href=${seachResult[i].image}><img src=${seachResult[i].image} alt="Artwork: ${seachResult[i].name}" width="30%"></img></a></div><br>`
        }
        document.getElementById("results").innerHTML = result;
    }else {
        alert("This is the last page");
    }
}

function previous() {
    let result = "";
    if (curPage - 1 >= 1) {
        curPage--;
        for (let i = (curPage-1)*PAGE_LIMIT; i < curPage*PAGE_LIMIT && i < seachResult.length; i++) {
            result += `<div><a href="/artworks/${seachResult[i]._id}">${seachResult[i].name}</a><br>`
            result += `<a href=${seachResult[i].image}><img src=${seachResult[i].image} alt="Artwork: ${seachResult[i].name}" width="30%"></img></a></div><br>`
        }
        document.getElementById("results").innerHTML = result;
    }else {
        alert("This is the first page");
    }
}