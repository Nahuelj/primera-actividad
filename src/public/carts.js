const title = document.querySelector("#title");
const texto = title.innerText.toString();
const patron = /Cart id: ([a-zA-Z0-9]+)/;
const resultado = texto.match(patron);
const cartId = resultado[1];
const container = document.querySelector("#container");
const totalCoutn = document.querySelector("#total");

const url = `http://localhost:8080/api/carts/${cartId}`;
const requestOptions = {
    method: "GET",
};

fetch(url, requestOptions)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        if (data.message == "Invalid cart ID") {
            return alert("Invalid cart ID");
        }
        let content = "";
        let total = 0;
        data.forEach((element) => {
            total += element._id.price;
            content += `<li class="item">
                            <h4>${element._id.title}</h4>
                                <span>$${element._id.price}</span>
                        </li>`;
        });
        totalCoutn.innerText = `Total: ${total}`;
        container.innerHTML = content;
    });
