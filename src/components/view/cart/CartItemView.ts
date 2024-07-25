import {BaseProductView} from "../BaseProductView";
import {EVENT_CART_REMOVE_PRODUCT, IEvents} from "../../base/events";

export class CartItemView extends BaseProductView {
    private readonly indexNode: HTMLElement
    private readonly removeButtonNode: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container,events);

        this.indexNode = container.querySelector(".basket__item-index");
        this.removeButtonNode = container.querySelector(".basket__item-delete");

        this.removeButtonNode.addEventListener("click", () => {
            events.emit(EVENT_CART_REMOVE_PRODUCT, {id: this.productId});
        })
    }

    set index(index:number){
        this.setText(this.indexNode,String(index))
    }
}