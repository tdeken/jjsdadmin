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
  print_status: number;
  remark: string;
}

interface OrderSku {
  id: string;
  name: string;
  book_num: string;
  unit: string;
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
  unit: string;
  price: string;
  last_price: string;
}

interface PrintData {
  order_no: string;
  amount: string;
  created_date: string;
  customer: PrintAddress;
  owner: PrintAddress
  list: PrintSku[];
  total: number;
  operator: string;
  deliver:string;
}

interface PrintAddress {
  shop_name: string;
  address: string;
  tel: string;
}
interface PrintSku {
  name: string;
  book_num: string;
  format: string;
  price: string;
  total: string;
  remark: string;
  number: string;
  unit: string;
}

interface AddressSelect {
  id: string;
  shop_name: string;
  address: string;
}

export type { 
  Order, OrderSku, 
  Cart, CartSku, CartSelect,
  PrintData, PrintAddress, PrintSku,
  AddressSelect,
 };
