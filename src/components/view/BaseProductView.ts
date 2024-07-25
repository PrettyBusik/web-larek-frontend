import {BaseView} from "../base/BaseView";
import {IProduct} from "../../types";
import {IEvents} from "../base/events";

export abstract class BaseProductView extends BaseView {
    protected readonly titleNode: HTMLElement;
    protected readonly priceNode: HTMLElement;

    protected productId: string;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.titleNode = container.querySelector(".card__title");
        this.priceNode = container.querySelector(".card__price");
    }

    set product(product: IProduct) {
        this.setText(this.titleNode, product.title);
        this.setText(this.priceNode, product.price + " синапсов");
        this.productId = product.id;
    }
}


