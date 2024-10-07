import { Component } from "../base/Component";

/**
 * Интерфейс ISuccessActions описывает действия, связанные с успешным событием.
 * Он включает:
 * 1. onClick — функция, вызываемая при клике на кнопку.
 */
interface ISuccessActions {
  onClick: (event: MouseEvent) => void; // Обработчик события клика
}

/**
 * Интерфейс ISuccess описывает данные для успешного события.
 * Он включает:
 * 1. description — число, представляющее описание успеха.
 */
export interface ISuccess {
  description: number; // Значение, описывающее успешное действие
}

/**
 * Класс Success управляет отображением информации об успешном событии.
 * Он наследует функциональность базового класса Component.
 */
export class Success extends Component<ISuccess> {
  // Приватные свойства для DOM-элементов:
  // button — кнопка для закрытия сообщения об успехе,
  // descriptionElement — элемент, отображающий описание успешного события.
  protected button: HTMLButtonElement;
  protected descriptionElement: HTMLElement;

  // Конструктор принимает:
  // 1. blockName — название блока для поиска элементов в контейнере,
  // 2. container — HTML-элемент, в котором располагается компонент,
  // 3. actions — объект с обработчиками событий, связанными с успешным событием.
  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ISuccessActions
  ) {
    super(container); // Вызов конструктора родительского класса

    // Поиск кнопки закрытия и элемента описания в контейнере на основе имени блока.
    this.button = container.querySelector(`.${blockName}__close`);
    this.descriptionElement = container.querySelector(`.${blockName}__description`);

    // Если передан обработчик нажатия, добавляем его к кнопке.
    if (actions?.onClick) {
      if (this.button) {
        this.button.addEventListener('click', actions.onClick);
      }
    }
  }

  // Сеттер для свойства description, обновляющий текст элемента описания.
  // Он принимает значение числа и отображает его в формате "Списано X синапсов".
  set description(value: number) {
    this.setText(this.descriptionElement, 'Списано ' + value + ' синапсов')
  }
}