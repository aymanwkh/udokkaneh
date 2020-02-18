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
        return 'يمكنك تتبع مراحل تنفيذ طلبك من خلال خيار طلباتي من القائمة الجانبية في الصفحة الرئيسية، كما يمكنك التعديل على طلبك أو إلغاؤه قبل بدء تنفيذه، كذلك يمكنك دمج الطلب مع الطلب الذي قبله ليتم تسلمهما معا'
      case 'ol':
        return 'سقف الطلبات الفعالة هو خمسون دينارا، ويمكنك طلب رفع هذه القيمة بالتواصل معنا'
      default:
        return ''
    }
  })
  const feesNote = 'رسوم الخدمة هي 2.5% من قيمة المشتريات، مضافا إليها رسوم التوصيل والتي تحدد بناء على منطقتك'
  const locationFeesNote = 'حيث أن رسوم التوصيل ل'
  const discountNote = 'وللحصول على المزيد من الخصومات لا تنس تقييم المنتجات التي تشتريها، والإبلاغ عن الأسعار الأقل من خلال القائمة في صفحة المنتج، ودعوة أصدقائك من خلال القائمة الجانبية في الصفحة الرئيسية'
  return (
    <Page>
      <Navbar title={labels.helpPageTitle} backLink={labels.back} />
      <Block strong inset className="center">
        <Icon color="red" material="warning"></Icon>
        <p className="note">{helpNote}</p>
        {props.id === 'o' ?
          <React.Fragment>
            <p className="help1">{feesNote}</p>
            {userLocation.fees === 0 ? '' : <p className="help1">{`${locationFeesNote}${userLocation.name}: ${(userLocation.fees / 1000).toFixed(3)}`}</p>}
            <p className="help2">{discountNote}</p>
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