import {Component} from "../base/Component";
import {ICart} from "../../types";
import {EventEmitter} from "../base/events";

export class CartView extends Component<ICart> {
    title: HTMLElement
    products: HTMLElement;
    totalSum: HTMLElement;
    buyButton: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);

        this.title = container.querySelector(".modal__title");
        this.products = container.querySelector(".basket__list");
        this.totalSum = container.querySelector(".basket__price");
        this.buyButton = container.querySelector(".basket__button");
    }

    setProducts(productsElements: HTMLElement[]) {
        this.products.replaceChildren(...productsElements);
    }

    setTotalSum(sum: number) {
        this.totalSum.innerText = String(sum);
    }
}