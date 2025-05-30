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


export type { Order, OrderSku };
