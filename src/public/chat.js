const socket = io();
const input = document.getElementById("inputMessages");
const containerMessages = document.getElementById("messages");

let nombre;
Swal.fire({
    title: "Identifiquese",
    input: "text",
    text: "Ingrese su nickname",
    inputValidator: (value) => {
        return !value && "Debe ingresar un nombre";
    },
    allowOutsideClick: false,
}).then((result) => {
    nombre = result.value;
    document.title = nombre;

    socket.emit("id", nombre);
    socket.on("getMessagesStart", (messages) => {
        let htmlMessage = "";
        messages.forEach((object) => {
            htmlMessage += `<li>${object.emisor}: ${object.message}</li>`;
        });
        containerMessages.innerHTML = htmlMessage;
    });
});

socket.on("newUser", (nombre) => {
    Swal.fire({
        text: `${nombre} is connected`,
        toast: true,
        position: "top-right",
    });
});

socket.on("reloadMessages", (messages) => {
    containerMessages.innerHTML = "";
    let htmlCont = "";
    messages.forEach((object) => {
        htmlCont += `<li>${object.emisor}: ${object.message}</li>`;
    });
    console.log(messages);
    containerMessages.innerHTML = htmlCont;
});

socket.on("reloadMessagesForOthers", (messages) => {
    containerMessages.innerHTML = "";
    let htmlCont = "";
    messages.forEach((object) => {
        htmlCont += `<li>${object.emisor}: ${object.message}</li>`;
    });
    console.log(messages);
    containerMessages.innerHTML = htmlCont;
});

input.addEventListener("keydown", (event) => {
    let message = event.target.value.trim();
    let emisor = nombre;
    let model = { emisor, message };

    if (event.key === "Enter" && message !== "") {
        socket.emit("messageSend", model);
        event.target.value = "";
    }
});
