import React, { useContext, useState } from 'react'
import { StoreContext } from '../data/store'
import { Page, Navbar, Block, Icon, Toolbar } from 'framework7-react'
import labels from '../data/labels'
import BottomToolbar from './bottom-toolbar'

const Help = props => {
  const { state } = useContext(StoreContext)
  const [userLocation] = useState(() => state.locations.find(l => l.id === state.userInfo.locationId))
  const [helpNote] = useState(() => {
    switch (props.id) {
      case 'o':
        return 'يمكنك تتبع مراحل تنفيذ طلبك من خلال خيار طلباتي من القائمة الجانبية في الصفحة الرئيسية، حيث تستطيع التعديل على الطلب أو إلغاؤه قبل بدء تنفيذه، كما يمكنك دمج الطلب مع الطلب الذي قبله ليتم تسلمهما معا'
      case 'ol':
        return 'سقف الطلبات الفعالة هو خمسون دينارا، ويمكنك طلب رفع هذه القيمة بالتواصل معنا'
      default:
        return ''
    }
  })
  const purchaseNote = 'يتم الشراء بالسعر عند الطلب أو أقل اذا انخفض السعر، أما في حال ارتفاع السعر فتتوقف عملية الشراء حسب المؤشر بجانب كل منتج في السلة هل ترغب باتمام الشراء بافضل سعر في السوق او عدم الشراء'
  const feesNote = 'رسوم الخدمة هي 2.5% من قيمة المشتريات، مضافا إليها رسوم التوصيل والتي تتحدد بناء على منطقتك'
  const locationFeesNote = 'حيث أن رسوم التوصيل ل'
  const ratingsDiscountNote = 'وللحصول على المزيد من الخصومات لا تنس تقييم المنتجات التي تشتريها من خلال صفحة مشترياتي والتي يمكن الوصول اليها من القائمة الجانبية في الصفحة الرئيسية حيث سوف تحصل على خصم بقيمة 1% من قيمة كل منتج تقيمه'
  const alarmsDiscountNote = 'كما يمكنك الإبلاغ عن سعر أقل للمنتج من خلال القائمة في صفحة المنتج حيث سوف تحصل على خصم بقيمة 1% من قيمة ذلك المنتج'
  const invitationsDiscountNote = ' كذلك لا تنس دعوة أصدقائك من خلال القائمة الجانبية في الصفحة الرئيسية حيث سوف تحصل على خصم بقيمة 100 فلس عن كل صديق يشترك معنا'
  return (
    <Page>
      <Navbar title={labels.helpPageTitle} backLink={labels.back} />
      <Block strong inset className="center">
        <Icon color="red" material="warning"></Icon>
        <p className="note">{helpNote}</p>
        {props.id === 'o' ?
          <React.Fragment>
            <p className="help1">{purchaseNote}</p>
            <p className="help2">{feesNote}</p>
            {userLocation.fees === 0 ? '' : <p className="help2">{`${locationFeesNote}${userLocation.name}: ${(userLocation.fees / 1000).toFixed(3)}`}</p>}
            <p className="help3">{ratingsDiscountNote}</p>
            <p className="help3">{alarmsDiscountNote}</p>
            <p className="help3">{invitationsDiscountNote}</p>
          </React.Fragment>
        : ''}
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Help