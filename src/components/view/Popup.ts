import {Component} from "../base/Component";
import {EventEmitter} from "../base/events";

export  interface IPopup{
    show():void;
    hide():void;
    set content(content:HTMLElement);
}
export class Popup extends Component<IPopup>{
    closeButton:HTMLElement;
    _content:HTMLElement;

    constructor(container:HTMLElement, events:EventEmitter) {
        super(container);
        this.closeButton= container.querySelector(".modal__close");
        this._content = container.querySelector(".modal__content");

        this.closeButton.addEventListener("click", ()=>{
            events.emit("popup:close")
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