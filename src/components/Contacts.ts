import { IEvents } from './base/events';
import { FormHandler } from './common/Form';

/**
 * Интерфейс IContacts описывает структуру данных для контактной информации.
 * Включает следующие поля:
 * - phone: строка, представляющая номер телефона.
 * - email: строка, представляющая адрес электронной почты.
 */
export interface IContacts {
  phone: string;
  email: string;
}

/**
 * Класс Contacts наследует функциональность от FormHandler для управления формой контактов.
 * Он принимает HTML-форму и объект событий, чтобы обрабатывать взаимодействия с формой.
 */
export class Contacts extends FormHandler<IContacts> {
  /**
   * Конструктор класса Contacts.
   * Принимает два параметра:
   * - container: HTMLFormElement, элемент формы, который будет обрабатываться.
   * - events: IEvents, объект для обработки пользовательских событий, связанных с формой.
   */
  constructor(
    container: HTMLFormElement,
    events: IEvents
  ) {
    super(container, events);  // Вызов конструктора родительского класса с передачей параметров
  }
}