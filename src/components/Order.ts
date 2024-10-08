import { IEvents } from './base/events';
import { FormHandler } from '../components/common/Form';

/**
 * Интерфейс, определяющий структуру заказа
 */
export interface IOrder {
  address: string; 
  payment: string; 
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
    this._card = container.elements.namedItem('Card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('Cash') as HTMLButtonElement;

    // Обработчик клика для кнопки оплаты наличными
    if (this._cash) {
      this._cash.addEventListener('click', () => {
        
        this.toggleClass(this._cash, 'button_alt-active', true);
        this.toggleClass(this._card, 'button_alt-active', false);
        this.handleFieldInput('payment', 'Cash'); 
      });
    }

    // Обработчик клика для кнопки оплаты картой
    if (this._card) {
      this._card.addEventListener('click', () => {
        this.toggleClass(this._card, 'button_alt-active', true);
        this.toggleClass(this._cash, 'button_alt-active', false);
        this.handleFieldInput('payment', 'Card'); 
      });
    }
  }

  /**
   * Метод для отключения активных состояний кнопок оплаты.
   * Используется при необходимости сбросить состояние кнопок.
   */
  disableButtons() {
    this.toggleClass(this._cash, 'button_alt-active', false);
    this.toggleClass(this._card, 'button_alt-active', false);
  }
}