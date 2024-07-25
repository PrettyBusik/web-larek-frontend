import {BaseView} from "../base/BaseView";
import {EVENT_POPUP_HIDE, IEvents} from "../base/events";

export class PopupView extends BaseView {
    private closeButtonNode: HTMLElement;
    private _content: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.closeButtonNode = container.querySelector(".modal__close");
        this._content = container.querySelector(".modal__content");

        this.closeButtonNode.addEventListener("click", () => {
            events.emit(EVENT_POPUP_HIDE)
        })
    }

    show(){
      this.container.style.display="block";
    }

    hide(){
      this.setHidden(this.container);
    }

    set content(content:HTMLElement){
       this._content.replaceChildren(content);
    }
}