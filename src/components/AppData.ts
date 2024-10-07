import { Model } from "./base/Model";
import {ProductApiData, IAppState, IOrder, IOrderData, FormErrors} from "../types"
import { Order } from "./Order";

/**
 * Класс Product описывает структуру данных товара.
 * Он наследует функциональность от класса Model и включает следующие свойства:
 * 1. id — уникальный идентификатор товара.
 * 2. description — описание товара.
 * 3. image — URL изображения товара.
 * 4. title — название товара.
 * 5. category — категория, к которой принадлежит товар.
 * 6. price — цена товара (может быть null, если цена неизвестна).
 * 7. selected — булево значение, указывающее, выбран ли товар.
 */
export class Product extends Model<ProductApiData> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

/**
 * Класс AppState управляет состоянием приложения.
 * Он наследует функциональность от класса Model и включает следующие свойства:
 * 1. items — массив объектов типа Product.
 * 2. modal — строка, представляющая текущее состояние модального окна.
 * 3. basket — массив товаров, добавленных в корзину.
 * 4. order — объект, представляющий заказ с информацией о товарах, методе оплаты и контактной информации.
 * 5. formErrors — объект для хранения ошибок формы.
 */
export class AppState extends Model<IAppState> {
  items: Product[];
  modal: string; 
  basket: Product[] = [];
  order: IOrder = {
    items: [],
    payment: 'Card', // Метод оплаты по умолчанию.
    total: null,
    address: '',
    email: '',
    phone: '',
  };
  formErrors: FormErrors = {};

  /**
   * Метод для проверки наличия товаров в корзине
   */
  // isProductInBasket(productId: string): boolean {
  //   return this.basket.some(item => item.id === productId);
  // }

  /**
   * Метод добавляет товар в корзину.
   * @param value — товар, который нужно добавить в корзину.
   */
  addToBasket(value: Product) {
    this.basket.push(value);
  }

  /**
   * Метод удаляет товар из корзины по его идентификатору.
   * @param id — идентификатор товара, который нужно удалить.
   */
  deleteFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id);
  }

  /**
   * Метод очищает корзину, удаляя все товары.
   */
  clearBasket() {
    this.basket.length = 0;
  }

  /**
   * Метод возвращает общее количество товаров в корзине.
   * @returns Общее количество товаров.
   */
  getBasketTotal() {
    return this.basket.length;
  }

  /**
   * Метод устанавливает идентификаторы товаров из корзины в объект заказа.
   */
  setItems() {
    this.order.items = this.basket.map(item => item.id);
  }

  /**
   * Метод для установки значения определенного поля заказа.
   * @param field — имя поля в заказе.
   * @param value — значение, которое нужно установить.
   */
  setOrderField(field: keyof IOrderData, value: string) {
    // Проверка для метода оплаты
    if (field === 'payment') {
      if (value === 'Card' || value === 'Cash') {
        this.order[field] = value; 
      } else {
        throw new Error(`Недопустимый метод оплаты: ${value}`);
      }
    } else {
      this.order[field] = value; 
    }

    // Проверка контактов перед эмиссией события
    if (this.validateContacts()) {
      this.events.emit('contacts:ready', this.order);
    }
    // Проверка заказа перед эмиссией события
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  /**
   * Метод для проверки валидности заказа.
   * @returns true, если заказ валиден, иначе false.
   */
  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходимо указать способ оплаты';
    }
    this.formErrors = errors;
    this.events.emit('paymentFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Метод для проверки валидности контактной информации.
   * @returns true, если контакты валидны, иначе false.
   */
  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    this.formErrors = errors;
    this.events.emit('contactsFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Метод для сброса заказа в исходное состояние.
   */
  refreshOrder() {
    this.order = {
      items: [],
      total: null,
      address: '',
      email: '',
      phone: '',
      payment: 'Card'
    };
  }

  /**
   * Метод для вычисления общей суммы стоимости товаров в корзине.
   * @returns Общая сумма стоимости товаров.
   */
  getTotal() {
    return this.basket.reduce((sum, next) => sum + next.price, 0);
  }

  /**
   * Метод для установки каталога товаров из массива данных API.
   * @param items — массив данных о товарах.
   */
  setCatalog(items: ProductApiData[]) {
    this.items = items.map(item => new Product(item, this.events));
    this.emitChanges('items:changed', { catalog: this.items });
  }

  /**
   * Метод для сброса состояния выбранных товаров в каталоге.
   */
  resetSelected() {
    this.items.forEach(item => item.selected = false);
  }
}