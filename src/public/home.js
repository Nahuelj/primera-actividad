const container = document.querySelector("#container");

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
            let content = "";
            data.payload.forEach((element) => {
                content += `<li class="item">
                                ${element.title}<span> $${element.price}</span>
                            </li>`;
            });
            container.innerHTML = content;
        })
        .catch((error) => {
            console.error(error);
        });
}
getProducts();
