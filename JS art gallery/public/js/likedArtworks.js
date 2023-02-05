if (document.getElementById("unlike") != null) {document.getElementById("unlike").addEventListener("click", unlike);}


function unlike() {
    let id = document.getElementById("unlike").parentNode.id;
    let unlikedArtwork = {id:id};
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            location.href = location.href;
        }
    }
    xhttp.open("PUT", "/unlike");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(unlikedArtwork));
}