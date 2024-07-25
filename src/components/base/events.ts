// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
import {IContacts, IDeliveryAndPayment} from "../../types";

type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

export const EVENT_POPUP_SHOW = 'popup.show';
export const EVENT_POPUP_HIDE = 'popup.hide';
export const EVENT_PRODUCT_SHOW_PREVIEW = 'product.showPreview';
export const EVENT_CART_SHOW = 'cart.show';
export const EVENT_CART_ADD_PRODUCT = 'cart.addProduct';
export const EVENT_CART_REMOVE_PRODUCT = 'cart.removeProduct';
export const EVENT_PURCHASE_STEP1_SHOW = 'purchase.step1.show';
export const EVENT_PURCHASE_STEP1_HANDLE_CHANGES = 'purchase.step1.handleChanges';
export const EVENT_PURCHASE_STEP1_SUBMIT = 'purchase.step1.submit';
export const EVENT_PURCHASE_STEP2_HANDLE_CHANGES = 'purchase.step2.handleChanges';
export const EVENT_PURCHASE_STEP2_SUBMIT = 'purchase.step2.submit';

export type TProductEvent = { id: string }
export type PurchaseStep1Event = Partial<IDeliveryAndPayment>
export type PurchaseStep2Event = Partial<IContacts>

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;

    emit<T extends object>(event: string, data?: T): void;

    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Установить обработчик на событие
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Снять обработчик с события
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Инициировать событие с данными
     */
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Слушать все события
     */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

    /**
     * Сбросить все обработчики
     */
    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}

