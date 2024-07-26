import {IProduct} from "../../types";

export class CatalogModel {
    private _products: IProduct[] = [];

    get products():IProduct[] {
        return this._products;
    }

    set products(products: IProduct[]) {
        this._products = products
    }

    getProductById(id: string): IProduct | null {
        return this
            ._products
            .find((item: IProduct) => item.id === id) ?? null
    }
}