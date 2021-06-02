import {useContext, useState, useEffect} from 'react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {deleteProductRequest, getMessage} from '../data/actions'
import Footer from './footer'
import { IonContent, IonFab, IonFabButton, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonText, IonThumbnail, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { ProductRequest } from '../data/types'
import { useLocation } from 'react-router'
import { addOutline, trashOutline } from 'ionicons/icons'
import { randomColors } from '../data/config'

const ProductRequests = () => {
  const {state} = useContext(StateContext)
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([])
  const [message] = useIonToast();
  const location = useLocation()
  const [alert] = useIonAlert();
  useEffect(() => {
    setProductRequests(() => {
      const productRequests = state.productRequests.filter(r => r.storeId === state.userInfo?.storeId)
      return productRequests.sort((r1, r2) => r1.time! > r2.time! ? 1 : -1)
    })
  }, [state.productRequests, state.userInfo])
  const handleDelete = (productRequest: ProductRequest) => {
    alert({
      header: labels.confirmationTitle,
      message: labels.confirmationText,
      buttons: [
        {text: labels.cancel},
        {text: labels.ok, handler: async () => {
          try{
            await deleteProductRequest(productRequest, state.productRequests)
            message(labels.deleteSuccess, 3000) 
          } catch(err) {
            message(getMessage(location.pathname, err), 3000)
          }    
        }},
      ],
    })
  }
  return(
    <IonPage>
      <Header title={labels.productRequests} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {productRequests.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : productRequests.map(p => 
              <IonItem key={p.id}>
                <IonThumbnail slot="start">
                  <IonImg src={p.imageUrl} alt={labels.noImage} />
                </IonThumbnail>
                <IonLabel>
                  <IonText style={{color: randomColors[0].name}}>{p.name}</IonText>
                  <IonText style={{color: randomColors[1].name}}>{p.weight}</IonText>
                  <IonText style={{color: randomColors[2].name}}>{p.country}</IonText>
                  <IonText style={{color: randomColors[3].name}}>{`${labels.price}: ${p.price.toFixed(2)}`}</IonText>
                </IonLabel>
                <IonIcon 
                  ios={trashOutline} 
                  slot="end" 
                  color="danger"
                  style={{fontSize: '20px', marginRight: '10px'}} 
                  onClick={()=> handleDelete(p)}
                />
              </IonItem>    
            )
          }
        </IonList>
      </IonContent>
      <IonFab vertical="top" horizontal="end" slot="fixed">
        <IonFabButton routerLink="/add-product-request">
          <IonIcon ios={addOutline} />
        </IonFabButton>
      </IonFab>
      <Footer />
    </IonPage>
  )
}

export default ProductRequests