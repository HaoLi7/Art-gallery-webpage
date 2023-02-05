function submit() {
    let textBoxes = document.querySelectorAll('input[type="text"]');
    for (let each of textBoxes) {
        if (each.value === "") {
            alert("Please enter all fields");
            return;
        }
    }
    let name = textBoxes[0].value;
    let artist = textBoxes[1].value;
    let year = textBoxes[2].value;
    let category = textBoxes[3].value;
    let medium = textBoxes[4].value;
    let description = textBoxes[5].value;
    let image = textBoxes[6].value;
    let newObj = {name:name,artist:artist,year:year,category:category,medium:medium,description:description,image:image}
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {
            alert(this.responseText);
            location.reload(); 
        }
        if (this.readyState == 4 && this.status == 400) {
            alert(this.responseText);
        }
    }
    xhttp.open("POST", "/artworks/add");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(newObj));
}