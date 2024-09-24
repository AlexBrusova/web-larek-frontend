// Типпы данных для API

/**
 * Данные, получаемые при запросе списка продуктов (массив с продуктами)
 */
interface ProductDataApiResponse {
  items: ProductApiData[]
}

/**
 * Данные о продукте, получаемые в каждом объекте массива items
 */
interface ProductApiData {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: string
}

/**
 * Данные для создания заказа
 */
interface OrderData {
  paymentMethod: PaymentMethod;
  email: string;
  phone: string;
  adress: string;
  products: OrderProductData[];
  totalAmount: number;
}

/**
 * Данные для создания заказа
 */
interface OrderProductData {
  productId: string;
}

/**
 * Ответ API на создание заказа
 */
interface OrderResponse {
  orderId: string;
  totalAmount: string;
}

/**
 * Способы оплаты
 */
type PaymentMethod =
  | 'Card'
  | 'Cash'


/**
 * Интерфейс API. 1. Получание списка продуктов. 2. Получение продукта по id. 3. Отправка заказа 
 */
interface IProductApi {
  getProducts(): Promise<ProductApiData[]>;
  getProductById(id: string): Promise<ProductApiData>;
  createOrder(order: OrderData): Promise<OrderResponse>;
}

// Типпы данных для модели данных

/**
 * Интерфейс модели данных - состояния приложения
 */
interface AppState {
  products: ProductApiData[]; //доступные товары
  basket: ProductApiData[]; //товары в корзине
  order: OrderData; //заказ
  modal: ProductApiData //модалка с открытым товаром

  loadProducts(): Promise<void>; //загрузить все доступные товары на страницу
  loadProduct(id: string): Promise<void>; //открыть модалку с конкретным товаром
  
  orderProducts(): Promise<OrderResponse>; //заказать товары
}


