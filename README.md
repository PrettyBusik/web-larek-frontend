# Документация

## Типы данных

### Основные типы данных

```typescript
export type TProductCategory = 'софт-скил' | 'кнопка' | 'другое' | 'дополнительное' | 'хард-скил'
```

Представляет варианты значения для типа товара

```typescript
export interface IProduct {
    id: string
    description: string
    image: string
    title: string
    category: TProductCategory
    price: number
}
```

Представляет информацию о товаре

```typescript
export interface IOrder {
    id: string
    totalPrice: number
}
```

Представляет информацию о созданном заказе, которую возвращает сервер

### Вспомогательные типы данных

```typescript
export type TPaymentType = 'онлайн' | 'при получении'
```

Представляет варианты значения для способов оплаты

```typescript
export interface IDeliveryAndPayment {
    paymentType: TPaymentType
    address: string
}
```

Представляет информацию о способе оплаты и адресе доставки (первый шаг формы оформления заказа)

```typescript
export interface IContacts {
    email: string
    phone: string
}
```

Представляет информацию о контактах (второй шаг формы оформления заказа)

```typescript
export interface IOrderCreationData extends IDeliveryAndPayment, IContacts {
    products: IProduct[]
}
```

Представляет информацию об оформляемом заказе (данные формы оформления заказа)

```typescript
export type TValidationErrors<T> = Partial<Record<keyof T, string>>
```

Представляет собой информацию об ошибках валидации

## Модели

```typescript
export class CatalogModel {
    private productsList: IProduct[] = []

    /**
     * Метод для установки в модель списка товаров
     */
    get products(): IProduct[] { }

    /**
     * Метод для получения из модели списка товаров
     */
    set products(products: IProduct[]) { }
}
```

Модель содержит в себе текущее состояние каталога товаров

```typescript
export class CartModel {
    private productsList: IProduct[] = []

    /**
     * Возвращает общую стоимость всех товаров в корзине
     */
    get totalPrice(): number { }

    /**
     * Возвращает список товаров в корзине
     */
    get products(): IProduct[] { }

    /**
     * Добавляет новый товар в корзину
     */
    addProduct(product: IProduct): void { }

    /**
     * Удаляет указанный товар из корзины
     */
    removeProduct(product: IProduct): void { }
}
```

Модель содержит в себе текущее состояние корзины

```typescript
export class OrderFormModel {
    /**
     * Устанавливает в модель информацию о списке товаров, выбранных для покупки и их
     */
    set products(data: IProduct[]) { }

    /**
     * Устанавливает в модель информацию о способе доставки и оплате
     */
    set deliveryAndPayment(data: IDeliveryAndPayment) { }

    /**
     * Валидирует информацию о способе доставки и оплате
     */
    validateDeliveryAndPayment(data: IDeliveryAndPayment): TValidationErrors<IDeliveryAndPayment> | null { }

    /**
     * Устанавливает в модель информацию о контатах
     */
    set contacts(data: IContacts) { }

    /**
     * Валидирует информацию о контатах
     */
    validateContacts(data: IContacts): TValidationErrors<IContacts> | null { }

    /**
     * На основании информации в модели генерирует и возвращает объект, содержащий в себе всю информацию о заказа для его создания
     */
    get orderCreationData(): IOrderCreationData { }
}
```

Модель для работы формы оформления заказа

## Представления

### Базовые представления

```typescript
export abstract class BaseView{
    /**
     * Констурктор принимает html верстку для представления и объект менеджера событий
     */
    constructor(container: HTMLElement, eventsManager: EventEmitter) { }

    /**
     * Возвращает корневой html элемент представяления для рендера его на странице/в другом представлении
     */
    render(): HTMLElement { }
}
```

Базовое представление

```typescript
export abstract class BaseModalView extends BaseView {
    /**
     * Показыает окно (делает его видимым)
     */
    show(): void { }

    /**
     * Скрывает окно (делает его невидимым)
     */
    hide(): void { }
}
```

Базовое представление для всплывающих окон

### Представления каталога

```typescript
export class CatalogItemView extends BaseView{
    /**
     * Устанавливает товар, который это представление должно отображать и который должно пробрасывать в события
     */
    set product(product: IProduct) { }
}
```

Плитка одного товара в каталоге. Представляет информацию об одном товаре

```typescript
export class CatalogView extends BaseView{
    /**
     * Устанавливает список предствлений-товаров, которые должны быть в этом каталоге
     */
    set items(items:CatalogItemView) { }
}
```

Каталог - список товаров в виде плиток

```typescript
export class ProductInformationView extends BaseModalView{
    /**
     * Устанавливает товар, который это представление должно отображать и который должно пробрасывать в события
     */
    set product(product:IProduct){ }
}
```

