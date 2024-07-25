import {EVENT_PRODUCT_SHOW_PREVIEW, IEvents} from "../../base/events";
import {BaseCatalogProductView} from "./BaseCatalogProductView";

export class CatalogItemView extends BaseCatalogProductView {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.container.addEventListener("click", () => {
            events.emit(EVENT_PRODUCT_SHOW_PREVIEW, {id: this.productId});
        })
    }
}


