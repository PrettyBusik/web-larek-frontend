import {ICreatedOrderData, IOrderCreationData, IProduct} from "../../types";
import {Api, ApiListResponse} from "../base/api";

export class RestApi extends Api {
    private readonly cdn: string;

    constructor(baseUrl: string, cdn: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProduct(id: string): Promise<IProduct> {
        return this
            .get(`/product/${id}`)
            .then((data: IProduct) => {
                return {...data, image: this.cdn + data.image}
            })
    }

    getProductsList(): Promise<IProduct[]> {
        return this
            .get('/product/')
            .then((data: ApiListResponse<IProduct>) => {
                return data
                    .items
                    .map((item) => ({
                        ...item,
                        image: this.cdn + item.image
                    }))
            })
    }

    createOrder(data: IOrderCreationData): Promise<ICreatedOrderData> {
        return this.post('/order', data) as Promise<ICreatedOrderData>
    }
}