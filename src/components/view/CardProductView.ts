import {Component} from "../base/Component";
import {Category, IProduct} from "../../types";
import {cloneTemplate, ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";
import {CDN_URL} from "../../utils/constants";

export type ProductEvent= {id:string};

export class CardProductView extends Component<IProduct> {
    productId:string;
    title: HTMLElement;
    category: HTMLElement;
    image: HTMLImageElement;
    price: HTMLElement;

    constructor(protected readonly container: HTMLElement, protected events: IEvents) {
        super(container);
        this.title = container.querySelector(".card__title");
        this.category = container.querySelector(".card__category");
        this.image = container.querySelector(".card__image");
        this.price = container.querySelector(".card__price");


        this.container.addEventListener("click", () => {
            events.emit("card:open", {id:this.productId});
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


