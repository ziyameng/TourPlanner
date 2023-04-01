fetch("http://localhost:23843/user-locations")
.then(res => res.json())
.then(data =>{
    console.log(data);

    let table = document.getElementById("itineraryTable");
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    /*
    cell1.innerHTML = "hello";
    cell2.innerHTML = "hello";
    cell3.innerHTML = "hello";
    cell4.innerHTML = "hello";
    cell5.innerHTML = "<button>";*/

    
    data.forEach(activity => console.log(activity.activity, activity.coordinates));
    for (let i in data){
        console.log(data[i].activity);
        cell1.innerHTML = data[i].activity;
        cell2.innerHTML = data[i].name;
        cell3.innerHTML = data[i].description;
        cell4.innerHTML = "hello";
        cell5.innerHTML = "<button>Delete</button>";
    }
    
})

