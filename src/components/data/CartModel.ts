import {IProduct} from "../../types";

export class CartModel {
    private productsList: IProduct[] = [];

    get products(): IProduct[] {
        return this.productsList;
    }

    get totalPrice(): number {
        return this.products.reduce((total: number, element: IProduct) => {
            return total + element.price
        }, 0)
    }

    get productIds(): string[] {
        return this.products.map((item: IProduct) => item.id)
    }

    addProduct(product: IProduct) {
        const doesAlreadyExist = this.products.some((item: IProduct) => item.id === product.id)
        if (doesAlreadyExist) {
            return
        }

        this.products.push(product)
    }

    removeProduct(productId: string) {
        this.productsList = this.productsList.filter((element) => {
            return element.id !== productId
        })
    }

    clear(): void {
        this.productsList = []
    }
}