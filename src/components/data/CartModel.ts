import {IProduct} from "../../types";

export class CartModel {
    products: IProduct[] = [];

    getAllProducts() {
        return this.products;
    }

    get totalSum(): number {
        return this.products.reduce((total: number, element: IProduct) => {
            return total + element.price
        }, 0)
    }

    get totalAmountOfProducts(): number {
        return this.products.length;
    }

    addProduct(product: IProduct) {
        this.products.push(product)
    }

    removeProduct(product: IProduct) {
        this.products = this.products.filter((element) => {
            return element.id !== product.id
        })
    }
}