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

## Архитектура проекта
Раздел описывает общий подход к построению приложения и использование компонентного подхода.

Архитектура данного проекта основана на паттерне MVP, который делит приложение на три компонента: модель, представление и презентер. Модель управляет данными, представление визуализирует эти данные, а презентер обеспечивает взаимодействие между моделью и представлением.

**Model** - отвечает за работу с данными, выполнение расчетов и управление бизнес-процессами, включая получение, обновление и удаление информации.
**View** -  предоставляет пользователю интерфейс и данные из модели. Оно занимается отображением информации, обработкой нажатий кнопок, заполнением и отправкой форм, а также их валидацией.
**Presenter** - выполняет роль промежуточного слоя между моделью и представлением, обрабатывая события.

## Функциональность

- **Просмотр товаров**: Пользователи могут просматривать доступные товары, фильтровать их по категориям и ценам.
- **Корзина**: Возможность добавлять товары в корзину, изменять количество и удалять товары.
- **Оформление заказа**: Пользователи могут оформить заказ, указав свои контактные данные и способ оплаты.
- **Адаптивный дизайн**: Приложение имеет адаптивный интерфейс, который удобно использовать на мобильных и настольных устройствах.

## Классы и интерфейсы
Предоставляет информацию о ключевых классах и интерфейсах, используемых в проекте, и их назначении.

### Классы

1. **`Product`**
   - **Описание**: Класс, представляющий отдельный товар в магазине.
   - **Свойства**:
     - `id: string` — уникальный идентификатор товара.
     - `description: string` — описание товара.
     - `image: string` — URL изображения товара.
     - `title: string` — название товара.
     - `category: string` — категория товара.
     - `price: number | null` — цена товара (может быть `null`, если товар не имеет цены).
     - `selected: boolean` — состояние выбора товара (выбран или нет).

2. **`AppState`**
   - **Описание**: Класс, управляющий состоянием приложения.
   - **Свойства**:
     - `products: Product[]` — массив доступных товаров.
     - `modal: string` — состояние модального окна (например, открыто или закрыто).
     - `basket: Product[]` — массив товаров в корзине.
     - `order: IOrder` — информация о текущем заказе.
     - `formErrors: FormErrors` — ошибки формы при заполнении.
   - **Методы**:
     - `addToBasket(value: Product)`: добавляет товар в корзину.
     - `deleteFromBasket(id: string)`: удаляет товар из корзины по ID.
     - `clearBasket()`: очищает корзину.
     - `getBasketTotal()`: возвращает общее количество товаров в корзине.
     - `setItems()`: устанавливает товары для текущего заказа.
     - `setOrderField(field: keyof IOrderData, value: string)`: устанавливает поля заказа.
     - `validateOrder()`: валидирует поля заказа и устанавливает ошибки формы.
     - `validateContacts()`: валидирует контактные данные.
     - `refreshOrder()`: сбрасывает данные заказа.
     - `getTotal()`: возвращает общую сумму товаров в корзине.
     - `setCatalog(items: ProductApiData[])`: устанавливает каталог товаров.
     - `resetSelected()`: сбрасывает выбор у всех товаров.

3. **`Contacts`**
   - **Описание**: Класс для обработки данных о контактах пользователя.
   - **Свойства**: Наследует от `FormHandler<IContacts>`.
   - **Методы**: Унаследованные методы для обработки формы.

4. **`Card`**
   - **Описание**: Базовый класс для карточек товаров.
   - **Свойства**:
     - `protected _title: HTMLElement` — элемент заголовка карточки.
     - `protected _image: HTMLImageElement` — элемент изображения карточки.
     - `protected _category: HTMLElement` — элемент категории карточки.
     - `protected _price: HTMLElement` — элемент цены карточки.
     - `protected _button: HTMLButtonElement` — элемент кнопки действия.
   - **Методы**:
     - `set id(value: string)`: устанавливает ID карточки.
     - `get id(): string`: получает ID карточки.
     - `set title(value: string)`: устанавливает заголовок карточки.
     - `get title(): string`: получает заголовок карточки.
     - `set image(value: string)`: устанавливает изображение карточки.
     - `set selected(value: boolean)`: устанавливает состояние выбора карточки.
     - `set price(value: number | null)`: устанавливает цену карточки.
     - `set category(value: CategoryType)`: устанавливает категорию карточки.

5. **`CatalogItem`**
   - **Описание**: Класс для представления товара в каталоге.
   - **Методы**: Унаследованные методы от класса `Card`.

6. **`CatalogItemPreview`**
   - **Описание**: Класс для предварительного просмотра товара в каталоге.
   - **Свойства**:
     - `protected _description: HTMLElement` — элемент описания товара.
   - **Методы**:
     - `set description(value: string)`: устанавливает описание товара.

### Интерфейсы

1. **`IContacts`**
   - **Описание**: Определяет структуру данных для контактной информации пользователя.
   - **Свойства**:
     - `phone: string` — номер телефона.
     - `email: string` — адрес электронной почты.

2. **`ICard`**
   - **Описание**: Определяет структуру данных для карточки товара.
   - **Свойства**:
     - `id: string` — уникальный идентификатор товара.
     - `title: string` — название товара.
     - `category: string` — категория товара.
     - `description: string` — описание товара.
     - `image: string` — URL изображения товара.
     - `price: number | null` — цена товара.
     - `selected: boolean` — состояние выбора товара.

3. **`IAppState`**
   - **Описание**: Определяет структуру состояния приложения.
   - **Свойства**:
     - `products: Product[]` — список товаров.
     - `modal: string` — состояние модального окна.
     - `basket: Product[]` — массив товаров в корзине.
     - `order: IOrder` — текущий заказ.

4. **`ICardActions`**
   - **Описание**: Определяет действия, связанные с карточками товаров.
   - **Свойства**:
     - `onClick: (event: MouseEvent) => void` — функция для обработки события клика.

5. **`IOrder`**
   - **Описание**: Определяет структуру заказа.
   - **Свойства**:
     - `products: string[]` — массив идентификаторов товаров в заказе.
     - `paymentMethod: string` — способ оплаты (например, "Card" или "Cash").
     - `totalAmount: number | null` — общая сумма заказа.
     - `adress: string` — адрес доставки.
     - `email: string` — адрес электронной почты покупателя.
     - `phone: string` — номер телефона покупателя.

6. **`FormErrors`**
   - **Описание**: Определяет структуру ошибок формы.
   - **Свойства**:
     - `email?: string` — ошибка для поля email.
     - `phone?: string` — ошибка для поля телефона.
     - `adress?: string` — ошибка для поля адреса.
     - `paymentMethod?: string` — ошибка для поля способа оплаты.

## Взаимодействие компонентов
Объясняет, как компоненты общаются между собой и как происходит обновление состояния приложения.
Компоненты взаимодействуют друг с другом через события и методы. Например, когда пользователь добавляет товар в корзину, соответствующее событие отправляется в `AppState`, который обновляет состояние приложения и уведомляет другие компоненты о произошедших изменениях.

Основной поток взаимодействия следующий:

1. Пользователь взаимодействует с компонентами интерфейса (например, нажимает кнопку добавления товара).
2. Компонент инициирует действие (например, добавление товара в корзину), которое обрабатывается в классе `AppState`.
3. `AppState` обновляет состояние приложения и вызывает соответствующие события.
4. Подписанные компоненты реагируют на события и обновляют свое состояние (например, обновляют количество товаров в корзине).

