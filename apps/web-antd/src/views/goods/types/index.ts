interface Goods {
  id: string;
  title: string;
  sku_num: number;
  as_title: string;
  code: string;
  created_date: string;
  goods_skus?:GoodsSku[];
}

interface GoodsSku {
  id: string;
  goods_id: string;
  name: string;
  capacity: string;
  remark: string;
  format: string;
  unit: string;
  pp: string;
  wp: string;
  rp: string;
  stock: number;
  number: string;
}

export type { Goods, GoodsSku };
