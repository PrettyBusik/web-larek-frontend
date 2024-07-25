import {Component} from "../base/Component";
import {IProduct} from "../../types";
import {EventEmitter} from "../base/events";

export class CardProductViewInCart extends Component<IProduct>{
    productId: string;
    index:HTMLElement;
    title:HTMLElement;
    price:HTMLElement;
    deleteButton:HTMLElement;


    constructor(container:HTMLElement, events:EventEmitter) {
        super(container);

        this.index= container.querySelector(".basket__item-index");
        this.title= container.querySelector(".card__title");
        this.price=container.querySelector(".card__price");
        this.deleteButton= container.querySelector(".basket__item-delete");

        this.deleteButton.addEventListener("click", ()=>{
            events.emit("card:delete", {id:this.productId});
        })
    }

    setProduct(product:IProduct, index:number){
        this.setText(this.index, String(index));
        this.setText(this.title, product.title);
        this.setText(this.price, product.price);

        this.productId= product.id
    }

}