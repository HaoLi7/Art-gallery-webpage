document.getElementById("filter").addEventListener("click",filter);

function filter() {
    let medium = document.getElementById("selectMedium").value;
    let category = document.getElementById("selectCategory").value;
    let filterObj = {};
    if (medium !== "All") {
        filterObj.medium = medium;
    }
    if (category !== "All") {
        filterObj.category = category
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            updateArtworks(this.response);
        }
    }
    xhttp.open("PUT", "/artworks");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(filterObj));
}

function updateArtworks(array) {
    let result = "";
    let objs = JSON.parse(array);
    if (objs.length == 0) {
        result += "<h3>No result</h3>"
    }else {
        for (let each of objs) {
            result += `<div><a href="/artworks/${each._id}">${each.name}</a><br>`
            result += `<a href=${each.image}><img src=${each.image} alt=Artwork: ${each.name} width="30%"></img></a></div><br>`;
        }
    }
    document.getElementById("artworks").innerHTML = result;
}