console.log("index tomado");

let userName;
let userRole;
let cartId;
let userId;
async function getCurrentUser() {
    const url = `http://localhost:8080/session/current`;
    const requestOptions = { method: "GET" };
    await fetch(url, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en lasolicitud");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            const { first_name, role, cart, _id } = data;
            userId = _id;
            userName = first_name;
            userRole = role;
            cartId = cart;
            const h1 = document.getElementById("h1");
            h1.innerText = `Bienvenid@ ${userName}`;
            const anchor = document.getElementById("anchor");
            anchor.href = `/carts/${cartId}`;
        })
        .catch((error) => {
            console.error(error);
        });
}
getCurrentUser();

setTimeout(() => {
    const formProfile = document.getElementById("formFileProfile");
    const formDoc = document.getElementById("formFileDoc");
    const formProducts = document.getElementById("formFileProducts");
    console.log(formProfile, formProducts, formDoc);
    formProfile.action = `/api/users/${userId}-profile/documents`;
    formDoc.action = `/api/users/${userId}-documents/documents`;
    formProducts.action = `/api/users/${userId}-products/documents`;
}, 3000);

const buttonProfile = document.getElementById("buttonProfile");
const buttonDoc1 = document.getElementById("buttonDoc1");
const buttonDoc2 = document.getElementById("buttonDoc2");
const buttonDoc3 = document.getElementById("buttonDoc3");
const buttonProducts = document.getElementById("buttonProducts");

const inputProfile = document.getElementById("profileFile");
const inputDoc1 = document.getElementById("indentification");
const inputDoc2 = document.getElementById("domicilio");
const inputDoc3 = document.getElementById("estadoCuenta");
const inputProducts = document.getElementById("productsFile");

async function sendFile(input, folder) {
    if (input.files.length > 0) {
        // Obtener el primer archivo seleccionado
        const archivo = input.files[0];

        // Crear un objeto FormData y agregar el archivo con un nombre específico
        const formData = new FormData();
        formData.append("myFile", archivo, archivo.name);

        // Realizar la solicitud fetch
        fetch(`http://localhost:8080/api/users/${userId}-${folder}/documents`, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Respuesta del servidor:", data);
                input.value = "";
                alert("file upload");
            })
            .catch((error) => {
                console.error("Error al enviar el archivo:", error);
            });
    } else {
        alert("Selecciona un archivo antes de enviar.");
    }
}

buttonProfile.addEventListener("click", () => {
    sendFile(inputProfile, "profile");
});
buttonDoc1.addEventListener("click", () => {
    sendFile(inputDoc1, "documents");
});
buttonDoc2.addEventListener("click", () => {
    sendFile(inputDoc2, "documents");
});
buttonDoc3.addEventListener("click", () => {
    sendFile(inputDoc3, "documents");
});
buttonProducts.addEventListener("click", () => {
    sendFile(inputProducts, "products");
});
