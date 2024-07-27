import {BaseView} from "../base/BaseView";
import {EVENT_POPUP_HIDE, IEvents} from "../base/events";

export class PopupView extends BaseView {
    private readonly closeButtonNode: HTMLElement;
    private readonly contentNode: HTMLElement;

    private readonly activeCssClass = 'modal_active'

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.closeButtonNode = container.querySelector(".modal__close");
        this.contentNode = container.querySelector(".modal__content");

        this.closeButtonNode.addEventListener("click", () => {
            events.emit(EVENT_POPUP_HIDE)
        })
        container.addEventListener("click", (event) => {
            if (event.target === event.currentTarget) {
                events.emit(EVENT_POPUP_HIDE)
            }
        })
    }

    show() {
        this.toggleClass(this.container,this.activeCssClass,true)
        document.body.style.overflowY = 'hidden'
    }

    hide() {
        this.toggleClass(this.container,this.activeCssClass,false)
        document.body.style.overflowY = 'auto'
    }

    set content(content: HTMLElement) {
        this.contentNode.replaceChildren(content);
    }
}