import { IEvents } from "../base/events";
import { Component } from "../base/Component";
import { ProductApiData } from "../../types";

/**
 * Интерфейс описывает структуру данных корзины, которая включает:
 1. Список элементов корзины (items) в виде массива HTML-элементов.
 2. Общую цену всех товаров в корзине (totalPrice).
 */
export interface IBasketData {
  items: HTMLElement[];
  totalPrice: number;
}

/**
 * Класс ShoppingCart реализует корзину покупок, наследуя базовые функциональности из класса Component, который принимает данные типа IBasketData.
 */
export class ShoppingCart extends Component<IBasketData> {
  // Приватные свойства, которые будут содержать ссылки на DOM-элементы:
  // itemList — список товаров в корзине,
  // total — элемент, отображающий общую сумму корзины,
  // orderButton — кнопка оформления заказа.
  private itemList: HTMLElement;
  private total: HTMLElement;
  private orderButton: HTMLButtonElement;


  // Конструктор принимает:
  // 1. Префикс классов для поиска элементов в DOM (classPrefix),
  // 2. Корневой элемент корзины (rootElement),
  // 3. Объект событий (customEvents) для обработки кастомных событий, например, события checkout.
  constructor(
    private classPrefix: string,
    rootElement: HTMLElement,
    private customEvents: IEvents
  ) {
    // Вызов конструктора родительского класса Component с корневым элементом.
    super(rootElement);

    // Инициализация элементов корзины через поиск их в DOM по classPrefix.
    this.orderButton = rootElement.querySelector(`.${classPrefix}__button`);
    this.total = rootElement.querySelector(`.${classPrefix}__price`);
    this.itemList = rootElement.querySelector(`.${classPrefix}__list`);

    // Добавление обработчика события "click" для кнопки заказа, который
    // вызывает кастомное событие 'basket:checkout', если кнопка найдена.
    if (this.orderButton) {
      this.orderButton.addEventListener('click', () => 
        this.customEvents.emit('basket:checkout')
      );
    }
  }

  // Сеттер для установки общей стоимости товаров в корзине.
  // Обновляет текстовое содержимое элемента total.
  set totalPrice(price: number) {
    this.setText(this.total, price + ' синапсов')
  }

  // Сеттер для установки списка товаров.
  // Заменяет содержимое элемента itemList на новый список элементов.
  // Если список пуст, кнопка заказа блокируется.
  set items(elements: HTMLElement[]) {
    this.itemList.replaceChildren(...elements);
    // this.orderButton.disabled = elements.length === 0;
    this.setDisabled(this.orderButton, elements.length === 0);
  }

  // Метод для ручной блокировки кнопки заказа.
  disableOrderButton() {
    this.setDisabled(this.orderButton, true)
    // this.orderButton.disabled = true;
  }

  // Метод обновляет индексы товаров в корзине. 
  // Каждый товар имеет индекс (например, порядковый номер) для отображения.
  updateItemIndices() {
    Array.from(this.itemList.children).forEach(
      (item, idx) => {
        item.querySelector('.basket__item-index')!.textContent = (
          idx + 1
        ).toString()
      }
    );
  }
}

/**
 * Интерфейс для товаров в корзине, расширяет ProductApiData.Добавляет дополнительные поля:
    1. itemId — идентификатор товара,
    2. itemIndex — порядковый номер товара.
 */
export interface IProductCardInCart extends ProductApiData {
  itemId: string;
  index: number;
}

/**
 * Интерфейс действий для товаров в корзине.Включает метод onRemove, который вызывается при клике на кнопку удаления товара.
 */
export interface ICatalogItemCartActions {
  onRemove: (event: MouseEvent) => void;
}

/**
 * Класс CatalogCartItem реализует отдельный товар в корзине, наследуя базовые функциональности из класса Component. Управляет отображением и взаимодействием с товаром.
 */
export class CatalogCartItem extends Component<IProductCardInCart> {

  // Приватные свойства для DOM-элементов: itemIndex, itemTitle, itemPrice, removeButton.
  // Они управляют отображением индекса товара, его названием, ценой и кнопкой удаления.
  private itemIndex: HTMLElement;
  private itemTitle: HTMLElement;
  private itemPrice: HTMLElement;
  private removeButton: HTMLButtonElement;

  // Конструктор принимает:
  // 1. Префикс классов (classPrefix) для поиска элементов в DOM,
  // 2. Корневой элемент товара (rootElement),
  // 3. Опционально — объект действий (actions), содержащий колбэк для удаления товара.
  constructor(
    private classPrefix: string,
    rootElement: HTMLElement,
    actions?: ICatalogItemCartActions
  ) {
    // Вызов конструктора родительского класса Component с корневым элементом.
    super(rootElement);

    // Инициализация элементов товара через поиск их в DOM по classPrefix.
    this.itemTitle = rootElement.querySelector(`.${classPrefix}__title`);
    this.itemIndex = rootElement.querySelector(`.basket__item-index`);
    this.itemPrice = rootElement.querySelector(`.${classPrefix}__price`);
    this.removeButton = rootElement.querySelector(`.${classPrefix}__button`);

    // Добавление обработчика события "click" для кнопки удаления товара,
    // который удаляет товар из DOM и вызывает действие onRemove, если оно было передано.
    if (this.removeButton) {
      this.removeButton.addEventListener('click', (event) => {
        this.container.remove();
        actions?.onRemove(event);
      });
    }
  }

  // Сеттер для названия товара, обновляет текстовое содержимое itemTitle.
  set title(name: string) {
    this.setText(this.itemTitle, name);
  }

  // Сеттер для индекса товара, обновляет текстовое содержимое itemIndex.
  set index(idx: number) {
    this.setText(this.itemIndex, idx.toString());
  }

  // Сеттер для цены товара, обновляет текстовое содержимое itemPrice.
  set price(amount: number) {
    this.setText(this.itemPrice, amount + ' синапсов');
  }
}