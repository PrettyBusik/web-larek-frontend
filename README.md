# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Об архитектуре
Класс **EventEmitter** используется для управления событиями в различных компонентах.
Класс **RestApi** используется  для выполнения запросов к серверу.
Интерфейсы данных описывают структуру типов, которые используются в приложении.
Модели описывают в себе бизнес-логику приложения изолированно от движка.
Представления дают возможность отображать информацию так, чтобы скрыть детали реализации движка от бизнес-логики.
Эта архитектура предоставляет структурированный подход к разработке клиентской части веб-приложения, обеспечивая модульность, переиспользуемость и управляемость кода.

Модели и представления общаются друг в другом через события при помощи класса EventEmitter.
# Документация

## Типы данных

### Основные типы данных

Эти типы данных используются повсеместно в проекте и являются общими.

```typescript
type TProductCategory = 'софт-скил' | 'кнопка' | 'другое' | 'дополнительное' | 'хард-скил'
```

Представляет варианты значения для типа товара

```typescript
interface IProduct {
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
interface IOrder {
    id: string
    totalPrice: number
}
```

Представляет информацию о созданном заказе, которую возвращает сервер

### Вспомогательные типы данных

```typescript
type TPaymentType = 'онлайн' | 'при получении'
```

Представляет варианты значения для способов оплаты. Используется в форме создания заказа.

```typescript
interface IDeliveryAndPayment {
    paymentType: TPaymentType
    address: string
}
```

Представляет информацию о способе оплаты и адресе доставки. Используется в форме создания заказа на первом шаге.

```typescript
interface IContacts {
    email: string
    phone: string
}
```

Представляет информацию о контактах. Используется в форме создания заказа на втором шаге.

```typescript
interface IOrderCreationData extends IDeliveryAndPayment, IContacts {
    products: IProduct[]
}
```

Представляет информацию об оформляемом заказе. Используется для передачи данных из формы оформления заказа через API на сервер.

```typescript
type TValidationErrors<T> = Partial<Record<keyof T, string>>
```

Представляет собой информацию об ошибках валидации. Универсальный тип для использования в форме оформления заказа на обоих шагах.

## Сервисы

#### Сервис `RestApi`

Это класс для взаимодействия с серверным API.

```typescript
class RestApi extends Api {
    /**
     * Поле в котором храниться базовый url для всех медий-файлов чтобы методы возвращали абсолютные ссылки на изображения
     */
    private readonly cdn: string;

    /**
     * Констректор.
     * Вызывает базовый конструктор чтобы настроить url сервера для отправки запросов.
     * Так же дополнительно принимает базовый url медиа файлов
     */
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    
    /**
     * Получает с сервера информацию о товаре по его id
     */
    getProduct(id: number):Promise<IProduct> { }
    
    /**
     * Получает с сервера список товаров
     */
    getProductsList(): Promise<IProduct[]> { }

    /**
     * Отправляет на сервер инфомрацию для создания заказа. В ответ возвращает объект созданного заказа
     */
    createOrder(data: IOrderCreationData): Promise<IOrder> { }
}
```

## Модели

#### Модель `CatalogModel`

Модель содержит в себе текущее состояние каталога товаров.

```typescript
import {IProduct} from "./index";

class CatalogModel {
    /**
     * Список товаров, которые сейчас необходимо отобразить в каталоге
     */
    private productsList: IProduct[] = []

    /**
     * Метод для установки в модель списка товаров
     */
    get products(): IProduct[] { }

    /**
     * Метод для получения из модели списка товаров
     */
    set products(products: IProduct[]) { }

    /**
     * Метод для получения из модели одного товара по его id
     */
    getProduct(id: number): IProduct{ }
}
```

#### Модель `CartModel`

Модель содержит в себе текущее состояние корзины

```typescript
class CartModel {
    /**
     * Список товаров, которые пользователь добавил в корзину
     */
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

    /**
     * Возвращает список id товаров, которые находятся в корзине
     */
    getProductIds(): number[] { }
}
```


### Модель `OrderFormModel`

Модель для работы формы оформления заказа

```typescript
class OrderFormModel {
    /**
     * Текущая информация о достаке и оплате из формы
     */
    private deliveryAndPaymentData: IDeliveryAndPayment
    
    /**
     * Текущая информация о контактах из формы
     */
    private contactsData: IContacts
    
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


## Представления

### Общие представления

#### Представление `BaseView`

Базовое представление. Абстрактный родитель всех представлений, содержащий в себе общий функционал.

```typescript
abstract class BaseView {
    /**
     * HTML нода, которая является внешней для верстки данного представляения
     */
    protected container: HTMLElement

