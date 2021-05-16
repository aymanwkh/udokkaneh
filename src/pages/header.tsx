import { IonBackButton, IonButtons, IonHeader, IonIcon, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react'
import { useState } from 'react'
import labels from '../data/labels'

type Props = {
  title?: string,
  withSearch?: boolean
}
const Header = (props: Props) => {
  const [visible, setVisible] = useState(false)
  return (
    <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonBackButton text={labels.back} defaultHref="/" />
      </IonButtons>
      {props.withSearch && 
        <IonButtons slot="end" onClick={() => setVisible(true)}>
          <IonIcon name="search-outline" color="primary" size="small" />
        </IonButtons>
      }
      <IonTitle>{props.title}</IonTitle>
    </IonToolbar>
    {visible && 
      <IonToolbar>
        <IonSearchbar placeholder={labels.search}/>
      </IonToolbar>
    }
  </IonHeader>
)
}

export default Header