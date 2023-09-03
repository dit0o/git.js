 async function formsubmit(event){
  try {
    event.preventDefault();
    var user= {
      Name:document.getElementById('floatingName').value,
      Email:document.getElementById('floatingInput').value,
      PhoneNumber:document.getElementById('floatingTel').value,
      Password:document.getElementById('floatingPassword').value
    }
    const response= await axios.post("http://localhost:4000/user/signup", user)
    
      .then((response) => {
        console.log(response.data.message);
        alert(response.data.message);
        window.location.href ="./login.html"
    })
    
  } 
  catch (err) {
    console.log(err);
    document.body.innerHTML+=  err + `<button onclick="window.location.href = ./gg.html">Reload</button>`
  }
 
 
}