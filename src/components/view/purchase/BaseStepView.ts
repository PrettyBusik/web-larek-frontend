import {BaseView} from "../../base/BaseView";
import {TValidationErrors} from "../../../types";

export abstract class BaseStepView<DataType> extends BaseView {
    protected readonly validationErrorsNode: HTMLElement;
    protected readonly submitButton: HTMLButtonElement;

    abstract set values(data: DataType);

    abstract set validationErrors(data: TValidationErrors<DataType>);

    constructor(container: HTMLElement) {
        super(container);
        this.validationErrorsNode = container.querySelector('.form__errors')
        this.submitButton = container.querySelector('button[type="submit"]')
    }

    toggleSubmitButton(enable: boolean): void {
        this.submitButton.disabled = !enable
    }
}