import {BaseView} from "../../base/BaseView";
import {ICart} from "../../../types";
import {EVENT_CART_SHOW, EventEmitter} from "../../base/events";

export class CartIconView extends BaseView {
   protected counterNode: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.counterNode = container.querySelector(".header__basket-counter");

        this.container.addEventListener("click", () => {
            events.emit(EVENT_CART_SHOW)
        })
    }

    set counterValue(counter: number) {
        this.setText(this.counterNode, counter);
    }
}