type TProductCategory = 'софт-скил' | 'кнопка' | 'другое' | 'дополнительное' | 'хард-скил'


// General types
export interface IProduct {
    id: string
    description: string
    image: string
    title: string
    category: TProductCategory
    price: number
}

export interface IOrder {
    id: string
    totalPrice: number
}

// Model's types

export type TPaymentType = 'онлайн' | 'при получении'

export interface IDeliveryAndPayment {
    paymentType: TPaymentType
    address: string
}

export interface IContacts {
    email: string
    phone: string
}

export interface IOrderCreationData extends IDeliveryAndPayment, IContacts {
    products: IProduct[]
}

export type TValidationErrors<T> = Partial<Record<keyof T, string>>
