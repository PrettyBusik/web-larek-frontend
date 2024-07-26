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
Используется архитектура MVP

M - Модели. Классы, которые описывают в себе бизнес-логику приложения изолированно от представления.

V - Представления. Классы, которые дают возможность отображать информацию так, чтобы скрыть детали реализации движка от бизнес-логики. Не содержат в себе никакой логики.

P - Презентер. Часть приложения, которая отвечает за связь моделей и представлений. Обычно представлен, как и остальные слои в виде отдельных классов, но в данном проекте вся логика презентера лежит в одном общем файле index.ts.
Логика работы следующая. Если евент менеджет. Представления бросают в него события когда что-то изменилось (пользователь провзаимодействовал с ними) и требуется какая-то реакция приложения. Презентер подписывается на эти события и 
реагирует на них. Он может изменить данные в модели, перерисовать представление, скрыть или показать другое представление. Так же презентер запрашивает с сервера список товаров через API и передает из в модели.
Таким образом мы имеем изолированную бизнес-логику, которые ничего не знает о том, как она будет отображаться. Есть представление, которое умеет выводить конкретную информацию, которая была ему передана, и ничего не знает о моделях. 
И есть презентер, которые соединяет эти два слоя и организует их слаженную работу.

# Документация

## Типы данных

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
interface ICart {
    products: IProduct[];
    totalAmountOfProducts: number;
    totalSum: number;
}
```

Представляет информацию о корзине и ее текущем состоянии

```typescript
interface ICreatedOrderData {
    total: number
}
```

Представляет информацию о созданном заказе, которую возвращает сервер

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
    items: string[]
    total: number
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
    constructor(cdn: string, baseUrl: string, options?: RequestInit) { }
    
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
    createOrder(data: IOrderCreationData): Promise<ICreatedOrderData> { }
}
```

## Модели

#### Модель `CatalogModel`

Модель содержит в себе текущее состояние каталога товаров.

```typescript
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
    getProductById(id: number): IProduct | null { }
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
     * Возвращает список ID товаров в корзине
     */
    get productIds(): string[] { }
    
    /**
     * Возвращает список товаров в корзине
     */
    get products(): IProduct[] { }

    /**
     * Добавляет новый товар в корзину
     */
    addProduct(product: IProduct): void { }

    /**
     * Удаляет указанный товар из корзины по его ID
     */
    removeProduct(productId: string): void { }

    /**
     * Удаляет из корзины все товары. Используется чтобы очистить корзину после оформления заказа
     */
    clear(): void { }
}
```


### Модель `OrderFormModel`

Модель для работы формы оформления заказа

```typescript
class PurchaseModel implements IDeliveryAndPayment, IContacts {
    /**
     * Выбранный тип оплаты
     */
    payment: TPaymentType = 'card'
    
    /**
     * Указанный адрес доставки
     */
    address = ''
    
    /**
     * Указанный email
     */
    email = ''
    
    /**
     * Указанный номер телефона
     */
    phone = ''

    /**
     * Возвращает значения для полей доставки и способа оплаты. Используется для заполнения первого шага формы
     */
    get deliveryAndPayment(): IDeliveryAndPayment { }

    /**
     * Возвращает значения для полей контактов. Используется для заполнения второго шага формы
     */
    get contacts(): IContacts {}

    /**
     * Метод вызывается при вводе значения в поле ввода формы. Обновляет соответствующее поле модели
     */
    updateData(data: Partial<IDeliveryAndPayment> | Partial<IContacts>): void {}

    /**
     * Валидирует текущие значения способа оплат и адреса доставки
     * Возвращает список ошибок
     */
    validateDeliveryAndPayment(): TValidationErrors<IDeliveryAndPayment> | null {}

    /**
     * Валидирует текущие значения контактов
     * Возвращает список ошибок
     */
    validateContacts(): TValidationErrors<IContacts> | null {}

    /**
     * Очищает модель.
     * Удаляет значения из всех полей чтобы можно было начать заполненение заного
     */
    clear(): void { }
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
     * Констурктор принимает html верстку для представления
     */
    constructor(container: HTMLElementr) { }

    /**
     * Возвращает корневой html элемент представяления для рендера его на странице/в другом представлении
     */
    render(): HTMLElement { }
}
```

#### Представление `PopupView`

Представление для работы модельного окна. Позволяет размещать внутри любую информацию и управлять видимостью попапа независимо от содержимого

```typescript
class PopupView extends BaseView {
    /**
     * Кнопка закрытия модельного окна
     */
    private closeButtonNode: HTMLButtonElement;
    /**
     * Содержимое модального окна
     */
    private contentNode: BaseView

    /**
     * Устанавливает значение, которое должно быть отрендерино внутри этого модельного окна.
     */
    set content(content: HTMLElement) { }
    
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
#### Представление `BaseProductView`

Базовое представление товара. Содержит в себе общие поля и методы

```typescript
abstract class BaseProductView extends BaseView {
    /**
     * Название товара
     */
    protected readonly titleNode: HTMLElement;
    /**
     * цена
     */
    protected readonly priceNode: HTMLElement;
    /**
     * ID товара
     */
    protected productId: string;

