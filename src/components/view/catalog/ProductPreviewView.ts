import {IProduct} from "../../../types";
import {EVENT_CART_ADD_PRODUCT, EVENT_POPUP_HIDE, IEvents} from "../../base/events";
import {BaseCatalogProductView} from "./BaseCatalogProductView";

export class ProductPreviewView extends BaseCatalogProductView {
    private readonly descriptionNode: HTMLElement
    private readonly addToCartButtonNode: HTMLButtonElement

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.descriptionNode = container.querySelector(".card__text");
        this.addToCartButtonNode = container.querySelector(".card__button");

        this.addToCartButtonNode.addEventListener("click", () => {
            events.emit(EVENT_CART_ADD_PRODUCT, {id: this.productId});
            events.emit(EVENT_POPUP_HIDE);
        })
    }

    set product(product: IProduct) {
        super.product = product
        this.setText(this.descriptionNode, product.description)
    }

     toggleAddToCartButton(enable:boolean){
        this.addToCartButtonNode.disabled = !enable
    }
}