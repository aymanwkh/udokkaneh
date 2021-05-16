import {useContext, useEffect, useState} from 'react'
import RatingStars from './rating-stars'
import {StateContext} from '../data/state-provider'
import {addPackStore, changePrice, deleteStorePack, addStoreRequest, getMessage, productOfText, rateProduct} from '../data/actions'
import labels from '../data/labels'
import {PackStore, Store} from '../data/types'
import Footer from './footer'
import { setup, randomColors } from '../data/config'
import { useHistory, useLocation, useParams } from 'react-router'
import { IonActionSheet, IonAlert, IonButton, IonCard, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonRow, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { menuOutline, heartOutline, heartDislikeOutline, heartHalfOutline } from 'ionicons/icons'

type Params = {
  id: string,
  type: string
}
type ExtendedPackStore = PackStore & {
  storeInfo: Store,
  storeLocation?: string
}
type ActionButton = {
  text: string,
  cssClass?: string,
  handler(): void
}
const PackDetails = () => {
  const {state, dispatch} = useContext(StateContext)
  const params = useParams<Params>()
  const [pack] = useState(() => state.packs.find(p => p.id === params.id)!)
  const [isAvailable, setIsAvailable] = useState(false)
  const [otherProducts] = useState(() => state.packs.filter(pa => pa.product.id !== pack?.product.id && pa.product.categoryId === pack?.product.categoryId))
  const [otherPacks] = useState(() => state.packs.filter(pa => pa.id !== pack?.id && pa.product.id === pack?.product.id))
  const [actionOpened, setActionOpened] = useState(false);
  const [ratingOpened, setRatingOpened] = useState(false);
  const [packStores, setPackStores] = useState<ExtendedPackStore[]>([])
  const [trademarkName] = useState(() => state.trademarks.find(t => t.id === pack.product.trademarkId)?.name)
  const [countryName] = useState(() => state.countries.find(c => c.id === pack.product.countryId)!.name)
  const [myPrice] = useState(() => state.packStores.find(ps => ps.packId === pack.id && ps.storeId === state.userInfo?.storeId)?.price)
  const [storeLocation] = useState(() => state.stores.find(s => s.id === state.userInfo?.storeId)?.locationId)
  const [stores] = useState(() => state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId).length)
  const [nearStores] = useState(() => state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId && state.stores.find(s => s.id === ps.storeId)?.locationId === storeLocation).length)
  const [bestPriceStores] = useState(() => state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId && ps.price === pack.price).length)
  const [bestPriceNearStores] = useState(() => state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId && ps.price === pack.price && state.stores.find(s => s.id === ps.storeId)?.locationId === storeLocation).length)
  const [salesmen] = useState(() => state.packStores.filter(ps => ps.packId === pack.id && !ps.isRetail && ps.storeId !== state.userInfo?.storeId).length)
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast();
  const [alert] = useIonAlert();
  const [showAlert, setShowAlert] = useState(false)
  const [transType, setTransType] = useState('')
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([])
  useEffect(() => {
    if (state.userInfo?.type === 'n') {
      setPackStores(() => {
        const packStores = state.packStores.filter(p => p.packId === pack?.id)
        const results = packStores.map(p => {
          const storeInfo = state.stores.find(s => s.id === p.storeId)!
          const storeLocation = state.locations.find(l => l.id === storeInfo.locationId)?.name
          return {
            ...p,
            storeInfo,
            storeLocation
          }
        })
        return results.sort((r1, r2) => r1.price > r2.price ? 1 : -1)
      })
    }
  }, [state.packStores, state.stores, state.locations, state.user, pack, state.userInfo])
  useEffect(() => {
    setIsAvailable(() => Boolean(state.packStores.find(p => p.storeId === state.userInfo?.storeId && p.packId === pack?.id)))
  }, [state.packStores, state.userInfo, pack])
  useEffect(() => {
    setActionButtons(() => {
      const buttons = []
      let i = 0
      if (state.userInfo?.storeId) {
        if (!state.storeRequests.find(r => r.packId === pack?.id && r.storeId === state.userInfo?.storeId)) {
          buttons.push({
            text: labels.newRequest,
            cssClass: randomColors[i++ % 5].name,
            handler: () => handleNewRequest()
          })
        }
        if (isAvailable) {
          buttons.push({
            text: labels.unAvailable,
            cssClass: randomColors[i++ % 5].name,
            handler: () => handleUnAvailable()
          })
          buttons.push({
            text: labels.changePrice,
            cssClass: randomColors[i++ % 5].name,
            handler: () => handleAvailable('c')
          })
        } else {
          buttons.push({
            text: labels.available,
            cssClass: randomColors[i++ % 5].name,
            handler: () => handleAvailable('n')
          })
        }
        if (!pack.subPackId) {
          buttons.push({
            text: labels.addPack,
            cssClass: randomColors[i++ % 5].name,
            handler: () => history.push(`/add-pack/${params.id}`)
          })
          buttons.push({
            text: labels.addGroup,
            cssClass: randomColors[i++ % 5].name,
            handler: () => history.push(`/add-group/${params.id}`)
          })
        }
      } else {
        if (!state.basket.find(p => p.id === params.id)) {
          buttons.push({
            text: labels.addToBasket,
            cssClass: randomColors[i++ % 5].name,
            handler: () => dispatch({type: 'ADD_TO_BASKET', payload: pack})
          })
        }
        if (!state.ratings.find(r => r.productId === pack.product.id)) {
          buttons.push({
            text: labels.rateProduct,
            cssClass: randomColors[i++ % 5].name,
            handler: () => setRatingOpened(true)
          })
        } 
        if (otherProducts.length > 0) {
          buttons.push({
            text: labels.otherProducts,
            cssClass: randomColors[i++ % 5].name,
            handler: () => history.push(`/hints/${pack.id}/type/a`)
          })
        }
        if (otherPacks.length > 0) {
          buttons.push({
            text: labels.otherPacks,
            cssClass: randomColors[i++ % 5].name,
            handler: () => history.push(`/hints/${pack.id}/type/p`)
          })
        }
      }
      return buttons
    })
  }, [pack, params, state.userInfo, state.basket, state.ratings, state.storeRequests, isAvailable, dispatch, history, otherProducts, otherPacks])
  const deletePrice = (flag: boolean) => {
    try{
      const storePack = state.packStores.find(p => p.storeId === state.userInfo?.storeId && p.packId === pack?.id)!
      deleteStorePack(storePack, state.packStores, state.packs, flag)
      if (flag) dispatch({type: 'ADD_TO_BASKET', payload: pack})
      message(flag ? labels.addSuccess : labels.deleteSuccess, 3000)
      history.goBack()
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleUnAvailable = () => {
    alert({
      header: labels.newRequestTitle,
      message: labels.newRequestText,
      buttons: [
        {text: labels.cancel, handler: () => deletePrice(false)},
        {text: labels.ok, handler: () => deletePrice(true)},
      ],
    })
  }

  const handleNewRequest = () => {
    try{
      addStoreRequest(state.userInfo?.storeId!, pack?.id!)
      dispatch({type: 'ADD_TO_BASKET', payload: pack})
      message(labels.addSuccess, 3000)
      history.goBack()
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleAddPackStore = (value: string) => {
    try{
      if (+value !== Number((+value).toFixed(2))) {
        throw new Error('invalidPrice')
      }
      if (+value <= 0) {
        throw new Error('invalidPrice')
      }
      if (transType === 'c' && +value === state.packStores.find(p => p.packId === pack?.id && p.storeId === state.userInfo?.storeId)?.price) {
        throw new Error('samePrice')
      }
      if (Math.abs(+value - pack?.price!) / pack?.price! <= setup.priceDiff) {
        throw new Error('invalidChangePrice')
      }
      const storePack = {
        packId: pack?.id!,
        storeId: state.userInfo?.storeId!,
        isRetail: state.userInfo?.type === 's',
        price: +value,
        time: new Date()
      }
      if (transType === 'n') addPackStore(storePack, state.packs, state.storeRequests)
      else changePrice(storePack, state.packStores)
      message(transType === 'n' ? labels.addSuccess : labels.editSuccess, 3000)
      history.goBack()
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleAvailable = (type: string) => {
    setTransType(type)
    setShowAlert(true)
  }
  const handleRate = (value: number) => {
    try{
      rateProduct(pack?.product!, value, state.packs)
      message(labels.ratingSuccess, 3000)   
		} catch (err){
      message(getMessage(location.pathname, err), 3000)
    }
  }
  
  if (!pack) return <IonPage><h1>loading...</h1></IonPage>
  return (
    <IonPage>
      <Header title={pack.product.name} />
      <IonContent fullscreen>
        <IonCard>
          <IonGrid>
            <IonRow>
              <IonCol>{pack.name}</IonCol>
              <IonCol className="ion-text-end">{pack.price!.toFixed(2)}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonImg src={pack.imageUrl || pack.product.imageUrl} alt={labels.noImage} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>{productOfText(countryName, trademarkName)}</IonCol>
              <IonCol className="ion-text-end"><RatingStars rating={pack.product.rating ?? 0} count={pack.product.ratingCount ?? 0} /></IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
        {state.user && 
          <IonFab vertical="top" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setActionOpened(true)}>
              <IonIcon ios={menuOutline} />
            </IonFabButton>
          </IonFab>
        }
        {!state.user && 
          <IonButton 
            expand="block"
            color="success"
            routerLink="/login"
            className="h-padding"
          >
            {labels.showPackStores}
          </IonButton>
        }
        {state.userInfo?.type === 'n' &&
          <IonList>
            {packStores.map((p, i) => 
              <IonItem key={i} routerLink={`/store-details/${p.storeId}/${p.packId}`}>
                <IonLabel>
                  <div className="list-row1">{p.storeInfo.name}</div>
                  <div className="list-row2">{p.storeLocation || p.storeInfo.address}</div>
                </IonLabel>
                <IonLabel slot="end" className="ion-text-end">{p.price.toFixed(2)}</IonLabel>
              </IonItem>
            )}
          </IonList>
        }
        {state.user && state.userInfo?.type !== 'n' &&
          <IonList>
            <IonItem>
              <IonLabel>{labels.myPrice}</IonLabel>
              <IonLabel slot="end" className="ion-text-end">{myPrice?.toFixed(2)}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>{labels.storesCount}</IonLabel>
              <IonLabel slot="end" className="ion-text-end">{stores.toString()}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>{labels.nearBy}</IonLabel>
              <IonLabel slot="end" className="ion-text-end">{nearStores.toString()}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>{labels.bestStoresCount}</IonLabel>
              <IonLabel slot="end" className="ion-text-end">{bestPriceStores.toString()}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>{labels.bestStoresNearByCount}</IonLabel>
              <IonLabel slot="end" className="ion-text-end">{bestPriceNearStores.toString()}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>{labels.salesmenCount}</IonLabel>
              <IonLabel slot="end" className="ion-text-end">{salesmen.toString()}</IonLabel>
            </IonItem>
          </IonList>
        }
        <IonActionSheet
          isOpen={actionOpened}
          onDidDismiss={() => setActionOpened(false)}
          buttons={actionButtons}
        />
        <IonActionSheet
          isOpen={ratingOpened}
          onDidDismiss={() => setRatingOpened(false)}
          buttons={[
            {
              text: labels.rateGood,
              icon: heartOutline,
              cssClass: 'success',
              handler: () => handleRate(5)
            },
            {
              text: labels.rateMiddle,
              icon: heartHalfOutline,
              cssClass: 'warning',
              handler: () => handleRate(3)
            },
            {
              text: labels.rateBad,
              icon: heartDislikeOutline,
              cssClass: 'danger',
              handler: () => handleRate(1)
            },
          ]}
        />
      </IonContent>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={labels.enterPrice}
        inputs={[{name: 'price', type: 'number'}]}
        buttons={[
          {
            text: 'Cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Ok',
            handler: (price) => handleAddPackStore(price)
          }
        ]}
      />
      <Footer />
    </IonPage>
  )
}

export default PackDetails
