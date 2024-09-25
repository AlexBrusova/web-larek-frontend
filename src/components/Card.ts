import { Component } from "./base/Component";
import { CategoryType, ProductApiData } from "../types";
import { categoryMap, CDN_URL } from "../utils/constants";
import { ensureElement } from '../utils/utils';

interface IProductActions {
  onClick: (event: MouseEvent) => void;
}

/**
 * Класс Product предназначен для отображения информации о товаре.
 * Он наследуется от базового класса Component и управляет различными свойствами карточки.
 */
export class Product extends Component<ProductApiData> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: IProductActions
  ) {
    super(container);

    // Инициализация элементов карточки
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
    this._button = container.querySelector(`.${blockName}__button`);
    this._category = container.querySelector(`.${blockName}__category`);
    this._price = container.querySelector(`.${blockName}__price`);

    // Добавление обработчика события клика
    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set image(value: string) {
    this._image.src = CDN_URL + value;
  }

  set selected(value: boolean) {
    if (!this._button.disabled) {
      this._button.disabled = value;
    }
  }

  set price(value: number | null) {
    this._price.textContent = value
      ? value + ' синапсов'
      : 'Бесценно';
    if (this._button && !value) {
      this._button.disabled = true;
    }
  }

  set category(value: CategoryType) {
    this._category.textContent = value;
    this._category.classList.add(categoryMap[value]);
  }
}

/**
 * Класс CatalogItem представляет отдельный элемент в каталоге.
 */
export class CatalogIProduct extends Product {
  constructor(container: HTMLElement, actions?: IProductActions) {
    super('card', container, actions);
  }
}

/**
 * Класс CatalogItemPreview представляет предварительный просмотр товара в каталоге,
 * добавляя возможность отображения описания к функциональности базовой карточки товара.
 */
export class CatalogProductPreview extends Product {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: IProductActions) {
    super('card', container, actions);

    this._description = container.querySelector(`.${this.blockName}__text`);
  }

  set description(value: string) {
    this._description.textContent = value;
  }
}
