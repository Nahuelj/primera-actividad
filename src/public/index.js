const socket = io();

socket.on("update", (data) => {
    const container = document.getElementById("container");
    container.innerHTML = "";
    data.forEach((product) => {
        const li = document.createElement("li");
        li.textContent = `${product.title}, Precio: $${product.price}`;
        container.appendChild(li);
    });
});
