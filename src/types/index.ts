
export interface IProduct {
    id: string;
    title: string;
    category: Category;
    image: string;
    price: number;
    description: string;
}


export interface ICart {
    products: IProduct[];
    totalAmountOfProducts: number;
    totalSum: number;
}

export interface IOrder {
    wayForPayment: TPaymentType;
    addressForDelivery: string;
    email: string;
    phone: string;
    id: number;
    totalSum: number;
}


export type Category = "хард-скил" | "другое" | "кнопка" | "дополнительное" | "софт-скил";

export type TPaymentType = "card" | "cash";


export interface IDeliveryAndPayment {
    payment: TPaymentType
    address: string
}

export interface IContacts {
    email: string
    phone: string
}

export interface IOrderCreationData extends IDeliveryAndPayment, IContacts {
    items: string[]
    total: number
}

export interface ICreatedOrderData {
    total: number
}

export type TValidationErrors<T> = Partial<Record<keyof T, string>>