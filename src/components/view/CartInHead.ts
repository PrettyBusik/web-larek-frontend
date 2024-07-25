import {Component} from "../base/Component";
import {ICart} from "../../types";
import {EventEmitter} from "../base/events";

export class CartInHead extends Component<ICart> {
    cartInHead: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.cartInHead = container.querySelector(".header__basket-counter");

        this.cartInHead.addEventListener("click", () => {
            events.emit("cart:open")
        })
    }

    setCounter(counter: number) {
        this.setText(this.cartInHead, counter);
    }
}