const container = document.querySelector("#container");
const back = document.querySelector("#back");
const following = document.querySelector("#following");
const page = document.querySelector("#page");
let cart = document.querySelectorAll(".item");
const checkbox = document.querySelector("#userPremium");
const containerDiv = document.getElementById("containerPremium");

//current user
let currentUser;
let userName;
let userRole;
let cartId;
let emailUser;
let idUser;

async function getCurrentUser() {
    const url = `http://localhost:8080/session/current`;
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
            console.log(data);
            const { first_name, role, cart, email, _id } = data;
            currentUser = data;
            userName = first_name;
            userRole = role;
            cartId = cart;
            emailUser = email;

            if (userRole == "premium") {
                checkbox.check = true;
                checkbox.checked = true;
                const a = `<a href="/realTimeProducts">Agregar Productos</a>`;
                containerDiv.innerHTML = a;
            } else {
                containerDiv.innerHTML = "";
            }

            if (userRole != "user") {
                alert(`¡¡Hola Admin, bienvenido!!`);
            } else {
                alert(`¡¡Hola user: ${userName}, bienvenid@!!`);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
getCurrentUser();

checkbox.addEventListener("change", () => {
    const url = `http://localhost:8080/api/users/premium/${currentUser._id}`;
    const requestOptions = {
        method: "PUT",
    };

    fetch(url, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }
            return response.json();
        })
        .then((data) => {
            if (data == "usuario pasado a premium") {
                const a = `<a href="/realTimeProducts">Agregar Productos</a>`;
                containerDiv.innerHTML = a;
            } else if (data == "usuario pasado a user") {
                containerDiv.innerHTML = "";
            }
            alert("se actualizó el rol del usuario");
        })
        .catch((error) => {
            alert("falta documentación no es posible pasar a usuario premium");
            console.log(error);
            checkbox.check = false;
            checkbox.checked = false;
        });
});

let pag = 1;
let product = "";
let _id = "";

async function getProducts() {
    const url = `http://localhost:8080/api/products`;
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
            page.innerHTML = `page: ${pag}`;
            let content = "";
            data.payload.forEach((element) => {
                content += `<li class="item">
                                <h4>${element.title}</h4>
                                <div>
                                    <span>$${element.price}</span>
                                    <button class="carrito">Añadir al carrito</button>
                                </div>

                            </li>`;
            });
            container.innerHTML = content;
            addToCart();
        })
        .catch((error) => {
            console.error(error);
        });
}
getProducts();

function addToCart() {
    cart = document.querySelectorAll(".item");
    // Recorre cada elemento <li> y agrega un evento a su botón
    cart.forEach((item) => {
        const boton = item.querySelector(".carrito"); // Encuentra el botón dentro de cada <li>

        // Agrega un evento al botón
        boton.addEventListener("click", (e) => {
            let element =
                e.target.parentElement.parentElement.childNodes[1].innerText;
            fetchToCart(element);
        });
    });
}

async function fetchToCart(element) {
    const url = `http://localhost:8080/api/products?page=${pag}`;
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
            console.log(data.payload);
            let arrayDeObjetos = data.payload;
            const index = arrayDeObjetos.findIndex(
                (objeto) => objeto.title === element,
            );
            _id = arrayDeObjetos[index]._id;
            console.log(_id);
        })
        .catch((error) => {
            console.error(error);
        });

    console.log("cartIDDD", cartId, "IDDDDPRODUCT", _id);
    console.log(
        "carrito encontrado se sumo el producto al carrito" + " " + cartId,
    );
    const url1 = `http://localhost:8080/api/carts/${cartId}/products/${_id}`;

    const requestOptions1 = {
        method: "POST",
    };

    fetch(url1, requestOptions1)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }
            return response.json();
        })
        .then((data) => {
            alert("producto agregado al carrito" + " " + cartId);
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
}

following.addEventListener("click", async () => {
    pag++;
    page.innerHTML = `page: ${pag}`;
    const url = `http://localhost:8080/api/products?page=${pag}`;
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
            if (data == "No products found") {
                return (container.innerText = "No more Products");
            }
            let content = "";
            data.payload.forEach((element) => {
                content += `<li class="item">
                                <h4>${element.title}</h4>
                                <div>
                                    <span>$${element.price}</span>
                                    <button class="carrito" >Añadir al carrito</button>
                                </div>

                            </li>`;
            });
            container.innerHTML = content;
            addToCart();
        })
        .catch((error) => {
            console.error(error);
        });
});

back.addEventListener("click", async () => {
    if (pag > 1) {
        pag--;
        page.innerHTML = `page: ${pag}`;
        const url = `http://localhost:8080/api/products?page=${pag}`;
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
                if (data == "No products found") {
                    let content = "No more products found";
                    return (container.innerHTML = content);
                }
                let content = "";
                data.payload.forEach((element) => {
                    content += `<li class="item">
                                    <h4>${element.title}</h4>
                                    <div>
                                        <span>$${element.price}</span>
                                        <button class="carrito">Añadir al carrito</button>
                                    </div>
    
                                </li>`;
                });
                container.innerHTML = content;
                addToCart();
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        alert("Esta es la primera página");
    }
});
