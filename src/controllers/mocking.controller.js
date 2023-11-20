import { faker } from "@faker-js/faker";
import { v4 } from "uuid";

export const generateProduct = () => {
    const allProducts = [];

    for (let i = 0; i < 100; i++) {
        const _id = v4();
        const title = faker.commerce.productName();
        const description = faker.commerce.productDescription();
        const price = faker.commerce.price();
        const thumbnails = [faker.internet.url(), faker.internet.url()];
        const code = v4();
        const stock = faker.number.int({ min: 100, max: 2000 });
        const status = true;
        const category = faker.commerce.department();

        const productGenerated = {
            _id,
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            status,
            category,
        };

        allProducts.push(productGenerated);
    }

    return allProducts;
};
