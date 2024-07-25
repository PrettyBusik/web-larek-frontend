import {CardProductWholeView} from "./CardProductWholeView";
import {Component} from "../base/Component";
import {IOrder} from "../../types";
import {EventEmitter} from "../base/events";

export class OrderStep1View extends Component<IOrder>{
    wayForPaymentOnline:HTMLElement;
    wayForPaymentAfterDelivery:HTMLElement;
    addressInput:HTMLInputElement;
    buttonNext:HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);

        console.log(container)

        // this.wayForPaymentOnline=this.container.querySelector("button[name=\"card\"]");
        this.wayForPaymentOnline=container.querySelector('button[name="card"]');
        // this.wayForPaymentOnline=button[name="card"]


        this.addressInput=container.querySelector(".orm__input");
        this.buttonNext=container.querySelector(".button");


        this.buttonNext.addEventListener("click", ()=>{
            events.emit("order:show step 2")
        });
   }


   setWayForPayment(){
       console.log(this.wayForPaymentOnline)
       this.wayForPaymentOnline.addEventListener("click", ()=>{
           this.wayForPaymentOnline.classList.add("button_alt-active");
           console.log(1)
       })

       this.wayForPaymentOnline.addEventListener("click", ()=>{
           this.wayForPaymentOnline.classList.add("button_alt-active");
       })
   }

}
