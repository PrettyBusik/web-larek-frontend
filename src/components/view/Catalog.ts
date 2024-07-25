import {Component} from "../base/Component";
import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";


interface ICatalog{
    catalog:HTMLElement[];
    totalAmountOfOrderedProducts:number;
}
export  class Catalog extends Component<ICatalog>{

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
    }

    set catalog(items:HTMLElement[]){
        this.container.replaceChildren(...items);
    }
}