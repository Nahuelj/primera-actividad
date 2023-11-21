export class CustomError {
    static generate(nombre, message, code, description) {
        let error = new Error(message);
        error.name = nombre;
        error.description = description;
        error.code = code;
        return error;
    }
}
