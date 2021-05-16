import {useContext, useState, useEffect} from 'react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {deleteStoreRequest, getMessage, productOfText} from '../data/actions'
import {Pack} from '../data/types'
import Footer from './footer'
import { IonActionSheet, IonContent, IonImg, IonItem, IonLabel, IonList, IonPage, IonThumbnail, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation } from 'react-router'

type ExtendedPack = Pack & {
  countryName: string,
  categoryName: string,
  trademarkName?: string
}
const Basket = () => {
  const {state, dispatch} = useContext(StateContext)
  const [currentPack, setCurrentPack] = useState<Pack | undefined>(undefined)
  const [basket, setBasket] = useState<ExtendedPack[]>([])
  const [actionOpened, setActionOpened] = useState(false);
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast();
  useEffect(() => {
    setBasket(() => {
      return state.basket.map(p => {
        const countryName = state.countries.find(c => c.id === p.product.countryId)!.name
        const categoryName = state.categories.find(c => c.id === p.product.categoryId)!.name
        const trademarkName = state.trademarks.find(t => t.id === p.product.trademarkId)?.name
        return {
          ...p,
          countryName,
          categoryName,
          trademarkName
        }
      })
    })
  }, [state.basket, state.stores, state.packs, state.categories, state.countries, state.trademarks])
  const handleMore = (pack: Pack) => {
    setCurrentPack(pack)
    setActionOpened(true)
  }
  const handleDelete = () => {
    try{
      if (state.userInfo?.storeId) {
        deleteStoreRequest(state.storeRequests.find(p => p.storeId === state.userInfo?.storeId! && p.packId === currentPack?.id!)!)
      } 
      dispatch({type: 'DELETE_FROM_BASKET', payload: currentPack})
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  return(
    <IonPage>
      <Header title={labels.basket} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {basket.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : basket.map(p => 
              <IonItem 
                key={p.id} 
                className={(currentPack && currentPack.id === p.id) ? 'selected' : ''}
                onClick={()=> handleMore(p)}
              >
                <IonThumbnail slot="start">
                  <IonImg src={p.imageUrl || p.product.imageUrl} alt={labels.noImage} />
                </IonThumbnail>
                <IonLabel>
                  <div className="list-row1">{p.product.name}</div>
                  <div className="list-row2">{p.product.description}</div>
                  <div className="list-row3">{p.name}</div>
                  <div className="list-row4">{productOfText(p.countryName, p.trademarkName)}</div>
                  <div className="list-row5">{p.categoryName}</div>
                </IonLabel>
                <IonLabel slot="end" className="ion-text-end">{p.price!.toFixed(2)}</IonLabel>
              </IonItem>    
            )
          }
        </IonList>
      </IonContent>
      <IonActionSheet
        isOpen={actionOpened}
        onDidDismiss={() => setActionOpened(false)}
        buttons={[
          {
            text: labels.details,
            cssClass: 'success',
            handler: () => history.push(`/pack-details/${currentPack?.id}`)
          },
          {
            text: labels.delete,
            cssClass: 'danger',
            handler: () => handleDelete()
          },
        ]}
      />
      <Footer />
    </IonPage>
  )
}

export default Basket