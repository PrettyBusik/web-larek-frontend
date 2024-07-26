import {BaseView} from "../../base/BaseView";
import {IEvents} from "../../base/events";

export class CatalogView extends BaseView {
    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}