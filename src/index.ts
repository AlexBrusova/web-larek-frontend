import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Api } from './components/base/api';
import { ProductDataApiResponse, IOrderData, ApiListResponse, IOrder, ProductApiData, CategoryType } from './types';
import { EventEmitter } from './components/base/events';
import { ModalComponent } from './components/common/Modal';
import { CatalogProductPreview, CatalogIProduct } from './components/Card';
import { Product, AppState } from './components/AppData';
import { ShoppingCart, CatalogCartItem } from './components/common/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/common/Success';

const api = new Api(API_URL);
const events = new EventEmitter;
const AppData = new AppState({}, events);


// Все шаблоны
const catalogProductTemplate =
  ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new ModalComponent(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new ShoppingCart('basket', cloneTemplate(basketTemplate), events);
const order = new Order('order', cloneTemplate(orderTemplate), events)
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
  onClick: () => {
    events.emit('modal:hide')
    modal.hide()
  }
})

api
  .get('/product')
  .then((res: ProductDataApiResponse) => {
    AppData.setCatalog(res.items as ProductApiData[]);
  })
  .catch((err) => {
    console.error(err);
  });

  events.on('items:changed', () => {
    page.catalog = AppData.items.map((item) => {
      const product = new CatalogIProduct(cloneTemplate(catalogProductTemplate), {
        onClick: () => events.emit('card:select', item),
      });
      return product.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category as CategoryType,
        price: item.price,
      });
    });
  });

  events.on('card:select', (item: Product) => {
    page.locked = true;
    const product = new CatalogProductPreview(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        events.emit('card:toBasket', item)
      },
    });
    modal.render({
      content: product.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category as CategoryType,
        description: item.description,
        price: item.price
        //тут было selected
      }),
    });
  });

  events.on('card:toBasket', (item: Product) => {
    item.selected = true;
    AppData.addToBasket(item);
    page.counter = AppData.getBasketTotal();
    modal.hide();
  })

  events.on('basket:open', () => {
    page.locked = true
    const basketItems = AppData.basket.map((item, index) => {
      const catalogItem = new CatalogCartItem(
        'card',
        cloneTemplate(cardBasketTemplate),
        {
          onRemove: () => events.emit('basket:delete', item)
        }
      );
      return catalogItem.render({
        title: item.title,
        price: item.price,
        itemIndex: index + 1,
      });
    });
    modal.render({
      content: basket.render({
        items: basketItems,
        totalPrice: AppData.getTotal(),
      }),
    });
  });

  events.on('basket:delete', (item: Product) => {
    AppData.deleteFromBasket(item.id);
    item.selected = false;
    basket.totalPrice = AppData.getTotal();
    page.counter = AppData.getBasketTotal();
    basket.updateItemIndices();
    if (!AppData.basket.length) {
      basket.disableOrderButton();
    }
  })

  events.on('basket:checkout', () => {
    modal.render({
      content: order.render(
        {
          isValid: false,
          errorMessages: []
        }
      ),
    });
  });

  events.on('paymentFormErrors:change', (errors: Partial<IOrder>) => {
    const { payment, address } = errors;
    order.isValid = !payment && !address;
    order.errorMessages = Object.values({payment, address }).filter(i => !!i).join('; ');
  });

  events.on('contactsFormErrors:change', (errors: Partial<IOrder>) => {
    const { email, phone } = errors;
    contacts.isValid = !email && !phone;
    contacts.errorMessages = Object.values({ phone, email }).filter(i => !!i).join('; ');
  });

  events.on('formInput:update', (data: { field: keyof IOrderData, value: string }) => {
    AppData.setOrderField(data.field, data.value);
  });

  events.on('order:submit', () => {
    AppData.order.total = AppData.getTotal()
    AppData.setItems();
    modal.render({
      content: contacts.render(
        {
          isValid: false,
          errorMessages: []
        }
      ),
    });
  })

  events.on('contacts:submit', () => {
    api.post('/order', AppData.order)
      .then((res) => {
        events.emit('order:success', res);
        AppData.clearBasket();
        AppData.refreshOrder();
        order.disableButtons();
        page.counter = 0;
        AppData.resetSelected();
      })
      .catch((err) => {
        console.log(err)
      })
  })

  events.on('order:success', (res: ApiListResponse<string>) => {
    modal.render({
      content: success.render({
        description: res.total
      })
    })
  })

  events.on('modal:close', () => {
    page.locked = false;
    AppData.refreshOrder();
  });