    /**
     * Констурктор принимает html верстку для представления и евент-менеджер
     */
    constructor(container: HTMLElement, protected events: IEvents) { }
    
    /**
     * Сеттер для установки товара, который должен отобрадаться
     */
    set product(product: IProduct) { }
}
```


### Представления каталога


#### Представление `CatalogView`

Каталог - список товаров в виде плиток

```typescript
class CatalogView extends BaseView{

    /**
     * Устанавливает элементы, которые должны отображатся внутри представления
     */
    set items(items: HTMLElement[]) { }
}
```

#### Представление `BaseCatalogProductView`

Базовый класс для представлений товара в каталоге. Расширяет базовое представление товара и добавляет доп. поля и функционал

```typescript
class CatalogItemView extends BaseView{
    /**
     * Категория товара
     */
    protected readonly categoryNode: HTMLElement;
    /**
     * Избражение товара
     */
    protected readonly imageNode: HTMLImageElement;

    /**
     * Констурктор вызывает базовый конструктор и инициализирует поля своего класса
     */
    constructor(container: HTMLElement, events: IEvents) {}

    /**
     * Сеттер для установки товара, который должен отобрадаться.
     * Вызывает родительской метод и так же устанавливает значения для полей своего класса
     */
    set product(product: IProduct) {}
}
```

#### Представление `CatalogItemView`

Карточка товара в каталоге с краткой информацией о товаре.

```typescript
class CatalogItemView extends BaseCatalogProductView {
    /**
     * Констурктор вызывает базовый конструктор и уснанавливает логику вызова событий
     */
    constructor(container: HTMLElement, events: IEvents) {}
}
```

#### Представление `ProductPreviewView`

Карточка с полной информацией о товаре (показывается в попапе). В отличие от карточки в каталоге, эта содержит доп поля и бросает другие события

```typescript
class ProductPreviewView extends BaseCatalogProductView {
    /**
     * Описание товара
     */
    private readonly descriptionNode: HTMLElement
   
    /**
     * Кнопка добавления в корзину
     */
    private readonly addToCartButtonNode: HTMLButtonElement
   
    /**
     * Констурктор вызывает базовый конструктор и уснанавливает логику вызова событий.
     * Так же инициализирует поля своего класса
     */
    constructor(container: HTMLElement, events: IEvents) {}
    
    /**
     * Устанавливает товар для отображения
     */
    set product(product: IProduct) {}
    
    /**
     * Включает/выключает кнопку добавления в корзину
     */
    toggleAddToCartButton(enable:boolean){}
}
```

### Представления корзины

#### Представление `CartItemView`

Строчка в корзине. Представляет информацию об одной конкретной позиции в корзине. Расширяет базовое представление товара

```typescript
class CartItemView extends BaseProductView {
    /**
     * Порядковый номер записи в списке
     */
    private readonly indexNode: HTMLElement
    /**
     * Кнопка удаления из корзины
     */
    private readonly removeButtonNode: HTMLButtonElement;

    /**
     * Констурктор вызывает базовый конструктор и уснанавливает логику вызова событий.
     * Так же инициализирует поля своего класса
     */
    constructor(container: HTMLElement, events: IEvents) {}

    /**
     * Устанавливает порядковый номер записи в списке
     */
    set index(index:number){
        this.setText(this.indexNode,String(index))
    }
}
```

#### Представление `CartView`

Представление с содержимым корзины. Показывается в попапе.

```typescript
class CartView extends BaseView {
    /**
     * Список товаров в корзине
     */
    private readonly itemsListNode: HTMLElement;
    
    /**
     * Итоговая цена
     */
    private readonly totalPriceNode: HTMLElement;
    
    /**
     * кнопка перехода к оформлению заказа
     */
    private readonly submitButton: HTMLButtonElement;

    /**
     * Констурктор вызывает базовый конструктор и уснанавливает логику вызова событий.
     * Так же инициализирует поля своего класса
     */
    constructor(container: HTMLElement, events: IEvents) { }

    /**
     * Устанавливает элементы для отображения
     */
    set items(items: HTMLElement[]) { }

    /**
     * Устанавливает итоговую цену
     */
    set totalPrice(totalPrice: number) { }

    /**
     * Включает/выключает кнопку
     */
    toggleSubmitButton(enable: boolean): void { }
}
```

#### Представление `CartView`

Иконка корзины в шапке сайта, которая отображает количество товаров в корзине

```typescript
class CartIconView extends BaseView {
    /**
     * HTML нода с иконкой, на которой отображается число товаров
     */
    private counterNode: HTMLElement

