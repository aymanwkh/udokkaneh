export const setup = {
  fixedFees: 2.5,
  maxDiscount: 100,
  firstOrderDiscount: 200,
  profit: 10,
  orderLimit: 50000,
  deliveryFees: 200
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

export const orderByList = [
  {id: 'p', name: 'اﻷقل سعرا'},
  {id: 's', name: 'اﻷكثر مبيعا'},
  {id: 'r', name: 'اﻷفضل في التقييم'},
  {id: 'o', name: 'العروض أولا'},
  {id: 'v', name: 'اﻷفضل قيمة (السعر/الكمية)'},
]

export const orderStatus = [
  {id: 'n', name: 'جديد'},
  {id: 'a', name: 'معتمد'},
  {id: 's', name: 'معلق'},
  {id: 'r', name: 'مرفوض'},
  {id: 'e', name: 'قيد التجهيز'},
  {id: 'f', name: 'مكتمل'},
  {id: 'p', name: 'جاهز'},
  {id: 'd', name: 'مستلم'},
  {id: 'c', name: 'ملغي'},
  {id: 'u', name: 'غير متوفر'},
  {id: 'i', name: 'استيداع'}
]  

export const ratingValues = [
  {id: 0, name: 'ﻻ أنصح به'},
  {id: 1, name: 'أنصح به'}
]

export const orderPackStatus = [
  {id: 'n', name: 'جديد'},
  {id: 'p', name: 'شراء جزئي'},
  {id: 'f', name: 'تم الشراء'},
  {id: 'u', name: 'غير متوفر'},
  {id: 'pu', name: 'شراء جزئي والباقي غير متوفر'},
  {id: 'r', name: 'مرتجع'},
  {id: 'pr', name: 'مرتجع جزئي'}
]

export const alarmTypes = [
  {id: '1', name: 'الابلاغ عن سعر أقل', actor: 'c'},
  {id: '2', name: 'الابلاغ عن تغيير السعر', actor: 'o', isAvailable: true},
  {id: '3', name: 'الابلاغ عن توفر هذا المنتج/العرض', actor: 'o', isAvailable: false},
  {id: '4', name: 'الابلاغ عن عدم توفر هذا المنتج/العرض', actor: 'o', isAvailable: true},
  {id: '5', name: 'الابلاغ عن توفر منتج بديل', actor: 'a'},
  {id: '6', name: 'الابلاغ غن توفر عبوة جديدة للمنتج', actor: 'a'},
  {id: '7', name: 'الابلاغ عن عرض لقرب انتهاء الصلاحية', actor: 'o', isAvailable: true},
  {id: '8', name: 'الابلاغ عن عرض على شكل مجموعة', actor: 'o', isAvailable: true},
]

export const storeSummary = [
  {id: 'a', name: 'كل المنتجات'},
  {id: 'o', name: 'منتجات اعلى من السوق'},
  {id: 'n', name: 'منتجات مساوية للسوق'},
  {id: 'l', name: 'منتجات أقل سعر في السوق'}
]