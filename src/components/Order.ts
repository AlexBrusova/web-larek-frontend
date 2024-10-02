import { IEvents } from './base/events';
import { FormHandler } from '../components/common/Form';

/**
 * Интерфейс, определяющий структуру заказа
 */
export interface IOrder {
  address: string; 
  paymentMethod: string; 
}

/**
 * Класс Order отвечает за управление формой заказа,
 * предоставляя функциональность выбора метода оплаты и валидации данных формы.
 */
export class Order extends FormHandler<IOrder> {
  protected _card: HTMLButtonElement; 
  protected _cash: HTMLButtonElement; 

  constructor(
    protected blockName: string, 
    container: HTMLFormElement, 
    protected events: IEvents 
  ) {
    super(container, events); 

    // Получение элементов кнопок из формы по их имени
    this._card = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

    // Обработчик клика для кнопки оплаты наличными
    if (this._cash) {
      this._cash.addEventListener('click', () => {
        this._cash.classList.add('button_alt-active'); 
        this._card.classList.remove('button_alt-active'); 
        this.handleFieldInput('paymentMethod', 'cash'); 
      });
    }

    // Обработчик клика для кнопки оплаты картой
    if (this._card) {
      this._card.addEventListener('click', () => {
        this._card.classList.add('button_alt-active'); 
        this._cash.classList.remove('button_alt-active'); 
        this.handleFieldInput('paymentMethod', 'card'); 
      });
    }
  }

  /**
   * Метод для отключения активных состояний кнопок оплаты.
   * Используется при необходимости сбросить состояние кнопок.
   */
  disableButtons() {
    this._cash.classList.remove('button_alt-active'); 
    this._card.classList.remove('button_alt-active'); 
  }
}