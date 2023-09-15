const socket = io();
let user = sessionStorage.getItem('chatUser') ? sessionStorage.getItem('chatUser') : "";
let chatBox = document.getElementById('chatBox');

if(user){
    socket.emit('isConnected', {user: user})
}else{
    Swal.fire({
        title: "Identificate",
        input: "text",
        text: "Ingresa el nombre con el que quieras que te identifiquen",
        inputValidator: (value)=>{
            return !value && '¡Por favor introduzca un nombre de usuario!'
        },
        allowOutsideClick: false
    }).then(result=>{
        user=result.value
        sessionStorage.setItem('chatUser', user)
        socket.emit('isConnected', {user: user})
    })
}

chatBox.addEventListener('keyup', evt=>{
    if(evt.key === "Enter"){
        if(chatBox.value.trim().length > 0){
            socket.emit("message", {user: user, message: chatBox.value})
            chatBox.value = "";
        }
    }
})

socket.on('messageLogs', data =>{
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(message => {
        messages = messages+`${message.user} dice: ${message.message}</br>`
    });
    log.innerHTML = messages;
})

socket.on('newUserConection', user =>{
    let USER_NAME = user.user.user;
    Swal.fire({
        title: `${USER_NAME} se ha conectado`,
        toast: true,
        position: 'top-right'
    })
})