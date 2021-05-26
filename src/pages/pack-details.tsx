import {useContext, useEffect, useState} from 'react'
import RatingStars from './rating-stars'
import {StateContext} from '../data/state-provider'
import {addPackStore, changePrice, deleteStorePack, addStoreRequest, getMessage, productOfText, rateProduct, deleteStoreRequest, calcDistance, addToBasket, removeFromBasket} from '../data/actions'
import labels from '../data/labels'
import {PackStore, Store} from '../data/types'
import Footer from './footer'
import { setup, randomColors } from '../data/config'
import { useHistory, useLocation, useParams } from 'react-router'
import { IonActionSheet, IonButton, IonCard, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonToggle, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { menuOutline, heartOutline, heartDislikeOutline, heartHalfOutline } from 'ionicons/icons'

type Params = {
  id: string,
  type: string
}
type ExtendedPackStore = PackStore & {
  storeInfo: Store,
  storeLocation?: string,
  distance: number
}
const PackDetails = () => {
  const {state} = useContext(StateContext)
  const params = useParams<Params>()
  const [pack] = useState(() => state.packs.find(p => p.id === params.id)!)
  const [isAvailable, setIsAvailable] = useState(false)
  const [otherProducts] = useState(() => state.packs.filter(pa => pa.product.id !== pack?.product.id && pa.product.categoryId === pack?.product.categoryId))
  const [otherPacks] = useState(() => state.packs.filter(pa => pa.id !== pack?.id && pa.product.id === pack?.product.id))
  const [actionOpened, setActionOpened] = useState(false)
  const [ratingOpened, setRatingOpened] = useState(false)
  const [nearbyOnly, setNearbyOnly] = useState(false)
  const [packStores, setPackStores] = useState<ExtendedPackStore[]>([])
  const [trademarkName] = useState(() => state.trademarks.find(t => t.id === pack.product.trademarkId)?.name)
  const [countryName] = useState(() => state.countries.find(c => c.id === pack.product.countryId)!.name)
  const [myPrice] = useState(() => state.packStores.find(ps => ps.packId === pack.id && ps.storeId === state.userInfo?.storeId)?.price)
  const [storePosition] = useState(() => state.userInfo?.storeId ? state.stores.find(s => s.id === state.userInfo?.storeId)?.position! : undefined)
  const [stores] = useState(() => state.userInfo?.storeId ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId).length : 0)
  const [nearStores] = useState(() => state.userInfo?.storeId ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId && calcDistance(storePosition!, state.stores.find(s => s.id === ps.storeId)?.position!) < 1).length : 0)
  const [bestPriceStores] = useState(() => state.userInfo?.storeId ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId && ps.price === pack.price).length : 0)
  const [bestPriceNearStores] = useState(() => state.userInfo?.storeId ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.storeId !== state.userInfo?.storeId && ps.price === pack.price && calcDistance(storePosition!, state.stores.find(s => s.id === ps.storeId)?.position!) < 1).length : 0)
  const [salesmen] = useState(() => state.packStores.filter(ps => ps.packId === pack.id && !ps.isRetail && ps.storeId !== state.userInfo?.storeId).length)
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast()
  const [alert] = useIonAlert()
  const [transType, setTransType] = useState('')
  useEffect(() => {
    if (state.userInfo?.type === 'n') {
      setPackStores(() => {
        const packStores = state.packStores.filter(p => p.packId === pack?.id)
        const results = packStores.map(p => {
          const storeInfo = state.stores.find(s => s.id === p.storeId)!
          let distance = 1000
          if (state.userInfo?.position?.lat && storeInfo.position.lat) {
            distance = calcDistance(state.userInfo?.position, storeInfo.position)
          }
          return {
            ...p,
            storeInfo,
            storeLocation: state.locations.find(l => l.id === storeInfo.locationId)?.name,
            distance
          }
        })
        if (nearbyOnly && state.userInfo?.position?.lat) {
          return results.filter(r => r.distance < 1).sort((r1, r2) => r1.price === r2.price ? (r1.storeInfo.claimsCount - r2.storeInfo.claimsCount) : (r1.price - r2.price))
        } else {
          return results.sort((r1, r2) => r1.distance - r2.distance)
        }
      })
    }
  }, [state.packStores, state.stores, state.locations, state.user, pack, state.userInfo, nearbyOnly])
  useEffect(() => {
    setIsAvailable(() => Boolean(state.packStores.find(p => p.storeId === state.userInfo?.storeId && p.packId === pack?.id)))
  }, [state.packStores, state.userInfo, pack])
  const deletePrice = (flag: boolean) => {
    try{
      const storePack = state.packStores.find(p => p.storeId === state.userInfo?.storeId && p.packId === pack?.id)!
      deleteStorePack(storePack, state.packStores, state.packs, flag)
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
        {text: labels.no, handler: () => deletePrice(false)},
        {text: labels.yes, handler: () => deletePrice(true)},
      ],
    })
  }
  const handleNewRequest = () => {
    try{
      const storeRequest = {
        storeId: state.userInfo?.storeId!,
        packId: pack?.id!,
        time: new Date()
      }
      addStoreRequest(storeRequest)
      message(labels.addSuccess, 3000)
      history.goBack()
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleAddPackStore = (value: string) => {
    try{
      if (+value !== Number((+value).toFixed(2)) || +value <= 0) {
        throw new Error('invalidPrice')
      }
      if (transType === 'c' && +value === state.packStores.find(p => p.packId === pack?.id && p.storeId === state.userInfo?.storeId)?.price) {
        throw new Error('samePrice')
      }
      if (Math.abs(+value - pack?.price!) / pack?.price! > setup.priceDiff) {
        throw new Error('invalidChangePrice')
      }
      const storePack = {
        packId: pack?.id!,
        storeId: state.userInfo?.storeId!,
        isRetail: state.userInfo?.type === 's',
        price: +value,
        isActive: true,
        time: new Date()
      }
      if (transType === 'n') addPackStore(storePack, state.storeRequests)
      else changePrice(storePack, state.packStores)
      message(transType === 'n' ? labels.addSuccess : labels.editSuccess, 3000)
      history.goBack()
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleAvailable = (type: string) => {
    setTransType(type)
    alert({
      header: labels.enterPrice,
      inputs: [{name: 'price', type: 'number'}],
      buttons: [
        {text: labels.cancel},
        {text: labels.ok, handler: (e) => handleAddPackStore(e.price)}
      ],
    })
  }
  const handleRate = (value: number) => {
    try{
      rateProduct(pack?.product!, value, state.packs)
      message(labels.ratingSuccess, 3000)
      history.goBack()   
		} catch (err){
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleDeleteRequest = () => {
    try{
      const storeRequest = state.storeRequests.find(p => p.storeId === state.userInfo?.storeId! && p.packId === pack?.id!)!
      if (state.userInfo?.storeId) {
        deleteStoreRequest(storeRequest, state.storeRequests)
        message(labels.deleteSuccess, 3000)
        history.goBack()
      } 
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleAddToBasket = () => {
    try {
      addToBasket(pack.id!)
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleRemoveFromBasket = () => {
    try {
      removeFromBasket(pack.id!)
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  let i = 0
  return (
    <IonPage>
      <Header title={pack.product.name} />
      <IonContent fullscreen>
        <IonCard>
          <IonGrid>
            <IonRow>
              <IonCol className="card-title">{pack.name}</IonCol>
              <IonCol className="price">{pack.price!.toFixed(2)}</IonCol>
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
        {!state.user && 
          <IonButton 
            expand="block"
            color="success"
            routerLink="/login"
            className="ion-padding-horizontal"
          >
            {labels.showPackStores}
          </IonButton>
        }
        {state.userInfo?.type === 'n' && <>
          <IonItem>
            <IonLabel>{labels.nearbyOnly}</IonLabel>
            <IonToggle checked={nearbyOnly} onIonChange={() => setNearbyOnly(s => !s)} />
          </IonItem>
          <IonList>
            {packStores.map((p, i) => 
              <IonItem key={i} routerLink={`/store-details/${p.storeId}/${p.packId}`}>
                <IonLabel>
                  <IonText color={randomColors[0].name}>{p.storeInfo.name}</IonText>
                  <IonText color={randomColors[1].name}>{p.storeLocation || p.storeInfo.address}</IonText>
                </IonLabel>
                <IonLabel slot="end" className="ion-text-end">{p.price.toFixed(2)}</IonLabel>
              </IonItem>
            )}
          </IonList>
        </>}
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
      </IonContent>
      {state.user && 
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setActionOpened(true)}>
            <IonIcon ios={menuOutline} />
          </IonFabButton>
        </IonFab>
      }
      <IonActionSheet
        isOpen={actionOpened}
        onDidDismiss={() => setActionOpened(false)}
        buttons={[
          {
            text: labels.newRequest,
            cssClass: state.userInfo?.storeId && !state.storeRequests.find(r => r.packId === pack?.id && r.storeId === state.userInfo?.storeId) ? randomColors[i++ % 5].name : 'ion-hide',
            handler: () => handleNewRequest()
          },
          {
            text: labels.deleteRequest,
            cssClass: state.userInfo?.storeId && state.storeRequests.find(r => r.packId === pack?.id && r.storeId === state.userInfo?.storeId) ? randomColors[i++ % 5].name : 'ion-hide',
            handler: () => handleDeleteRequest()
          },
          {
            text: labels.unAvailable,
            cssClass: state.userInfo?.storeId && isAvailable ? randomColors[i++ % 5].name : 'ion-hide',
            handler: () => handleUnAvailable()
          },
          {
            text: labels.changePrice,
            cssClass: state.userInfo?.storeId && isAvailable ? randomColors[i++ % 5].name : 'ion-hide',
            handler: () => handleAvailable('c')
          },
          {
            text: labels.available,
            cssClass: state.userInfo?.storeId && !isAvailable ? randomColors[i++ % 5].name : 'ion-hide',
            handler: () => handleAvailable('n')
          },
          {
            text: labels.addPack,
            cssClass: state.userInfo?.storeId && !pack.subPackId ? randomColors[i++ % 5].name : 'ion-hide',
            handler: () => history.push(`/add-pack/${params.id}`)
          },
          {
            text: labels.addToBasket,
            cssClass: !state.userInfo?.storeId && !state.basket.includes(params.id) ? randomColors[i++ % 5].name : 'ion-hide',
            handler: () => handleAddToBasket()
          },
          {
            text: labels.removeFromBasket,
            cssClass: !state.userInfo?.storeId && state.basket.includes(params.id) ? randomColors[i++ % 5].name : 'ion-hide',
            handler: () => handleRemoveFromBasket()
          },
          {
            text: labels.rateProduct,
            cssClass: !state.userInfo?.storeId && !state.ratings.find(r => r.productId === pack.product.id) ? randomColors[i++ % 5].name : 'ion-hide',
            handler: () => setRatingOpened(true)
          },
          {
            text: labels.otherProducts,
            cssClass: !state.userInfo?.storeId && otherProducts.length > 0 ? randomColors[i++ % 5].name: 'ion-hide',
            handler: () => history.push(`/hints/${pack.id}/type/a`)
          },
          {
            text: labels.otherPacks,
            cssClass: !state.userInfo?.storeId && otherPacks.length > 0 ? randomColors[i++ % 5].name : 'ion-hide',
            handler: () => history.push(`/hints/${pack.id}/type/p`)
          }
        ]}
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
      <Footer />
    </IonPage>
  )
}

export default PackDetails
