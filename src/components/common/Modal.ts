import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

/**
 * Интерфейс IModalData описывает данные, используемые для отображения модального окна. Он включает:
 * 1. content — HTML-элемент, представляющий содержимое модального окна.
 */
interface IModalData {
  content: HTMLElement;
}

/**
 * Класс ModalComponent управляет поведением модального окна, наследуя функциональность базового класса Component.
 * Он позволяет открывать и закрывать модальное окно, а также обновлять его содержимое.
 */
export class ModalComponent extends Component<IModalData> {
  // Приватные свойства для DOM-элементов:
  // closeButton — кнопка для закрытия модального окна,
  // modalContent — элемент, содержащий контент модального окна.
  private closeButton: HTMLButtonElement;
  private modalContent: HTMLElement;

  // Конструктор принимает:
  // 1. container — HTML-элемент, в котором будет размещено модальное окно,
  // 2. eventEmitter — объект для обработки событий, связанных с модальным окном.
  constructor(container: HTMLElement, private eventEmitter: IEvents) {
    // Вызов конструктора родительского класса Component с элементом контейнера.
      super(container);

      // Инициализация кнопки закрытия и содержимого модального окна через поиск их в DOM.
      this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
      this.modalContent = ensureElement<HTMLElement>('.modal__content', container);

      // Добавление обработчика события "click" для кнопки закрытия модального окна.
      this.closeButton.addEventListener('click', this.hide.bind(this));

      // Добавление обработчика события "click" для контейнера модального окна,чтобы закрыть его при клике вне содержимого.
      this.container.addEventListener('click', this.hide.bind(this));

      // Предотвращение закрытия модального окна при клике на его содержимое.
      this.modalContent.addEventListener('click', (event) => event.stopPropagation());
  }

  // Сеттер для установки содержимого модального окна.
  // Обновляет содержимое, заменяя его на новое значение.
  set content(value: HTMLElement) {
      this.modalContent.replaceChildren(value);
  }

  // Метод show отображает модальное окно, добавляя класс активности.
  // Также генерирует событие о том, что модальное окно открыто.
  show() {
      this.container.classList.add('modal_active');
      this.eventEmitter.emit('modal:open');
  }

  // Метод hide скрывает модальное окно, удаляя класс активности.
  // Также очищает содержимое и генерирует событие о закрытии модального окна.
  hide() {
      this.container.classList.remove('modal_active');
      this.content = null; 
      this.eventEmitter.emit('modal:close');
  }

  // Метод render отвечает за рендеринг модального окна с заданными данными.
  // Вызывает метод родительского класса и отображает модальное окно.
  render(data: IModalData): HTMLElement {
      super.render(data); // Вызов метода рендеринга родительского класса
      this.show(); // Отображение модального окна
      return this.container; // Возврат контейнера модального окна
  }
}