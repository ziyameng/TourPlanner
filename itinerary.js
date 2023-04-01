fetch("http://localhost:23843/user-locations")
.then(res => res.json())
.then(data =>{
    console.log(data);
})

