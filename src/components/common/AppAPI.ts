import {Api, ApiListResponse} from "../base/api";
import {IOrder, IProduct} from "../../types";


export interface IProductAPI {
    getProducts(): Promise<IProduct[]>;
}

export class AppAPI extends Api implements IProductAPI {
    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    getProducts(): Promise<IProduct[]> {
        return this.get(`/product/`).then((data: ApiListResponse<IProduct>) =>
            data.items
        );
    }

    getProduct(id: string): Promise<IProduct> {
        return this
            .get(`/product/${id}`)
            .then((data: IProduct) => data)
    }

    postOrder(order:IOrder):Promise<Pick<IOrder, "id"|"totalSum">>{
        return  this
            .post("/order", order)
            .then((data:Pick<IOrder, "id"|"totalSum">)=> data)
    }
}