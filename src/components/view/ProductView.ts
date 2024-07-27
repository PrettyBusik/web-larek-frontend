import {BaseView} from "../base/BaseView";
import {IProduct, TProductCategory} from "../../types";
import {EVENT_CART_ADD_PRODUCT, EVENT_CART_REMOVE_PRODUCT, EVENT_PRODUCT_SHOW_PREVIEW, IEvents} from "../base/events";

export class ProductView extends BaseView {
    private readonly titleNode: HTMLElement;
    private readonly priceNode: HTMLElement;
    private readonly categoryNode: HTMLElement | null;
    private readonly imageNode: HTMLImageElement | null;
    private readonly descriptionNode: HTMLElement | null;
    private readonly indexNode: HTMLElement | null;
    private readonly buttonNode: HTMLButtonElement | null;

    private removeButtonCssClass = 'basket__item-delete';

    protected productId: string;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.titleNode = container.querySelector(".card__title");
        this.priceNode = container.querySelector(".card__price");
        this.categoryNode = container.querySelector(".card__category");
        this.imageNode = container.querySelector(".card__image");
        this.descriptionNode = container.querySelector(".card__text");
        this.indexNode = container.querySelector(".basket__item-index");
        this.buttonNode = container.querySelector(".card__button");

        if (this.buttonNode) {
            this.buttonNode.addEventListener("click", () => {
                events.emit(
                    this.buttonNode.classList.contains(this.removeButtonCssClass) ? EVENT_CART_REMOVE_PRODUCT : EVENT_CART_ADD_PRODUCT,
                    {id: this.productId}
                );
            })
        } else {
            this.container.addEventListener("click", () => {
                events.emit(EVENT_PRODUCT_SHOW_PREVIEW, {id: this.productId});
            })
        }
    }

    set product(product: IProduct) {
        this.setText(this.titleNode, product.title);
        this.setText(this.priceNode, product.price ? `${product.price} синапсов` : 'бесценно');
        this.setText(this.categoryNode, product.category)
        this.setImage(this.imageNode, product.image)

        this.toggleClass(this.categoryNode, this.getStylesForCategory(product.category), true)

        this.productId = product.id;
    }

    set index(index: number) {
        this.setText(this.indexNode, String(index))
    }

    toggleButton(enable: boolean) {
        this.buttonNode.disabled = !enable
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