Попап с полной информацией о товаре

### Представления корзины

```typescript
export class CartItemView extends BaseView {
    /**
     * Устанавливает товар, который это представление должно отображать и который должно пробрасывать в события
     */
    set product(product: IProduct) { }

    /**
     * Устанавливает порядковый номер элемента в списке для отображения его в левой колонке
     */
    set position(position: number) { }
}
```

Строчка в корзине. Представляет информацию об одной конкретной позиции в корзине

```typescript
export class CartView extends BaseModalView {
    /**
     * Устанавливает список предствлений-товаров, которые должны быть в этой корзине
     */
    set items(items: CartItemView[]) { }

    /**
     * Устанавливает итоговую цену для всех товаров в корзине
     */
    set totalPrice(totalPrice: number) { }
}
```
Попап с информацией о корзине и товарах в ней

```typescript
export class CartIconView extends BaseView {
    /**
     * Устанавливает количество товаров в корзине
     */
    set productsNumber(productsNumber: number) { }
}
```

Иконка корзины в шапке сайта, которая отображает количество товаров в корзине

### Представления оформления заказа

```typescript
class BaseFormStemView extends BaseModalView {
    /**
     * Делает кнопку "далее" активной
     */
    enableContinuieButton() { }
    
    /**
     * Делает кнопку "далее" неактивной
     */
    disableContinuieButton() { }
}
```

```typescript
class DeliveryAndPaymentFormView extends BaseFormStemView {
    /**
     * Устанавливает значения полей формы
     */
    set data(data: IDeliveryAndPayment) { }

    /**
     * Устанавливает ошбики валидации
     */
    set validationErrors(errors: TValidationErrors<IDeliveryAndPayment> | null) { }
}
```

Первый шаг формы - ввод адреса и способа оплаты

```typescript
class ContactsFormView extends BaseFormStemView {
    /**
     * Устанавливает значения полей формы
     */
    set data(data: IContacts) { }

    /**
     * Устанавливает ошбики валидации
     */
    set validationErrors(errors: TValidationErrors<IContacts> | null) { }
}
```

Второй шаг формы - ввод контактов

```typescript
class CreatedOrderInformationView extends BaseModalView {
    /**
     * Устанавливает значения о созданном заказе
     */
    set data(data: IOrder) { }
}
```

Окно с информацией об успешно созданном заказе

## События

- `product-info:show` - Тригерится при клике на товар в каталоге. Открывает попап с информацией о товаре. Содержит в себе объект `IProduct`, на который был произведен клик и который надо показать.
- `product-info:hide` - Тригерится при клике на крестик в попапе просмотра информации о товаре. Закрывает попап.
-
- `cart:show` - тригерится при клике на кнопку иконку корзины в шапке сайта. Открывает попап с корзиной.
- `cart:hide` - Тригерится при клике на крестик в попапе корзины. Закрывает попап.
- `cart:add-product` - Тригерится при клике на кнопку "купать" в карточке товара. Добавляет этот товар в корзину. Содержит в себе объект `IProduct`, на который был произведен клик и который надо добавить.
- `cart:remove-product` - Тригерится при клике на иконку "удалить" в корзине. Содержит в себе объект `IProduct`, на который был произведен клик и который надо удалить.
-
- `order-manager:start` - Тригерится при клике на кнопку "оформить" в корзине. Запускает процесс оформления заказа. Содержит в себе объект `ICart` с информацией о товарах в корзине. Показывает попап с формой.
- `order-manager:step-1.hide` - Тригерится при клике на крестик в попапе формы. Закрывает попап. Прерывает оформление заказа
- `order-manager:step-1.changed` - Тригерится при изменении значений в полях формы. Содержит в себе объект `IDeliveryAndPayment` с информацией о значениях в форме. Запускает валидацию формы.
- `order-manager:step-1.submit` - Тригерится при нажатии на кнопку "далее" в окне формы. Закрывает попап и открывает попап со вторым шагом
- `order-manager:step-2.hide` - Тригерится при клике на крестик в попапе формы. Закрывает попап. Прерывает оформление заказа
- `order-manager:step-2.changed` - Тригерится при изменении значений в полях формы. Содержит в себе объект `IContacts` с информацией о значениях в форме. Запускает валидацию формы.
- `order-manager:step-2.submit` - Тригерится при нажатии на кнопку "далее" в окне формы. Закрывает попап. Отправляет запрос на сервер для создания заказа.
- `order-manager:order-info.show` - Тригерится после того как на сервере был создан заказ. Показывает попап с сообщением о создании заказа. Содержит в себе объект `IOrder` с информацией о созданном заказе.
- `order-manager:order-info.hide` - Тригерится при клике на крестик в попапе информации  созданном заказе. Закрывает попап.