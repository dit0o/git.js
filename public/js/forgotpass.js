function forgotpassword(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    const userDetailss = {
        Email: form.get("email"),

    }
    
    axios.post('http://localhost:3000/password/forgotpassword',userDetailss).then(response => {
        if(response.status === 202){
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}