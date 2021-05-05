export const setup = {
  fixedFees: 0.01,
  maxDiscount: 10,
  firstOrderDiscount: 10,
  orderLimit: 5000,
  profit: 0.05,
}

export const randomColors = [
  {id: 0, name: 'red'},
  {id: 1, name: 'green'},
  {id: 2, name: 'blue'},
  {id: 3, name: 'pink'},
  {id: 4, name: 'yellow'},
  {id: 5, name: 'orange'},
  {id: 6, name: 'purple'},
  {id: 7, name: 'deeppurple'},
  {id: 8, name: 'lightblue'},
  {id: 9, name: 'teal'},
]

export const sortByList = [
  {id: 'p', name: 'اﻷقل سعرا'},
  {id: 'r', name: 'اﻷفضل في التقييم'},
  {id: 'd', name: 'اﻷكثر طلبا'},
  {id: 'v', name: 'اﻷفضل قيمة (السعر/الوزن)'},
]

export const units = [
  {id: 'g', name: 'غرام', type: 'w', factor: 1},
  {id: 'kg', name: 'كيلو', type: 'w', factor: 1000},
  {id: 'l', name: 'لتر', type: 'v', factor: 1000},
  {id: 'ml', name: 'مل', type: 'v', factor: 1},
  {id: 'c', name: 'حبة', type: 'c', factor: 1},
  {id: 'd', name: 'دزينة', type: 'c', factor: 12}
]