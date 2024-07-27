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
        const doesAlreadyExist = this.doesAlreadyExist(product.id);
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

    doesAlreadyExist(productId:string):boolean{
     return this.productsList.some((item: IProduct) => item.id === productId);
    }

    clear(): void {
        this.productsList = []
    }
}