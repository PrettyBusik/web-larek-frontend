import {BaseView} from "../../base/BaseView";
import {EVENT_PURCHASE_STEP1_SHOW, IEvents} from "../../base/events";

export class CartView extends BaseView {
   private readonly itemsListNode: HTMLElement;
    private readonly totalPriceNode: HTMLElement;
    private readonly submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.itemsListNode = container.querySelector(".basket__list");
        this.totalPriceNode = container.querySelector(".basket__price");
        this.submitButton = container.querySelector(".basket__button");

        this.submitButton.addEventListener("click", () => {
            events.emit(EVENT_PURCHASE_STEP1_SHOW)
        })
    }

    set items(items: HTMLElement[]) {
        this.itemsListNode.replaceChildren(...items)
    }

    set totalPrice(totalPrice: number) {
        this.setText(this.totalPriceNode,totalPrice + " синапсов")
    }

    toggleSubmitButton(enable: boolean): void {
        this.submitButton.disabled = !enable
    }
}