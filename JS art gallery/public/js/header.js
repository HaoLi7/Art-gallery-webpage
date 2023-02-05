document.getElementById("logout").addEventListener("click", logout);
document.getElementById("switch").addEventListener("click", switchType);

function logout() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            location.href = "/"; 
        }
    }
    xhttp.open("GET", "/logout");
    xhttp.send();
}

function switchType() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            if (this.responseText === "You have not added any artworks, please add one.") {
                location.href = "/artworks/add";
            }else {
                location.reload();
            }
        }
    }
    xhttp.open("PUT", "/switchType");
    xhttp.send();
}