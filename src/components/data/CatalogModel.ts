import {IProduct} from "../../types";

export class CatalogModel {
    private productsList: IProduct[] = [];

    get products(): IProduct[] {
        return this.productsList;
    }

    set products(products: IProduct[]) {
        this.productsList = products
    }

    getProductById(id: string): IProduct | null {
        return this
            .productsList
            .find((item: IProduct) => item.id === id) ?? null
    }
}