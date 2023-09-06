const logForm = document.getElementById("registerForm")


logForm.addEventListener('submit', event => {
    event.preventDefault()
    const logData = new FormData(logForm)
    const user = {}
    logData.forEach((value, key) => user[key] = (value))
    fetch('/sessions/register', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            alert('Nuevo usuario creado')
            window.location.replace('/home')       
        }else{
            alert("Usuario ya existe")
        }
    })
})

