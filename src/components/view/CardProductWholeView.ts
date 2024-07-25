import {Component} from "../base/Component";
import {Category, IProduct} from "../../types";
import {EventEmitter} from "../base/events";
import * as querystring from "querystring";
import {CDN_URL} from "../../utils/constants";

export class CardProductWholeView extends Component<IProduct> {
    productId: string;
    title: HTMLElement;
    category: HTMLElement;
    image: HTMLImageElement;
    price: HTMLElement;
    description: HTMLElement;
    buyButton: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);

        this.title = container.querySelector(".card__title");
        this.category = container.querySelector(".card__category");
        this.image = container.querySelector(".card__image");
        this.price = container.querySelector(".card__price");
        this.description = container.querySelector(".card__text");
        this.buyButton = container.querySelector(".card__button");

        this.buyButton.addEventListener("click", ()=>{
            events.emit("cart:add product", {id:this.productId});
        })
    }


    setProduct(product: IProduct):void {
        this.setText(this.title, product.title);
        this.setText(this.category, product.category)
        this.setText(this.category, product.category);
        this.setImage(this.image, `${CDN_URL}${product.image}`)
        this.setText(this.price, product.price + " синапсов");
        this.productId=product.id;

        this.category.classList.add(this.getStylesForCategory(product.category));
    }

    private getStylesForCategory(category: Category) {
        switch (category) {
            case "софт-скил":
                return "card__category_soft";
            case "другое":
                return "card__category_other";
            case "кнопка":
                return "card__category_button";
            case "дополнительное":
                return "card__category_additional";
            case "хард-скил":
                return "card__category_hard";
        }
    }
}