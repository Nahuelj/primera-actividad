export class UserCurrent {
    constructor(object) {
        const { first_name, last_name, role, email } = object;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role = role;
        this.email = email;
    }
}
