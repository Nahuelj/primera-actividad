const socket = io();

socket.on("update", (data) => {
    const container = document.getElementById("container");
    container.innerHTML = "";
    data.payload.forEach((product) => {
        const li = document.createElement("li");
        li.textContent = `${product._id} ${product.title}, Precio: $${product.price}`;
        container.appendChild(li);
    });
});

const productInput = document.getElementById("producto");
const priceInput = document.getElementById("price");
const codeInput = document.getElementById("code");
const buttonSubmit = document.getElementById("submit");
const container = document.querySelector("#container");

async function getProducts() {
    const url = `http://localhost:8080/api/products?limit=100`;
    const requestOptions = {
        method: "GET",
    };

    await fetch(url, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }
            return response.json();
        })
        .then((data) => {
            let content = "";
            data.payload.forEach((element) => {
                content += `<li>${element._id} ${element.title}, Precio: $${element.price}</li>`;
            });
            container.innerHTML = content;
        })
        .catch((error) => {
            console.error(error);
        });
}
getProducts();

function addProduct() {
    if (
        productInput.value !== "" &&
        priceInput.value !== "" &&
        codeInput.value !== ""
    ) {
        const dataProduct = {
            title: productInput.value,
            description: "product added from realtimeProducts",
            price: priceInput.value,
            code: codeInput.value,
            stock: 123,
            status: true,
            category: "unknown",
        };

        const url = "http://localhost:8080/api/products/";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataProduct),
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        alert("Todos los campos son requeridos");
    }
}

buttonSubmit.addEventListener("click", addProduct);

const idInput = document.getElementById("id");
const buttonDelete = document.getElementById("delete");

function deleteProduct() {
    let id = idInput.value;
    const url = `http://localhost:8080/api/products/${id}`;
    const requestOptions = {
        method: "DELETE",
    };

    fetch(url, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
}

buttonDelete.addEventListener("click", deleteProduct);
