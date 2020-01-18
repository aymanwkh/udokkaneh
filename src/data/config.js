export const setup = {
  fixedFees: 0.025,
  maxDiscount: 100,
  firstOrderDiscount: 200,
  profit: 0.1,
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
  {id: 'd', name: 'مكتمل'},
  {id: 'p', name: 'جاهز'},
  {id: 't', name: 'مستلم'},
  {id: 'f', name: 'منتهي'},
  {id: 'c', name: 'ملغي'},
  {id: 'u', name: 'غير متوفر'},
  {id: 'i', name: 'استيداع'},
  {id: 'm', name: 'مدمج'}
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

export const orderPositions = [
  {id: 's', name: 'المستودع'},
  {id: 'c', name: 'مركز التوزيع'},
  {id: 'd', name: 'سيارة التوزيع'},
]

export const deliveryIntervals = [
  {id: 'm', name: 'صباحا'},
  {id: 'a', name: 'بعد الظهر'},
  {id: 'n', name: 'مساءا'},
  {id: 'u', name: 'اي وقت'}
]