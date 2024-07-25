import {BaseView} from "../../base/BaseView";
import {IEvents} from "../../base/events";

export class CatalogView extends BaseView {
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
    }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}