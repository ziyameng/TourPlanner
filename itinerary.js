// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation number: 220033540, OTHER MATRICULATION NUMBERS
// Creating a itinerary page

fetch("http://localhost:23843/user-locations")
.then(res => res.json())
.then(data =>{
    console.log(data);

    let table = document.getElementById("itineraryTable");
     
    for (let i in data){
        let row = table.insertRow();
        row.id = data[i].id;
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);

        cell1.innerHTML = data[i].activity;
        cell2.innerHTML = data[i].name;
        cell3.innerHTML = data[i].description;
        cell4.innerHTML = data[i].date;
        cell5.innerHTML = `<button class = "deleteBtn" id = ${data[i].id} onclick="deleteActivity('${data[i].id}')">Delete</button>`;
        console.log(data[i].activity);
    }
    
})

function deleteActivity(a){
    let row = document.getElementById(a);
    console.log("delete", a);
    
    row.remove();
}

