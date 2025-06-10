interface Order {
  id: string;
  order_no: string;
  address_id: string;
  shop_name: string;
  address: string;
  amount: string;
  real_amount: string;
  created_date: string;
  status: number;
  remark: string;
}

interface OrderSku {
  id: string;
  name: string;
  book_num: string;
  format: string;
  price: string;
  total: string;
  remark: string;
}


interface Cart {
  status: number;
  shop_name: string;
  address: string;
  tel: string;
  amount: string;
  sku: CartSku[];
}

interface CartSku {
  id: string;
  sku_id: string;
  name: string;
  book_num: string;
  format: string;
  price: string;
  total: string;
  remark: string;
  number: string;
  unit: string;
}

interface CartSelect {
  id: string;
  name: string;
  price: string;
  last_price: string;
}

export type { Order, OrderSku, Cart, CartSku, CartSelect };
