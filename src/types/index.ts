// Типы данных для API

/**
 * Данные, получаемые при запросе списка продуктов (массив с продуктами)
 */
export interface ProductDataApiResponse {
  items: ProductApiData[]
}

export type ApiListResponse<Type> = {
  total: number;
	items: Type[];
}

/**
 * Данные о продукте, получаемые в каждом объекте массива items
 */
export interface ProductApiData {
  id: string;
  description: string;
  image: string;
  title: string;
  category: CategoryType;
  price: number | null
}

/**
 * Типы категорий товара
 */
export type CategoryType =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export type CategoryMap = {
	[Key in CategoryType]: string;
};

/**
 * Данные для создания заказа
 */
export interface IOrderData {
  paymentMethod: PaymentMethod;
  email: string;
  phone: string;
  adress: string;
}

export interface IOrder extends IOrderData{
  products: string[];
  totalAmount: number;
}
/**
 * Данные для создания заказа
 */
export interface OrderProductData {
  productId: string;
}

/**
 * Ответ API на создание заказа
 */
interface OrderResponse {
  orderId: string;
  totalAmount: string;
}

export type FormErrors = Partial<Record<keyof IOrderData, string>>;

/**
 * Способы оплаты
 */
export type PaymentMethod =
  | 'Card'
  | 'Cash'


/**
 * Интерфейс API. 1. Получание списка продуктов. 2. Получение продукта по id. 3. Отправка заказа 
 */
interface IProductApi {
  getProducts(): Promise<ProductApiData[]>;
  getProductById(id: string): Promise<ProductApiData>;
  createOrder(order: IOrderData): Promise<OrderResponse>;
}

// Типы данных для модели данных

/**
 * Интерфейс модели данных - состояния приложения
 */
export interface IAppState {
  products: ProductApiData[]; //доступные товары
  basket: string; //товары в корзине
  order: IOrderData; //заказ
  modal: ProductApiData //модалка с открытым товаром

  loadProducts(): Promise<void>; //загрузить все доступные товары на страницу
  loadProduct(id: string): Promise<void>; //открыть модалку с конкретным товаром
  
  orderProducts(): Promise<OrderResponse>; //заказать товары
}


