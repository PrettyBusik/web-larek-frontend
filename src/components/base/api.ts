import {IOrder, IOrderCreationData, IProduct} from "../../types";

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }

    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
}

export class RestApi extends Api {
    private readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProduct(id: number):Promise<IProduct> { }
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

    createOrder(data: IOrderCreationData): Promise<IOrder> {
        return this.post('/order', data) as Promise<IOrder>
    }
}