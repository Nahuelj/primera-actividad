export class UserCurrent {
    constructor(object) {
        const { first_name, last_name, role, email, cartId } = object;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role = role;
        this.email = email;
        this.cart = cartId;
    }
}
