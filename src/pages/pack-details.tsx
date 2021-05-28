import {useContext, useEffect, useState} from 'react'
import RatingStars from './rating-stars'
import {StateContext} from '../data/state-provider'
import {addPackStore, changePrice, deleteStorePack, addStoreRequest, getMessage, productOfText, rateProduct, deleteStoreRequest, calcDistance, addToBasket, removeFromBasket} from '../data/actions'
import labels from '../data/labels'
import {Store} from '../data/types'
import Footer from './footer'
import { setup, randomColors, userTypes } from '../data/config'
import { useHistory, useLocation, useParams } from 'react-router'
import { IonActionSheet, IonAvatar, IonBadge, IonButton, IonCard, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonToggle, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { menuOutline, heartOutline, heartDislikeOutline, heartHalfOutline } from 'ionicons/icons'
import moment from 'moment'
import 'moment/locale/ar'

type Params = {
  id: string,
  type: string
}
type ExtendedStores = Store & {
  storeInfo?: string,
  distance: number,
  price: number,
  time?: Date
}
const PackDetails = () => {
  const {state} = useContext(StateContext)
  const params = useParams<Params>()
  const [pack] = useState(() => state.packs.find(p => p.id === params.id)!)
  const [isAvailable, setIsAvailable] = useState(false)
  const [otherProducts] = useState(() => state.packs.filter(pa => pa.product.id !== pack?.product.id && pa.product.categoryId === pack?.product.categoryId))
  const [otherPacks] = useState(() => state.packs.filter(pa => pa.id !== params.id && pa.product.id === pack?.product.id))
  const [actionOpened, setActionOpened] = useState(false)
  const [ratingOpened, setRatingOpened] = useState(false)
  const [nearbyOnly, setNearbyOnly] = useState(false)
  const [stores, setStores] = useState<ExtendedStores[]>([])
  const [trademarkName] = useState(() => state.trademarks.find(t => t.id === pack.product.trademarkId)?.name)
  const [countryName] = useState(() => state.countries.find(c => c.id === pack.product.countryId)!.name)
  const [myPrice] = useState(() => state.packStores.find(ps => ps.packId === params.id && ps.storeId === state.userInfo?.storeId)?.price || 0)
  const [storesCount] = useState(() => state.userInfo?.type === 's' ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== state.userInfo?.storeId).length : 0)
  const [nearStoresCount] = useState(() => state.userInfo?.type === 's' ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== state.userInfo?.storeId && calcDistance(state.userInfo?.position!, state.stores.find(s => s.id === ps.storeId)?.position!) < 1).length : 0)
  const [bestPriceStoresCount] = useState(() => state.userInfo?.type === 's' ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== state.userInfo?.storeId && ps.price === pack.price).length : 0)
  const [bestPriceNearStoresCount] = useState(() => state.userInfo?.type === 's' ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== state.userInfo?.storeId && ps.price === pack.price && calcDistance(state.userInfo?.position!, state.stores.find(s => s.id === ps.storeId)?.position!) < 1).length : 0)
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast()
  const [alert] = useIonAlert()
  const [transType, setTransType] = useState('')
  useEffect(() => {
    setStores(() => {
      let stores
      switch (state.userInfo?.type){
        case 'n':
          stores = state.stores.filter(s => state.packStores.find(p => p.storeId === s.id && p.packId === params.id && p.isActive && p.isRetail))
          break
        case 's':
          stores = state.stores.filter(s => state.packStores.find(p => p.storeId === s.id && p.packId === params.id && p.isActive && !p.isRetail))
          break
        case 'd':
          stores = state.stores.filter(s => state.storeRequests.find(r => r.storeId === s.id && r.packId === params.id))
          break
        default:
          return []
      }
      const results = stores.map(s => {
        let distance = 1000
        if (state.userInfo?.position?.lat && s.position.lat) {
          distance = calcDistance(state.userInfo?.position, s.position)
        }
        return {
          ...s,
          storeInfo: state.userInfo?.type === 'n' ? state.regions.find(r => r.id === s.regionId)?.name : userTypes.find(t => t.id === s.type)?.name,
          distance,
          price: state.packStores.find(p => p.packId === params.id && p.storeId === s.id)?.price || 0,
          time: state.storeRequests.find(r => r.storeId === s.id && r.packId === params.id)?.time
        }
      })
      if (nearbyOnly && state.userInfo?.position?.lat) {
        return results.filter(r => r.distance < 1).sort((r1, r2) => r1.price === r2.price ? (r1.claimsCount - r2.claimsCount) : (r1.price - r2.price))
      } else {
        return results.sort((r1, r2) => r1.distance - r2.distance)
      }
    })
  }, [state.packStores, state.stores, state.regions, state.user, pack, state.userInfo, nearbyOnly])
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
    if (state.userInfo?.type === 's') {
      alert({
        header: labels.newRequestTitle,
        message: labels.newRequestText,
        buttons: [
          {text: labels.no, handler: () => deletePrice(false)},
          {text: labels.yes, handler: () => deletePrice(true)},
        ],
      })
    } else {
      deletePrice(false)
    }
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
            shape="round"
            className="ion-padding-horizontal"
          >
            {labels.showPackStores}
          </IonButton>
        }
        {state.userInfo?.type === 'n' ?
          <IonItem>
            <IonLabel>{labels.nearbyOnly}</IonLabel>
            <IonToggle checked={nearbyOnly} onIonChange={() => setNearbyOnly(s => !s)} />
          </IonItem>
        : <>
        <IonGrid style={{margin: '5px'}}>
          <IonRow>
            <IonCol className="background1">
              <div>{labels.stores}</div>
              <div>{labels.others}</div>
              <div>{storesCount.toString()}</div>
            </IonCol>
            <IonCol className="background2">
              <div>{labels.stores}</div>
              <div>{labels.nearby}</div>
              <div>{nearStoresCount.toString()}</div>
            </IonCol>
            <IonCol className="background3">
              <div>{labels.stores}</div>
              <div>{labels.bestPrices}</div>
              <div>{bestPriceStoresCount.toString()}</div>
            </IonCol>
            <IonCol className="background4">
              <div>{labels.nearbyStores}</div>
              <div>{labels.bestPrices}</div>
              <div>{bestPriceNearStoresCount.toString()}</div>
            </IonCol>
          </IonRow>
        </IonGrid>
          {/* <IonBadge style={{marginRight: '5px'}}>
          </IonBadge>
          <IonBadge style={{marginRight: '5px'}} color="secondary">
          </IonBadge>
          <IonBadge style={{marginRight: '5px'}} color="success">
          </IonBadge>
          <IonBadge style={{marginRight: '5px'}} color="danger">
          </IonBadge> */}
        </>}      
        <IonList>
          {stores.map((s, i) => 
            <IonItem key={i} routerLink={`/store-details/${s.id}/${params.id}`}>
              <IonLabel>
                <IonText color={randomColors[0].name}>{s.name}</IonText>
                <IonText color={randomColors[1].name}>{s.storeInfo}</IonText>
                {state.userInfo?.type !== 's' && <IonText color={randomColors[2].name}>{`${labels.distance}: ${Math.floor(s.distance * 1000)} ${labels.metre}`}</IonText>}
                {s.time && <IonText color={randomColors[3].name}>{moment(s.time).fromNow()}</IonText>}
              </IonLabel>
              {s.price > 0 && <IonLabel slot="end" className="ion-text-end">{s.price.toFixed(2)}</IonLabel>}
            </IonItem>
          )}
        </IonList>
      </IonContent>
      {state.user && state.userInfo?.isActive &&
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
            cssClass: state.userInfo?.type === 's' && !state.storeRequests.find(r => r.packId === pack?.id && r.storeId === state.userInfo?.storeId) ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => handleNewRequest()
          },
          {
            text: labels.deleteRequest,
            cssClass: state.userInfo?.type === 's' && state.storeRequests.find(r => r.packId === pack?.id && r.storeId === state.userInfo?.storeId) ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => handleDeleteRequest()
          },
          {
            text: labels.unAvailable,
            cssClass: state.userInfo?.storeId && isAvailable ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => handleUnAvailable()
          },
          {
            text: labels.changePrice,
            cssClass: state.userInfo?.storeId && isAvailable ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => handleAvailable('c')
          },
          {
            text: labels.available,
            cssClass: state.userInfo?.storeId && !isAvailable ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => handleAvailable('n')
          },
          {
            text: labels.addPack,
            cssClass: state.userInfo?.storeId && !pack.subPackId ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => history.push(`/add-pack-request/${params.id}`)
          },
          {
            text: labels.addToBasket,
            cssClass: !state.userInfo?.storeId && !state.basket.includes(params.id) ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => handleAddToBasket()
          },
          {
            text: labels.removeFromBasket,
            cssClass: !state.userInfo?.storeId && state.basket.includes(params.id) ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => handleRemoveFromBasket()
          },
          {
            text: labels.rateProduct,
            cssClass: !state.userInfo?.storeId && !state.ratings.find(r => r.productId === pack.product.id) ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => setRatingOpened(true)
          },
          {
            text: labels.otherProducts,
            cssClass: !state.userInfo?.storeId && otherProducts.length > 0 ? randomColors[i++ % 7].name: 'ion-hide',
            handler: () => history.push(`/hints/${pack.id}/type/a`)
          },
          {
            text: labels.otherPacks,
            cssClass: !state.userInfo?.storeId && otherPacks.length > 0 ? randomColors[i++ % 7].name : 'ion-hide',
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
