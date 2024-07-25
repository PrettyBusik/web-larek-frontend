import {EVENT_POPUP_HIDE, IEvents} from "../../base/events";
import {ICreatedOrderData} from "../../../types";
import {BaseView} from "../../base/BaseView";

export class SuccessMessageView extends BaseView {
    private readonly priceNode: HTMLElement;
    private readonly submitButtonNode: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.priceNode = container.querySelector('.order-success__description')
        this.submitButtonNode = container.querySelector('.order-success__close')
        this.submitButtonNode.addEventListener('click', () => {
            events.emit(EVENT_POPUP_HIDE)
        })
    }

    set createdOrderData(data: ICreatedOrderData) {
        this.setText(this.priceNode, `Списано ${data.total} синапсов`)
    }
}