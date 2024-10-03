import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

/**
 * Интерфейс, описывающий структуру страницы
 */
interface IPage {
  counter: number; // Счетчик для отображения количества товаров в корзине
  catalog: HTMLElement[]; // Список элементов каталога
  locked: boolean; // Флаг, указывающий, заблокирована ли страница для взаимодействия
}

/**
 * Класс Page управляет отображением и функциональностью страницы,
 * включая счетчик корзины и каталог товаров.
 */
export class Page extends Component<IPage> {
  protected _counter: HTMLElement; 
  protected _catalog: HTMLElement; 
  protected _wrapper: HTMLElement; 
  protected _basket: HTMLElement; 

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); 

    // Инициализация элементов страницы с помощью функции ensureElement
    this._counter = ensureElement<HTMLElement>('.header__basket-counter'); 
    this._catalog = ensureElement<HTMLElement>('.gallery'); 
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper'); 
    this._basket = ensureElement<HTMLElement>('.header__basket'); 

    // Добавление обработчика события клика на элемент корзины
    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open'); // Эмиссия события открытия корзины
    });
  }

  // Установить значение счетчика
  set counter(value: number) {
    this.setText(this._counter, String(value)); // Обновление текста элемента счетчика
  }

  // Установить элементы каталога
  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items); // Замена содержимого каталога новыми элементами
  }

  // Установить состояние заблокированной страницы
  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked'); 
    } else {
      this._wrapper.classList.remove('page__wrapper_locked'); 
    }
  }
}