    /**
     * Менеджер событий для взаимодействия с остальной частью приложения
     */
    protected eventsManager: EventEmitter
    
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

#### Представление `ModalView`

Представление для работы модельного окна. Позволяет размещать внутри любую информацию и управлять видимостью попапа независимо от содержимого

```typescript
class ModalView extends BaseView {
    /**
     * Кнопка закрытия модельного окна
     */
    private closeButton: HTMLButtonElement;
    /**
     * Содержимое модального окна
     */
    private content: BaseView

    /**
     * Устанавливает представление, которое должно быть отрендерино внутри этого модельного окна.
     */
    set content(view: BaseView) { }
    
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


### Представления каталога

#### Представление `CatalogItemView`

Плитка одного товара в каталоге. Представляет информацию об одном товаре

```typescript
class CatalogItemView extends BaseView{
    /**
     * HTML нода с заголовков товара
     */
    private title: HTMLElement
    
    /**
     * HTML нода с описания товара
     */
    private description: HTMLElement

    /**
     * HTML нода с цены товара
     */
    private price: HTMLElement

    /**
     * HTML нода с картинкой товара
     */
    private image: HTMLImageElement

    /**
     * HTML нода с кнопкой "купить"
     */
    private byeButton: HTMLButtonElement
    
    /**
     * Товар, который сейчас отображает представление
     */
    private _product: IProduct

    /**
     * Признак того, должно ли представлени отобажать полную информацию о товаре (с описанием и кропкой "купить") или же сокращенное (для списка товаров)
     */
    private isFull:boolean
    
    /**
     * Устанавливает товар, который это представление должно отображать и который должно пробрасывать в события
     */
    set product(product: IProduct) { }


    /**
     * Сеттре для поля isFull
     */
    set showFullInfo(full: boolean) { }
}
```

#### Представление `CatalogView`

Каталог - список товаров в виде плиток

```typescript
class CatalogView extends BaseView{
    /**
     * Список представлений-товаров, которые должны отображаться внутри этого каталога
     */
    private content: CatalogItemView[]
    
    /**
     * Устанавливает список предствлений-товаров, которые должны быть в этом каталоге
     */
    set items(items:CatalogItemView) { }
}
```

### Представления корзины

#### Представление `CartItemView`

Строчка в корзине. Представляет информацию об одной конкретной позиции в корзине

```typescript
class CartItemView extends BaseView {
    /**
     * HTML нода с заголовков товара
     */
    private titleNode: HTMLElement
    /**
     * HTML нода с порядковым номером товара в списке
     */
    private positionNode: HTMLElement
    /**
     * HTML нода с ценой товара
     */
    private priceNode: HTMLElement
    /**
     * HTML нода с кнопкой удаленния товара из корзины
     */
    private removeButtonNode: HTMLElement
    /**
     * Товар, который отображает данное представление
     */
    private _product: IProduct
    /**
     * Позиция в списке, которую отображает данное представление
     */
    private _position: number
    
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

#### Представление `CartView`

Корзина

```typescript
class CartView extends BaseView {
    /**
     * HTML нода с кнопкой "оформить"
     */
    private submitButtonNode:HTMLElement
    /**
     * Список представлений-товаров, которые должны отображаться внутри этой корзины
     */
    private content: CartItemView[]

    /**
     * Итоговая цена, которая должна отображаться
     */
    private price: number
    
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

#### Представление `CartIconView`

Иконка корзины в шапке сайта, которая отображает количество товаров в корзине

```typescript
class CartIconView extends BaseView {
    /**
     * HTML нода с иконкой, на которой отображается число товаров
     */
    private counterNode: HTMLElement
    
    /**
     * количество товаров
     */
    private _productsNumber: number
    
    /**
     * Устанавливает количество товаров в корзине
     */
    set productsNumber(productsNumber: number) { }
}
```

### Представления оформления заказа

#### Представление `BaseFormView`

Базовое представление формы заказа. Общее для всех шагов оформления заказа

```typescript
class BaseFormView extends BaseView {
    /**
     * HTML нода с кнопкой "далее"
     */
    private continuieButtonNode:HTMLElement
    
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

#### Представление `DeliveryAndPaymentFormView`

Первый шаг формы - ввод адреса и способа оплаты

```typescript
class DeliveryAndPaymentFormView extends BaseFormView {
    /**
     * Текущие значения полей формы
     */
    private _data:IDeliveryAndPayment
    /**
     * Текущие ошибки валиадации
     */
    private _errors:TValidationErrors<IDeliveryAndPayment> | null
    
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

#### Представление `ContactsFormView`

Второй шаг формы - ввод контактов

```typescript
class ContactsFormView extends BaseFormView {
    /**
     * Текущие значения полей формы
     */
    private _data:IContacts
    /**
     * Текущие ошибки валиадации
     */
    private _errors:TValidationErrors<IContacts> | null
    
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

#### Представление `CreatedOrderInformationView`

Окно с информацией об успешно созданном заказе

```typescript
class CreatedOrderInformationView extends BaseView {
    /**
     * Объект заказа, информация о котором отображается сейчас в представлении
     */
    private _data:IOrder
    
    /**
     * Устанавливает значения о созданном заказе
     */
    set data(data: IOrder) { }
}
```

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