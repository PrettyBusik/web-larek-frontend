import './scss/styles.scss';
import {API_URL, CDN_URL} from "./utils/constants";
import {
    EVENT_CART_ADD_PRODUCT,
    EVENT_CART_REMOVE_PRODUCT,
    EVENT_CART_SHOW,
    EVENT_POPUP_HIDE,
    EVENT_POPUP_SHOW,
    EVENT_PRODUCT_SHOW_PREVIEW,
    EVENT_PURCHASE_STEP1_HANDLE_CHANGES,
    EVENT_PURCHASE_STEP1_SHOW,
    EVENT_PURCHASE_STEP1_SUBMIT,
    EVENT_PURCHASE_STEP2_HANDLE_CHANGES,
    EVENT_PURCHASE_STEP2_SUBMIT,
    EventEmitter,
    PurchaseStep1Event,
    PurchaseStep2Event,
    TProductEvent
} from "./components/base/events";
import {CatalogItemView} from "./components/view/catalog/CatalogItemView";
import {cloneTemplate} from "./utils/utils";
import {CatalogView} from "./components/view/catalog/CatalogView";
import {PopupView} from "./components/view/PopupView";
import {CartModel} from "./components/data/CartModel";
import {CartIconView} from "./components/view/cart/CartIconView";
import {IProduct} from "./types";
import {ProductPreviewView} from "./components/view/catalog/ProductPreviewView";
import {CartView} from "./components/view/cart/CartView";
import {CartItemView} from "./components/view/cart/CartItemView";
import {Step1View} from "./components/view/purchase/Step1View";
import {PurchaseModel} from "./components/data/PurchaseModel";
import {Step2View} from "./components/view/purchase/Step2View";
import {SuccessMessageView} from "./components/view/purchase/SuccessMessageView";
import {CatalogModel} from "./components/data/CatalogModel";
import {RestApi} from "./components/common/RestApi";

// Common objects
const api = new RestApi(API_URL, CDN_URL);
const events = new EventEmitter();

// Permanent views
const popupView = new PopupView(document.querySelector("#modal-container"), events);
const catalogView = new CatalogView(document.querySelector(".gallery"));
const cartIconView = new CartIconView(document.querySelector(".header__basket"), events);
const purchaseStep1View = new Step1View(cloneTemplate('#order'), events)
const purchaseStep2View = new Step2View(cloneTemplate('#contacts'), events)
const purchaseSuccessMessageView = new SuccessMessageView(cloneTemplate('#success'), events)

// Models
const cartModel = new CartModel();
const purchaseModel = new PurchaseModel();
const catalogModel = new CatalogModel()

// Popup events handling

events.on(EVENT_POPUP_SHOW, () => popupView.show())
events.on(EVENT_POPUP_HIDE, () => popupView.hide())

// Catalog events handling

events.on(EVENT_PRODUCT_SHOW_PREVIEW, (data: TProductEvent) => {
    const product = catalogModel.getProductById(data.id)
    const doesAlreadyExist= cartModel.doesAlreadyExist(product.id);

    const previewView = new ProductPreviewView(cloneTemplate("#card-preview"), events);
    previewView.product = product;
    previewView.toggleAddToCartButton(product.price > 0);
    previewView.toggleAddToCartButton(!doesAlreadyExist);

    popupView.content = previewView.render();

    events.emit(EVENT_POPUP_SHOW);
})

// Cart events handling

events.on(EVENT_CART_SHOW, () => {
    const itemNodes: HTMLElement[] = [];

    cartModel.products.forEach((product: IProduct, index: number) => {
        const productView = new CartItemView(cloneTemplate('#card-basket'), events);
        productView.product = product
        productView.index = index + 1
        itemNodes.push(productView.render())
    })

    const cartView = new CartView(cloneTemplate('#basket'), events)
    cartView.items = itemNodes;
    cartView.totalPrice = cartModel.totalPrice;
    cartView.toggleSubmitButton(itemNodes.length !== 0);
    popupView.content = cartView.render()

    events.emit(EVENT_POPUP_SHOW)
})

events.on(EVENT_CART_ADD_PRODUCT, (data: TProductEvent) => {
    const product = catalogModel.getProductById(data.id)
    cartModel.addProduct(product)
    cartIconView.counterValue = cartModel.products.length
})

events.on(EVENT_CART_REMOVE_PRODUCT, (data: TProductEvent) => {
    cartModel.removeProduct(data.id)
    cartIconView.counterValue = cartModel.products.length

    events.emit(EVENT_CART_SHOW)
})

// Purchase form events handling

events.on(EVENT_PURCHASE_STEP1_SHOW, () => {
    purchaseStep1View.values = purchaseModel.deliveryAndPayment
    purchaseStep1View.validationErrors = null
    purchaseStep1View.toggleSubmitButton(false)

    popupView.content = purchaseStep1View.render()

    events.emit(EVENT_POPUP_SHOW)
})

events.on(EVENT_PURCHASE_STEP1_HANDLE_CHANGES, (data: PurchaseStep1Event) => {
    purchaseModel.updateData(data)
    purchaseStep1View.values = purchaseModel.deliveryAndPayment
    purchaseStep1View.validationErrors = purchaseModel.validateDeliveryAndPayment()
    purchaseStep1View.toggleSubmitButton(purchaseModel.validateDeliveryAndPayment() === null)
})

events.on(EVENT_PURCHASE_STEP1_SUBMIT, () => {
    purchaseStep2View.values = purchaseModel.contacts
    purchaseStep2View.validationErrors = null
    purchaseStep2View.toggleSubmitButton(false)

    popupView.content = purchaseStep2View.render()
})

events.on(EVENT_PURCHASE_STEP2_HANDLE_CHANGES, (data: PurchaseStep2Event) => {
    purchaseModel.updateData(data)
    purchaseStep2View.values = purchaseModel.contacts
    purchaseStep2View.validationErrors = purchaseModel.validateContacts()
    purchaseStep2View.toggleSubmitButton(purchaseModel.validateContacts() === null)
})

events.on(EVENT_PURCHASE_STEP2_SUBMIT, () => {
    const orderData = {
        ...purchaseModel,
        items: cartModel.productIds,
        total: cartModel.totalPrice
    }

    api
        .createOrder(orderData)
        .then((data) => {
            cartModel.clear()
            purchaseModel.clear()
            cartIconView.counterValue = cartModel.products.length

            purchaseSuccessMessageView.createdOrderData = data
            popupView.content = purchaseSuccessMessageView.render()
        })
})

// Init application
api
    .getProductsList()
    .then((products: IProduct[]) => {
        catalogModel.products = products

        const productNodes: HTMLElement[] = [];

        catalogModel
            .products
            .map((product: IProduct) => {
                const productView = new CatalogItemView(cloneTemplate("#card-catalog"), events);
                productView.product = product
                productNodes.push(productView.render())
            })

        catalogView.items = productNodes;
    })