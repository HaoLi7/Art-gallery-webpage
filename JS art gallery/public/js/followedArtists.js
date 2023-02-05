for (each of document.getElementsByClassName("unfollow")) {
    each.addEventListener("click", unfollow);
}

function unfollow() {
    let unfollowArtist = {id:this.id};
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            location.href = location.href; 
        }
    }
    xhttp.open("PUT", "/artists/unfollow");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(unfollowArtist));
}