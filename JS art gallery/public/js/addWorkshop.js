function submit() {
    let textBoxes = document.querySelectorAll('input[type="text"]');
    for (let each of textBoxes) {
        if (each.value === "") {
            alert("Please enter all fields");
            return;
        }
    }
    let topic = textBoxes[0].value;
    let date = textBoxes[1].value;
    let loc = textBoxes[2].value;
    let newObj = {topic:topic,date:date,location:loc};
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {
            alert(this.responseText);
            location.reload(); 
        }
    }
    xhttp.open("POST", "/workshops/add");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(newObj));
}