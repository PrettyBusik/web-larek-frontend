import {EVENT_PURCHASE_STEP1_HANDLE_CHANGES, EVENT_PURCHASE_STEP1_SUBMIT, IEvents} from "../../base/events";
import {IDeliveryAndPayment, TValidationErrors} from "../../../types";
import {BaseStepView} from "./BaseStepView";

export class Step1View extends BaseStepView<IDeliveryAndPayment> {
    private readonly cardPaymentMethodNodes: HTMLButtonElement;
    private readonly cashPaymentMethodNodes: HTMLButtonElement;
    private readonly addressNode: HTMLInputElement;

    private readonly activeButtonCssClass = 'button_alt-active'

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.cardPaymentMethodNodes = container.querySelector('.button_alt[name="card"]')
        this.cashPaymentMethodNodes = container.querySelector('.button_alt[name="cash"]')
        this.addressNode = container.querySelector('.form__input[name="address"]')

        this.cardPaymentMethodNodes.addEventListener('click', () => {
            events.emit(EVENT_PURCHASE_STEP1_HANDLE_CHANGES, {payment: 'card'})
        })
        this.cashPaymentMethodNodes.addEventListener('click', () => {
            events.emit(EVENT_PURCHASE_STEP1_HANDLE_CHANGES, {payment: 'cash'})
        })
        this.addressNode.addEventListener('input', () => {
            events.emit(EVENT_PURCHASE_STEP1_HANDLE_CHANGES, {address: this.addressNode.value})
        })
        this.submitButton.addEventListener('click', (event) => {
            event.preventDefault()
            events.emit(EVENT_PURCHASE_STEP1_SUBMIT)
        })
    }

    set values(data: IDeliveryAndPayment) {
        if (data.payment === 'card') {
            this.toggleClass(this.cardPaymentMethodNodes,this.activeButtonCssClass,true)
            this.toggleClass(this.cashPaymentMethodNodes,this.activeButtonCssClass,false)
        } else {
            this.toggleClass(this.cardPaymentMethodNodes,this.activeButtonCssClass,false)
            this.toggleClass(this.cashPaymentMethodNodes,this.activeButtonCssClass,true)
        }

        this.addressNode.value = data.address
    }

    set validationErrors(errors: TValidationErrors<IDeliveryAndPayment> | null) {
        if (errors === null) {
            this.setText(this.validationErrorsNode, '')
        } else {
            this.setText(
                this.validationErrorsNode,
                Object.values(errors).join(";<br>")
            )
        }
    }
}