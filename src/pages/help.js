import React, { useMemo } from 'react'
import { Page, Navbar, Block, Icon } from 'framework7-react'
import labels from '../data/labels'

const Help = props => {
  const helpNote = useMemo(() => {
    switch (props.id) {
      case 'r':
        return 'يتم اﻻستلام من مركز التوزيع بجانب الاستقلال مول، ويتم تجهيز طلبك خلال 24-48 ساعة'
      case 'ur':
        return 'يتم اﻻستلام من مركز التوزيع بجانب الاستقلال مول، ويتم تجهيز طلبك خلال 6-12 ساعة'
      case 'd':
        return 'يتم تجهيز طلبك مع التوصيل خلال 24-48 ساعة'
      case 'ud':
        return 'يتم تجهيز طلبك مع التوصيل خلال 6-12 ساعة'
      case 'o':
        return 'سقف الطلبات هو القيمة القصوى لمجموع الطلبات الفعالة وهي خمسون دينارا، ويمكنك طلب رفع هذه القيمة بالتواصل معنا'
      default:
        return ''
    }
  }, [props.id])
  const feesNote = 'رسوم الخدمة هي 2.5% من قيمة المشتريات بالمجمل، باستثناء المنتجات التي يتم اقتطاعها من عرض مركب فتكون النسبة 5% من قيمة تلك المنتجات'
  const deliveryNote = (props.id === 'd' || props.id === 'ud') ? 'رسوم خدمة التوصيل تحدد بناء على منطقة السكن' : ''
  const urgentNote = (props.id === 'ur' || props.id === 'ud') ? 'للطلبات المستعجلة تضاف قيمة 50% من قيمة الرسوم' : ''
  return (
    <Page>
      <Navbar title={labels.helpPageTitle} backLink={labels.back} />
      <Block strong inset className="center">
        <Icon color="red" material="warning"></Icon>
        <p className="note">{helpNote}</p>
        <p className="note">{feesNote}</p>
        <p className="note">{deliveryNote}</p>
        <p className="note">{urgentNote}</p>
      </Block>
    </Page>
  )
}

export default Help