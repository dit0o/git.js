async function formsubmit(event){
    try {
      event.preventDefault();
      var login= {
        Email:document.getElementById('floatingInput').value,
        Password:document.getElementById('floatingPassword').value
      }
      const response= await axios.post("http://3.25.109.206:4000/user/login",login)
      
        if(response.status===201){
         alert(response.data.message)
         localStorage.setItem('token',response.data.token)
         window.location.href="../chat app/chat app.html"
        }
        else{
          throw new Error(response.data.message)
        }
      
      
    } catch (error) {
        document.body.innerHTML+= `<div style="color:red;">${error}<div>`    
    }
   
  }
  function forgotpassword(){
    window.location.href ="../forgotpassword/forgotpass.html"
  }