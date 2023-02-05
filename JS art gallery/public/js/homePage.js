document.getElementById("login").addEventListener("click", login);
document.getElementById("signup").addEventListener("click", signup);

function login() {
    let username = document.getElementById("userName").value;
    let password = document.getElementById("password").value;
    if (username ==="" || password === "") {
        alert("Please enter your username and password");
    }else {
        let userinfo = {username:username, password:password};
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 201) {
                alert(this.responseText);
                location.href = "/";
            }else if (this.readyState == 4 && this.status == 401) {
                alert(this.responseText);
            }
        }
        xhttp.open("POST", "/login");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(userinfo));
    }
}

function signup() {
    let username = document.getElementById("userName").value;
    let password = document.getElementById("password").value;
    if (username ==="" || password === "") {
        alert("Please enter your username and password");
    }else {
        let userinfo = {username:username, password:password};
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 201) {
                alert(this.responseText);
                location.reload();
            }else if (this.readyState == 4 && this.status == 401) {
                alert(this.responseText);
            }
        }
        xhttp.open("POST", "/signup");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(userinfo));
    }
}