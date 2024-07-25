import {EVENT_PURCHASE_STEP2_HANDLE_CHANGES, EVENT_PURCHASE_STEP2_SUBMIT, IEvents} from "../../base/events";
import {IContacts, TValidationErrors} from "../../../types";
import {BaseStepView} from "./BaseStepView";

export class Step2View extends BaseStepView<IContacts> {
    private readonly emailNode: HTMLInputElement;
    private readonly phoneNode: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.emailNode = container.querySelector('.form__input[name="email"]')
        this.phoneNode = container.querySelector('.form__input[name="phone"]')

        this.emailNode.addEventListener('input', () => {
            events.emit(EVENT_PURCHASE_STEP2_HANDLE_CHANGES, {email: this.emailNode.value})
        })
        this.phoneNode.addEventListener('input', () => {
            events.emit(EVENT_PURCHASE_STEP2_HANDLE_CHANGES, {phone: this.phoneNode.value})
        })
        this.submitButton.addEventListener('click', (event) => {
            event.preventDefault()
            events.emit(EVENT_PURCHASE_STEP2_SUBMIT)
        })
    }

    set values(data: IContacts) {
        this.emailNode.value = data.email
        this.phoneNode.value = data.phone
    }

    set validationErrors(errors: TValidationErrors<IContacts> | null) {
        if (errors === null) {
            this.setText(this.validationErrorsNode, '')
        } else {
            this.setText(
                this.validationErrorsNode,
                Object.values(errors).join("; ")
            )
        }
    }
}