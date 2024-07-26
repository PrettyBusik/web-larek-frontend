import {IEvents} from "../../base/events";
import {BaseProductView} from "../BaseProductView";
import {TProductCategory, IProduct} from "../../../types";

export abstract class BaseCatalogProductView extends BaseProductView {
    protected readonly categoryNode: HTMLElement;
    protected readonly imageNode: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.categoryNode = container.querySelector(".card__category");
        this.imageNode = container.querySelector(".card__image");
    }

    set product(product: IProduct) {
        super.product = product
        this.setText(this.categoryNode, product.category)
        this.setImage(this.imageNode, product.image)
        this.categoryNode.classList.add(this.getStylesForCategory(product.category));
    }

    private getStylesForCategory(category: TProductCategory): string {
        switch (category) {
            case "софт-скил":
                return "card__category_soft";
            case "другое":
                return "card__category_other";
            case "кнопка":
                return "card__category_button";
            case "дополнительное":
                return "card__category_additional";
            case "хард-скил":
                return "card__category_hard";
        }
    }
}