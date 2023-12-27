import { UserModel } from "../models/user.model.js";

class UserManager {
    async deleteUser(correo) {
        try {
            const userDeleted = await UserModel.findOneAndDelete(
                { email: correo },
                { new: true },
            );

            if (!userDeleted) {
                return "User not found";
            }
            return userDeleted;
        } catch (error) {
            console.error("Something went wrong:", error);
        }
    }
}

export const userManager = new UserManager();