    /**
     * Констурктор вызывает базовый конструктор и уснанавливает логику вызова событий.
     * Так же инициализирует поля своего класса
     */
    constructor(container: HTMLElement, events: IEvents) { }
    
    /**
     * Устанавливает количество товаров в корзине
     */
    set counterValue(counter: number) { }
}
```

### Представления оформления заказа

#### Представление `BaseStepView`

Базовое представление для шага формы. В качестве дженерик-типа принимает тип данных, с которыми работает форма

```typescript
abstract class BaseStepView<DataType> extends BaseView {
    /**
     * Элемент с ошибками валидации
     */
    protected readonly validationErrorsNode: HTMLElement;
    /**
     * Кнопка перехода к следующему шаге
     */
    protected readonly submitButton: HTMLButtonElement;

    /**
     * Абстрактный метод для установки значений в поля ввода
     */
    abstract set values(data: DataType);

    /**
     * Абстрактный метод для установки ошибок валидации
     */
    abstract set validationErrors(data: TValidationErrors<DataType>);

    /**
     * Констурктор вызывает базовый конструктор инициализирует поля своего класса
     */
    constructor(container: HTMLElement) { }

    /**
     * Включает/выключает кнопку перехода к следюущему шагу
     */
    toggleSubmitButton(enable: boolean): void {}
}
```

#### Представление `Step1View`

Первый шаг формы - ввод адреса и способа оплаты

```typescript

 class Step1View extends BaseStepView<IDeliveryAndPayment> {
    /**
     * Кнопка выбора оплаты картой
     */
    private readonly cardPaymentMethodNodes: HTMLButtonElement;
    
    /**
     * Кнопка выбора оплаты наличкой
     */
    private readonly cashPaymentMethodNodes: HTMLButtonElement;
    
    /**
     * Поле ввода адреса
     */
    private readonly addressNode: HTMLInputElement;

    /**
     * Констурктор вызывает базовый конструктор и уснанавливает логику вызова событий.
     * Так же инициализирует поля своего класса
     */
    constructor(container: HTMLElement, events: IEvents) {}

    /**
     * Устанавливает значения для полей ввода
     */
    set values(data: IDeliveryAndPayment) { }

    /**
     * Устанавливает ошибки валидации
     */
    set validationErrors(errors: TValidationErrors<IDeliveryAndPayment> | null) {}
}
```

#### Представление `Step2View`

Второй шаг формы - ввод контактов

```typescript

class Step2View extends BaseStepView<IDeliveryAndPayment> {
    /**
     * Поле ввода почты
     */
    private readonly emailNode: HTMLButtonElement;

    /**
     * Поле ввода телефона
     */
    private readonly phoneNode: HTMLButtonElement;

    /**
     * Констурктор вызывает базовый конструктор и уснанавливает логику вызова событий.
     * Так же инициализирует поля своего класса
     */
    constructor(container: HTMLElement, events: IEvents) {}

    /**
     * Устанавливает значения для полей ввода
     */
    set values(data: IDeliveryAndPayment) { }

    /**
     * Устанавливает ошибки валидации
     */
    set validationErrors(errors: TValidationErrors<IDeliveryAndPayment> | null) {}
}
```

#### Представление `SuccessMessageView`

Окно с информацией об успешно созданном заказе

```typescript
class SuccessMessageView extends BaseView {
    /**
     * элемент с итоговой ценой
     */
    private readonly priceNode: HTMLElement;
    /**
     * кнопка завершения
     */
    private readonly submitButtonNode: HTMLButtonElement;

    /**
     * Констурктор вызывает базовый конструктор и уснанавливает логику вызова событий.
     * Так же инициализирует поля своего класса
     */
    constructor(container: HTMLElement, events: IEvents) {}
    
    /**
     * Устанавливает значения в представление
     */
    set createdOrderData(data: ICreatedOrderData) {}
}
```

## События

- `popup.show` - Показать попап
- `popup.hide` - Скрыть попап
---
- `product.showPreview` - Показать полную информацию о товаре
---
- `cart.show` - Показать корзину
- `cart.addProduct` - Добавить товар в корзину
- `cart.removeProduct` - Удалить товар из корзины
---
- `purchase.step1.show` - Показать первый шаг оформления заказа
- `purchase.step1.handleChanges` - Значение в форме первого шага были изменены. Надо их обработать
- `purchase.step1.submit` - Завершить первый шаг оформления заказа. Перейти ко второму
---
- `purchase.step2.handleChanges` - Значение в форме второго шага были изменены. Надо их обработать
- `purchase.step2.submit` - Завершить второй шаг оформления заказа. Создать заказ
