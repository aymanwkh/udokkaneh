import labels from '../data/labels'
import { IonContent, IonPage } from '@ionic/react'
import Header from './header'
import { setup } from '../data/config'

const Help = () => {
  return (
    <IonPage>
      <Header title={labels.contactUs} />
      <IonContent fullscreen>
        <div className="help">
          {labels.help}
        </div>
        <div className="help">
          {setup.firstPhone}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Help
