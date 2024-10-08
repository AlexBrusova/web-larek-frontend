import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

/**
 * Интерфейс IFormStatus описывает состояние формы. Он включает:
    1. isValid — логическое значение, указывающее, корректна ли форма.
    2. errorMessages — массив строк, содержащий сообщения об ошибках.
 */
interface IFormStatus {
  isValid: boolean;
  errorMessages: string[];
}

/**
 * Класс FormHandler управляет поведением формы, наследуя функциональность базового класса Component. Он использует дженерик <U> для определения типов полей формы.
 */
export class FormHandler<U> extends Component<IFormStatus> {
  // Приватные свойства для DOM-элементов:
  // submitButton — кнопка отправки формы,
  // errorContainer — элемент для отображения сообщений об ошибках.
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLElement;

  // Конструктор принимает:
  // 1. formElement — HTML-элемент формы, с которой будет работать класс,
  // 2. eventHandler — объект для управления кастомными событиями.
  constructor(protected formElement: HTMLFormElement, protected eventHandler: IEvents) {
    // Вызов конструктора родительского класса Component с элементом формы.
    super(formElement);

    // Инициализация кнопки отправки и контейнера для ошибок через поиск их в DOM.
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type=submit]',
      this.formElement
    );
    this.errorContainer = ensureElement<HTMLElement>('.form__errors', this.formElement);

    // Добавление обработчика события "input" для отслеживания изменений в полях формы.
    // При изменении любого поля формы вызывается метод handleFieldInput.
    this.formElement.addEventListener('input', (event: Event) => {
      const inputField = event.target as HTMLInputElement;
      const fieldName = inputField.name as keyof U;
      const fieldValue = inputField.value;
      this.handleFieldInput(fieldName, fieldValue);
    });

    // Добавление обработчика события "submit" для формы.
    // При отправке формы событие по умолчанию блокируется, а затем
    // происходит вызов кастомного события, оповещающего о том, что форма была отправлена.
    this.formElement.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.eventHandler.emit(`${this.formElement.name}:submit`);
    });
  }

  // Приватный метод для обработки изменения поля формы.
  // При изменении поля вызывается кастомное событие 'formInput:update' с данными о поле и его значении.
  protected handleFieldInput(fieldName: keyof U, fieldValue: string) {
    this.eventHandler.emit('formInput:update', {
      field: fieldName,
      value: fieldValue,
    });
  }

  // Сеттер для свойства isValid, определяющий, корректна ли форма.
  // Если форма некорректна, кнопка отправки блокируется.
  set isValid(isFormValid: boolean) {
    this.setDisabled(this.submitButton, !isFormValid)
    // this.submitButton.disabled = !isFormValid;
  }

  // Сеттер для установки сообщений об ошибках в форме.
  // Устанавливает текст в errorContainer (контейнер для ошибок).
  set errorMessages(messages: string) {
    this.setText(this.errorContainer, messages);
  }

  // Метод updateView обновляет интерфейс формы в соответствии с её текущим состоянием.
  // Он принимает состояние формы (state), состоящее из валидности (isValid),
  // сообщений об ошибках (errorMessages) и значений полей формы (formFields).
  updateView(state: Partial<U> & IFormStatus) {
    const { isValid, errorMessages, ...formFields } = state;
    super.render({ isValid, errorMessages });
    Object.assign(this, formFields);
    return this.formElement;
  }
}