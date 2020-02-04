import React, { useState } from 'react'
import { Page, Navbar, Block, Icon, Toolbar } from 'framework7-react'
import labels from '../data/labels'
import BottomToolbar from './bottom-toolbar'

const Help = props => {
  const [helpNote] = useState(() => {
    switch (props.id) {
      case 'o':
        return 'في حال عدم توفر خدمة التوصيل لمنطقتك، أو عدم رغبتك بالاستفادة من هذه الخدمة، فيتوجب عليك استلام طلبك من مركز التوزيع بجانب اﻻستقلال مول'
      case 'ol':
        return 'سقف الطلبات هو القيمة القصوى لمجموع الطلبات الفعالة وهي خمسون دينارا، ويمكنك طلب رفع هذه القيمة بالتواصل معنا'
      default:
        return ''
    }
  })
  const feesNote = 'رسوم الخدمة هي 2.5% من قيمة المشتريات'
  const deliveryNote = 'رسوم خدمة التوصيل تحدد بناء على منطقة السكن'
  const orderNote = 'يمكنك تتبع مراحل تنفيذ طلبك من خلال خيار طلباتي من القائمة الجانبية في الصفحة الرئيسية، كما يمكنك التعديل على طلبك أو إلغاؤه قبل بدء تنفيذه، كذلك يمكنك دمج الطلب مع الطلب الذي قبله ليتم تسلمهما معا'
  return (
    <Page>
      <Navbar title={labels.helpPageTitle} backLink={labels.back} />
      <Block strong inset className="center">
        <Icon color="red" material="warning"></Icon>
        <p className="note">{helpNote}</p>
        {props.id === 'o' ? 
          <React.Fragment>
            <p className="note">{feesNote}</p>
            <p className="note">{deliveryNote}</p>
            <p className="note">{orderNote}</p>
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