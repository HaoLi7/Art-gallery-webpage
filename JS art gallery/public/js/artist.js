if (document.getElementById("enrollWorkshop") !== null){
    document.getElementById("enrollWorkshop").addEventListener("click",enroll);
}
document.getElementById("follow").addEventListener("click",follow);

function enroll() {
    alert("Enroll successfully!")
}

function follow() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {
            alert(this.responseText);
        }
    }
    xhttp.open("POST", location.pathname+"/follow");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}