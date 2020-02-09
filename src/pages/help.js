import React, { useState } from 'react'
import { Page, Navbar, Block, Icon, Toolbar } from 'framework7-react'
import labels from '../data/labels'
import BottomToolbar from './bottom-toolbar'

const Help = props => {
  const [helpNote] = useState(() => {
    switch (props.id) {
      case 'o':
        return 'يمكنك تتبع مراحل تنفيذ طلبك من خلال خيار طلباتي من القائمة الجانبية في الصفحة الرئيسية، كما يمكنك التعديل على طلبك أو إلغاؤه قبل بدء تنفيذه، كذلك يمكنك دمج الطلب مع الطلب الذي قبله ليتم تسلمهما معا'
      case 'ol':
        return 'قبل استلام الطلب اﻷول يكون سقف الطلبات الفعالة عشرين دينارا، بعد ذلك يصبح خمسين دينارا، ويمكنك طلب رفع هذه القيمة بالتواصل معنا'
      default:
        return ''
    }
  })
  const feesNote = 'رسوم الخدمة هي 2.5% من قيمة المشتريات، مضافا إليها رسوم التوصيل والتي تحدد بناء على منطقتك'
  return (
    <Page>
      <Navbar title={labels.helpPageTitle} backLink={labels.back} />
      <Block strong inset className="center">
        <Icon color="red" material="warning"></Icon>
        <p className="note">{helpNote}</p>
        {props.id === 'o' ? 
          <p className="note">{feesNote}</p>
        : ''}
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Help