const logForm = document.getElementById("logForm")


logForm.addEventListener('submit', event => {
    event.preventDefault()
    const logData = new FormData(logForm)
    const user = {}
    logData.forEach((value, key) => user[key] = (value))
    fetch('/sessions/login', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/products');
        }else{
            alert("Credenciales Incorrectas")
        }
    })
})

