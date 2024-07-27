import {IContacts, IDeliveryAndPayment, TPaymentType, TValidationErrors} from "../../types";

export class PurchaseModel implements IDeliveryAndPayment, IContacts {
    payment: TPaymentType = 'card'
    address = ''
    email = ''
    phone = ''

    get deliveryAndPayment(): IDeliveryAndPayment {
        return {payment: this.payment, address: this.address}
    }

    get contacts(): IContacts {
        return {email: this.email, phone: this.phone}
    }

    updateData(data: Partial<IDeliveryAndPayment> | Partial<IContacts>): void {
        Object.assign(this as object, data ?? {});
    }

    validateDeliveryAndPayment(): TValidationErrors<IDeliveryAndPayment> | null {
        const errors: TValidationErrors<IDeliveryAndPayment> = {};
        let isValid = true;

        if (this.address.trim() === '') {
            errors['address'] = 'Необходимо заполнить адрес'
            isValid = false
        }

        return isValid ? null : errors;
    }

    validateContacts(): TValidationErrors<IContacts> | null {
        const errors: TValidationErrors<IContacts> = {}
        let isValid = true;

        if (this.email.trim() === '') {
            errors['email'] = 'Необходимо заполнить email'
            isValid = false
        }

        if (this.phone.trim() === '') {
            errors['phone'] = 'Необходимо заполнить телефон'
            isValid = false
        }

        return isValid ? null : errors;
    }

    clear(): void {
        this.payment = 'card'
        this.address = ''
        this.email = ''
        this.phone = ''

    }
}