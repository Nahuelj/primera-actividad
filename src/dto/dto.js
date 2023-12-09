export class UserCurrent {
    constructor(object) {
        const { first_name, last_name, role, email, cartId, _id } = object;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role = role;
        this.email = email;
        this.cart = cartId;
        this._id = _id;
    }
}
