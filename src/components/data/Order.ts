import {Model} from "../base/Model";
import {IOrder, IProduct, TOptionForPayment, TOrderContacts, TOrderPayment} from "../../types";


// export interface IOrder {
//     items: IProduct[];
//     wayForPayment: TOptionForPayment;
//     addressForDelivery: string;
//     email: string;
//     phone: string;
//     id: number;
//     totalSum: number;
// }


class Order extends Model<IOrder> {
    items: IProduct[];
    wayForPayment: TOptionForPayment;
    addressForDelivery: string;
    email: string;
    phone: string;
    id: number;
    totalSum: number;

    set products(products: IProduct[]) {
        this.items = products;
    }

    set wayForPaymentAndAddress(data: TOrderPayment) {
        this.wayForPayment = data.wayForPayment;
        this.addressForDelivery = data.addressForDelivery;
    }

    set contacts(data: TOrderContacts) {
        this.email = data.email;
        this.phone = data.phone;
    }

    calculateTotalSum():number{
        this.items.forEach(item=>{
            this.totalSum+=item.price
        })
        return this.totalSum;
    }

}