document.getElementById("likeButton").addEventListener("click", like);

function like() {
    let likedArtwork = {id:this.value};
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let curNum = parseInt(document.getElementById(likedArtwork.id).innerText);
            document.getElementById(likedArtwork.id).innerText = curNum+1;
        }
        if (this.readyState == 4 && this.status == 400) {
            alert(this.responseText);
        }
    }
    xhttp.open("PUT", "/like");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(likedArtwork));
}