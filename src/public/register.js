const email = document.querySelector("#email");
const password = document.querySelector("#password");
const register = document.querySelector("#register");

function esDireccionEmailValida(email) {
    const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return expresionRegular.test(email);
}

function handleClick() {
    const emailValue = email.value;
    const emailValid = esDireccionEmailValida(emailValue);
    const passwordValue = password.value;
    if (!emailValid) {
        return alert("no es un email valido");
    } else {
        const url = "http://localhost:8080/singin";
        const body = {
            email: emailValue,
            password: passwordValue,
        };
        const options = {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch(url, options)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error de red - ${response.status}`);
                }
                return response.json();
            })
            .then((data) => console.log(data))
            .catch((error) => console.error(error));
    }
}

register.addEventListener("click", handleClick);
