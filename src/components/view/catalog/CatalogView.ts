import {BaseView} from "../../base/BaseView";

export class CatalogView extends BaseView {
    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}