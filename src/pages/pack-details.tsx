import { useEffect, useState} from 'react'
import RatingStars from './rating-stars'
import { addPackStore, changePrice, deleteStorePack, addStoreRequest, getMessage, productOfText, rateProduct, deleteStoreRequest, calcDistance, addToBasket, removeFromBasket } from '../data/actions'
import labels from '../data/labels'
import { CachedPack, PackStore, State, Store } from '../data/types'
import Footer from './footer'
import { setup, colors, userTypes } from '../data/config'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { IonActionSheet, IonButton, IonCard, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonRow, IonSegment, IonSegmentButton, IonText, IonToggle, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { menuOutline, heartOutline, heartDislikeOutline, heartHalfOutline } from 'ionicons/icons'
import moment from 'moment'
import 'moment/locale/ar'
import { useSelector } from 'react-redux'

type Params = {
  id: string,
  type: string
}
type ExtendedStore = Store & {
  regionName?: string,
  typeName?: string,
  distance: number,
  packId: string,
  price: number,
  time: Date
}
const PackDetails = () => {
  const state = useSelector<State, State>(state => state)
  const params = useParams<Params>()
  const [pack, setPack] = useState<CachedPack>()
  const [isAvailable, setIsAvailable] = useState(false)
  const [otherProductsCount, setOtherProductsCount] = useState(0)
  const [actionOpened, setActionOpened] = useState(false)
  const [ratingOpened, setRatingOpened] = useState(false)
  const [nearbyOnly, setNearbyOnly] = useState(false)
  const [storesType, setStoresType] = useState('s')
  const [stores, setStores] = useState<ExtendedStore[]>([])
  const [myPrice, setMyPrice] = useState<PackStore>()
  const [storesCount, setStoresCount] = useState(0)
  const [nearStoresCount, setNearStoresCount] = useState(0)
  const [bestPriceStoresCount, setBestPriceStoresCount] = useState(0)
  const [bestPriceNearStoresCount, setBestPriceNearStoresCount] = useState(0)
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast()
  const [alert] = useIonAlert()
  const [transType, setTransType] = useState('')
  useEffect(() => {
    setPack(() => state.cachedPacks.find(p => p.id === params.id))
  }, [params.id, state.cachedPacks])
  useEffect(() => {
    if (pack) {
      setOtherProductsCount(() => state.packs.filter(pa => pa.product.id !== pack?.product.id && pa.product.categoryId === pack?.product.categoryId).length)
    }
  }, [pack, state.packs])
  useEffect(() => {
    if (!pack) return
    setMyPrice(() => state.packStores.find(ps => ps.packId === params.id && ps.storeId === state.userInfo?.storeId))
    setStoresCount(() => state.userInfo?.type === 's' ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== state.userInfo?.storeId).length : 0)
    setNearStoresCount(() => state.userInfo?.type === 's' ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== state.userInfo?.storeId && calcDistance(state.userInfo?.position!, state.stores.find(s => s.id === ps.storeId)?.position!) < 1).length : 0)
    setBestPriceStoresCount(() => state.userInfo?.type === 's' ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== state.userInfo?.storeId && ps.price === pack.price).length : 0)
    setBestPriceNearStoresCount(() => state.userInfo?.type === 's' ? state.packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== state.userInfo?.storeId && ps.price === pack.price && calcDistance(state.userInfo?.position!, state.stores.find(s => s.id === ps.storeId)?.position!) < 1).length : 0)
  }, [pack, params.id, state.packStores, state.userInfo, state.stores])
  useEffect(() => {
    if (!pack) return
    setStores(() => {
      let packStores, stores
      if (storesType === 's') {
        switch (state.userInfo?.type){
          case 'n':
            packStores = state.packStores.filter(p => (p.packId === params.id || state.packs.find(pa => pa.id === p.packId && pa.product.id === pack.product.id)) && p.isActive && p.isRetail)
            break
          case 's':
          case 'r':
            packStores = state.packStores.filter(p => (p.packId === params.id || state.packs.find(pa => pa.id === p.packId && pa.product.id === pack.product.id)) && state.stores.find(s => s.id === p.storeId)?.type !== 's')
            break
          case 'd':
            packStores = state.packStores.filter(p => (p.packId === params.id || state.packs.find(pa => pa.id === p.packId && pa.product.id === pack.product.id)) && state.stores.find(s => s.id === p.storeId)?.type === 'w')
            break
          default:
            return []
        }
        stores = packStores.map(s => {
          return {
            storeId: s.storeId,
            packId: s.packId,
            price: s.price,
            time: s.time
          }
        })
      } else {
        const storeRequests = state.storeRequests.filter(r => r.packId === params.id || state.packs.find(pa => pa.id === r.packId && pa.product.id === pack.product.id))
        stores = storeRequests.map(r => {
          return {
            ...r,
            price: 0
          }
        })
      }
      const results = stores.map(s => {
        const store = state.stores.find(ss => ss.id === s.storeId)!
        let distance = 1000
        if (state.userInfo?.position?.lat && store.position.lat) {
          distance = calcDistance(state.userInfo?.position, store.position)
        }
        return {
          ...store,
          distance,
          regionName: state.regions.find(r => r.id === store.regionId)?.name,
          typeName: userTypes.find(t => t.id === store.type)?.name,
          packId: s.packId,
          price: s.price,
          time: s.time
        }
      })
      if (nearbyOnly && state.userInfo?.position?.lat) {
        return results.filter(r => r.distance < 1).sort((r1, r2) => r1.price === r2.price ? (r1.claimsCount - r2.claimsCount) : (r1.price - r2.price))
      } else {
        return results.sort((r1, r2) => r1.distance - r2.distance)
      }
    })
  }, [pack, state.packStores, state.stores, state.packs, state.regions, state.user, state.userInfo, nearbyOnly, params.id, state.storeRequests, storesType])
  useEffect(() => {
    setIsAvailable(() => Boolean(state.packStores.find(p => p.storeId === state.userInfo?.storeId && p.packId === pack?.id)))
  }, [state.packStores, state.userInfo, pack])
  const deletePrice = (flag: boolean) => {
    try{
      const storePack = state.packStores.find(p => p.storeId === state.userInfo?.storeId && p.packId === pack?.id)!
      deleteStorePack(storePack, state.packs, state.packStores, flag)
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
      if (state.userInfo?.type === 's' && pack?.price! > 0 && Math.abs(+value - pack?.price!) / pack?.price! > setup.priceDiff) {
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
        deleteStoreRequest(storeRequest, state.storeRequests, state.basket)
        message(labels.deleteSuccess, 3000)
        history.goBack()
      } 
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleAddToBasket = () => {
    try {
      if (!pack) return
      addToBasket(pack.id!)
      message(labels.addSuccess, 3000)
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleRemoveFromBasket = () => {
    try {
      if (!pack) return
      removeFromBasket(pack.id!, state.basket)
      message(labels.deleteSuccess, 3000)
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  let i = 0
  return (
    <IonPage>
      {pack ? <>
        <Header title={pack.product.name} />
        <IonContent fullscreen>
          <IonCard>
            <IonGrid>
              <IonRow>
                <IonCol className="card-right">{pack.name}</IonCol>
                {(myPrice?.price || pack.price!) > 0 &&  <IonCol className={myPrice && !myPrice.isActive ? 'price-off' : 'price'}>{myPrice ? myPrice?.price.toFixed(2) : pack.price!.toFixed(2)}</IonCol>}
              </IonRow>
              <IonRow>
                <IonCol className="card-title">
                  {pack?.product.alias}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <img src={pack.imageUrl || pack.product.imageUrl} alt={labels.noImage} style={{width: '100%'}}/>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol style={{textAlign: 'center'}}>
                  {pack.product.description}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>{productOfText(pack.countryName, pack.trademarkName)}</IonCol>
                <IonCol className="ion-text-end"><RatingStars rating={pack.product.rating ?? 0} count={pack.product.ratingCount ?? 0} size="m"/></IonCol>
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
          {state.userInfo?.type === 'n' &&
            <IonItem>
              <IonLabel>{labels.nearbyOnly}</IonLabel>
              <IonToggle checked={nearbyOnly} onIonChange={() => setNearbyOnly(s => !s)} />
            </IonItem>
          }
          {state.userInfo?.storeId && state.userInfo?.type === 's' &&
            <IonGrid style={{margin: '5px'}}>
              <IonRow>
                <IonCol className="box" style={{backgroundColor: 'darkblue'}}>
                  <div>{labels.stores}</div>
                  <div>{labels.others}</div>
                  <div>{storesCount.toString()}</div>
                </IonCol>
                <IonCol className="box" style={{backgroundColor: 'deeppink'}}>
                  <div>{labels.stores}</div>
                  <div>{labels.nearby}</div>
                  <div>{nearStoresCount.toString()}</div>
                </IonCol>
                <IonCol className="box" style={{backgroundColor: 'darkgreen'}}>
                  <div>{labels.stores}</div>
                  <div>{labels.bestPrices}</div>
                  <div>{bestPriceStoresCount.toString()}</div>
                </IonCol>
                <IonCol className="box" style={{backgroundColor: 'red'}}>
                  <div>{labels.nearbyStores}</div>
                  <div>{labels.bestPrices}</div>
                  <div>{bestPriceNearStoresCount.toString()}</div>
                </IonCol>
              </IonRow>
            </IonGrid>
          }
          {state.userInfo?.type === 'd' &&
            <div style={{margin: '10px'}}>
              <IonSegment value={storesType} onIonChange={e => setStoresType(e.detail.value!)}>
                <IonSegmentButton value="s">
                  <IonLabel>{labels.wholeStores}</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="r">
                  <IonLabel>{labels.requests}</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>
          }
          <IonList className="list">
            {stores.map((s, i) => 
              <IonItem key={i} routerLink={`/store-details/${s.id}/${s.packId}`}>
                <IonLabel>
                  <IonText style={{color: colors[0].name}}>{`${s.name}-${s.type === 'd' ? s.typeName : s.regionName}`}</IonText>
                  {s.packId !== pack?.id && <IonText style={{color: colors[1].name}}>{state.packs.find(p => p.id === s.packId)?.name}</IonText>}
                  {s.type !== 'd' && <IonText style={{color: colors[2].name}}>{`${labels.distance}: ${Math.floor(s.distance * 1000)} ${labels.metre}`}</IonText>}
                  {storesType === 'r' && <IonText style={{color: colors[3].name}}>{moment(s.time).fromNow()}</IonText>}
                </IonLabel>
                {storesType !== 'r' && <IonLabel slot="end" className="ion-text-end">{s.price.toFixed(2)}</IonLabel>}
              </IonItem>
            )}
          </IonList>
        </IonContent>
      </> : <IonLoading isOpen={true} />
      }
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
            cssClass: state.userInfo && ['s', 'r'].includes(state.userInfo.type) && !state.storeRequests.find(r => r.packId === pack?.id && r.storeId === state.userInfo?.storeId) ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleNewRequest()
          },
          {
            text: labels.deleteRequest,
            cssClass: state.userInfo && ['s', 'r'].includes(state.userInfo.type) && state.storeRequests.find(r => r.packId === pack?.id && r.storeId === state.userInfo?.storeId) ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleDeleteRequest()
          },
          {
            text: labels.unAvailable,
            cssClass: state.userInfo && ['s', 'w', 'd'].includes(state.userInfo.type) && isAvailable ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleUnAvailable()
          },
          {
            text: labels.changePrice,
            cssClass: state.userInfo && ['s', 'w', 'd'].includes(state.userInfo.type) && isAvailable ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleAvailable('c')
          },
          {
            text: labels.available,
            cssClass: state.userInfo && ['s', 'w', 'd'].includes(state.userInfo.type) && !isAvailable ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleAvailable('n')
          },
          {
            text: labels.addPack,
            cssClass: state.userInfo && ['s', 'w', 'd'].includes(state.userInfo.type) && !pack?.subPackId ? colors[i++ % 10].name : 'ion-hide',
            handler: () => history.push(`/add-pack-request/${params.id}`)
          },
          {
            text: labels.addToBasket,
            cssClass: state.userInfo?.type === 'n' && !state.basket.find(i => i.packId === params.id) ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleAddToBasket()
          },
          {
            text: labels.removeFromBasket,
            cssClass: state.userInfo?.type === 'n' && state.basket.find(i => i.packId === params.id) ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleRemoveFromBasket()
          },
          {
            text: labels.rateProduct,
            cssClass: state.userInfo?.type === 'n' && !state.ratings.find(r => r.productId === pack?.product.id) ? colors[i++ % 10].name : 'ion-hide',
            handler: () => setRatingOpened(true)
          },
          {
            text: labels.otherProducts,
            cssClass: state.userInfo?.type === 'n' && otherProductsCount > 0 ? colors[i++ % 10].name: 'ion-hide',
            handler: () => history.push(`/packs/p/${pack?.id}/0`)
          },
        ]}
      />
      <IonActionSheet
        isOpen={ratingOpened}
        onDidDismiss={() => setRatingOpened(false)}
        buttons={[
          {
            text: labels.rateGood,
            icon: heartOutline,
            cssClass: 'good',
            handler: () => handleRate(5)
          },
          {
            text: labels.rateMiddle,
            icon: heartHalfOutline,
            cssClass: 'medium',
            handler: () => handleRate(3)
          },
          {
            text: labels.rateBad,
            icon: heartDislikeOutline,
            cssClass: 'bad',
            handler: () => handleRate(1)
          },
        ]}
      />
      <Footer />
    </IonPage>
  )
}

export default PackDetails
