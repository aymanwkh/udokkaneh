import { useEffect, useState} from 'react'
import RatingStars from './rating-stars'
import { addPackStore, changePrice, deleteStorePack, addStoreRequest, getMessage, productOfText, rateProduct, deleteStoreRequest, calcDistance, addToBasket, removeFromBasket } from '../data/actions'
import labels from '../data/labels'
import { BasketItem, CachedPack, Pack, PackStore, Rating, Region, State, Store, StoreRequest, UserInfo } from '../data/types'
import Footer from './footer'
import { setup, colors, userTypes } from '../data/config'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { IonActionSheet, IonButton, IonCard, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonRow, IonSegment, IonSegmentButton, IonText, IonToggle, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { menuOutline, heartOutline, heartDislikeOutline, heartHalfOutline } from 'ionicons/icons'
import moment from 'moment'
import 'moment/locale/ar'
import { useSelector } from 'react-redux'
import firebase from '../data/firebase'

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
  const cachedPacks = useSelector<State, CachedPack[]>(state => state.cachedPacks)
  const packs = useSelector<State, Pack[]>(state => state.packs)
  const packStores = useSelector<State, PackStore[]>(state => state.packStores)
  const stores = useSelector<State, Store[]>(state => state.stores)
  const regions = useSelector<State, Region[]>(state => state.regions)
  const basket = useSelector<State, BasketItem[]>(state => state.basket)
  const ratings = useSelector<State, Rating[]>(state => state.ratings)
  const storeRequests = useSelector<State, StoreRequest[]>(state => state.storeRequests)
  const userInfo = useSelector<State, UserInfo | undefined>(state => state.userInfo)
  const user = useSelector<State, firebase.User | undefined>(state => state.user)
  const params = useParams<Params>()
  const [pack, setPack] = useState<CachedPack>()
  const [isAvailable, setIsAvailable] = useState(false)
  const [otherProductsCount, setOtherProductsCount] = useState(0)
  const [actionOpened, setActionOpened] = useState(false)
  const [ratingOpened, setRatingOpened] = useState(false)
  const [nearbyOnly, setNearbyOnly] = useState(false)
  const [storesType, setStoresType] = useState('s')
  const [storeList, setStoreList] = useState<ExtendedStore[]>([])
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
    setPack(() => cachedPacks.find(p => p.id === params.id))
  }, [params.id, cachedPacks])
  useEffect(() => {
    if (pack) {
      setOtherProductsCount(() => packs.filter(pa => pa.product.id !== pack?.product.id && pa.product.categoryId === pack?.product.categoryId).length)
    }
  }, [pack, packs])
  useEffect(() => {
    if (!pack) return
    setMyPrice(() => packStores.find(ps => ps.packId === params.id && ps.storeId === userInfo?.storeId))
    setStoresCount(() => userInfo?.type === 's' ? packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== userInfo?.storeId).length : 0)
    setNearStoresCount(() => userInfo?.type === 's' ? packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== userInfo?.storeId && calcDistance(userInfo?.position!, stores.find(s => s.id === ps.storeId)?.position!) < 1).length : 0)
    setBestPriceStoresCount(() => userInfo?.type === 's' ? packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== userInfo?.storeId && ps.price === pack.price).length : 0)
    setBestPriceNearStoresCount(() => userInfo?.type === 's' ? packStores.filter(ps => ps.packId === pack.id && ps.isRetail && ps.isActive && ps.storeId !== userInfo?.storeId && ps.price === pack.price && calcDistance(userInfo?.position!, stores.find(s => s.id === ps.storeId)?.position!) < 1).length : 0)
  }, [pack, params.id, packStores, userInfo, stores])
  useEffect(() => {
    if (!pack) return
    setStoreList(() => {
      let result, filteredPackStores
      if (storesType === 's') {
        switch (userInfo?.type){
          case 'n':
            filteredPackStores = packStores.filter(p => (p.packId === params.id || packs.find(pa => pa.id === p.packId && pa.product.id === pack.product.id)) && p.isActive && p.isRetail)
            break
          case 's':
          case 'r':
            filteredPackStores = packStores.filter(p => (p.packId === params.id || packs.find(pa => pa.id === p.packId && pa.product.id === pack.product.id)) && stores.find(s => s.id === p.storeId)?.type !== 's')
            break
          case 'd':
            filteredPackStores = packStores.filter(p => (p.packId === params.id || packs.find(pa => pa.id === p.packId && pa.product.id === pack.product.id)) && stores.find(s => s.id === p.storeId)?.type === 'w')
            break
          default:
            return []
        }
        result = filteredPackStores.map(s => {
          return {
            storeId: s.storeId,
            packId: s.packId,
            price: s.price,
            time: s.time
          }
        })
      } else {
        const requests = storeRequests.filter(r => r.packId === params.id || packs.find(pa => pa.id === r.packId && pa.product.id === pack.product.id))
        result = requests.map(r => {
          return {
            ...r,
            price: 0
          }
        })
      }
      const results = result.map(s => {
        const store = stores.find(ss => ss.id === s.storeId)!
        let distance = 1000
        if (userInfo?.position?.lat && store.position.lat) {
          distance = calcDistance(userInfo?.position, store.position)
        }
        return {
          ...store,
          distance,
          regionName: regions.find(r => r.id === store.regionId)?.name,
          typeName: userTypes.find(t => t.id === store.type)?.name,
          packId: s.packId,
          price: s.price,
          time: s.time
        }
      })
      if (nearbyOnly && userInfo?.position?.lat) {
        return results.filter(r => r.distance < 1).sort((r1, r2) => r1.price === r2.price ? (r1.claimsCount - r2.claimsCount) : (r1.price - r2.price))
      } else {
        return results.sort((r1, r2) => r1.distance - r2.distance)
      }
    })
  }, [pack, packStores, stores, packs, regions, userInfo, nearbyOnly, params.id, storeRequests, storesType])
  useEffect(() => {
    setIsAvailable(() => Boolean(packStores.find(p => p.storeId === userInfo?.storeId && p.packId === pack?.id)))
  }, [packStores, userInfo, pack])
  const deletePrice = (flag: boolean) => {
    try{
      const storePack = packStores.find(p => p.storeId === userInfo?.storeId && p.packId === pack?.id)!
      deleteStorePack(storePack, packs, packStores, flag)
      message(flag ? labels.addSuccess : labels.deleteSuccess, 3000)
      history.goBack()
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleUnAvailable = () => {
    if (userInfo?.type === 's') {
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
        storeId: userInfo?.storeId!,
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
      if (transType === 'c' && +value === packStores.find(p => p.packId === pack?.id && p.storeId === userInfo?.storeId)?.price) {
        throw new Error('samePrice')
      }
      if (userInfo?.type === 's' && pack?.price! > 0 && Math.abs(+value - pack?.price!) / pack?.price! > setup.priceDiff) {
        throw new Error('invalidChangePrice')
      }
      const storePack = {
        packId: pack?.id!,
        storeId: userInfo?.storeId!,
        isRetail: userInfo?.type === 's',
        price: +value,
        isActive: true,
        time: new Date()
      }
      if (transType === 'n') addPackStore(storePack, storeRequests)
      else changePrice(storePack, packStores)
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
      rateProduct(pack?.product!, value, packs)
      message(labels.ratingSuccess, 3000)
      history.goBack()   
		} catch (err){
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleDeleteRequest = () => {
    try{
      const storeRequest = storeRequests.find(p => p.storeId === userInfo?.storeId! && p.packId === pack?.id!)!
      if (userInfo?.storeId) {
        deleteStoreRequest(storeRequest, storeRequests, basket)
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
      removeFromBasket(pack.id!, basket)
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
          {!user && 
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
          {userInfo?.type === 'n' &&
            <IonItem>
              <IonLabel>{labels.nearbyOnly}</IonLabel>
              <IonToggle checked={nearbyOnly} onIonChange={() => setNearbyOnly(s => !s)} />
            </IonItem>
          }
          {userInfo?.storeId && userInfo?.type === 's' &&
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
          {userInfo?.type === 'd' &&
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
            {storeList.map((s, i) => 
              <IonItem key={i} routerLink={`/store-details/${s.id}/${s.packId}`}>
                <IonLabel>
                  <IonText style={{color: colors[0].name}}>{`${s.name}-${s.type === 'd' ? s.typeName : s.regionName}`}</IonText>
                  {s.packId !== pack?.id && <IonText style={{color: colors[1].name}}>{packs.find(p => p.id === s.packId)?.name}</IonText>}
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
      {user && userInfo?.isActive &&
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
            cssClass: userInfo && ['s', 'r'].includes(userInfo.type) && !storeRequests.find(r => r.packId === pack?.id && r.storeId === userInfo?.storeId) ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleNewRequest()
          },
          {
            text: labels.deleteRequest,
            cssClass: userInfo && ['s', 'r'].includes(userInfo.type) && storeRequests.find(r => r.packId === pack?.id && r.storeId === userInfo?.storeId) ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleDeleteRequest()
          },
          {
            text: labels.unAvailable,
            cssClass: userInfo && ['s', 'w', 'd'].includes(userInfo.type) && isAvailable ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleUnAvailable()
          },
          {
            text: labels.changePrice,
            cssClass: userInfo && ['s', 'w', 'd'].includes(userInfo.type) && isAvailable ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleAvailable('c')
          },
          {
            text: labels.available,
            cssClass: userInfo && ['s', 'w', 'd'].includes(userInfo.type) && !isAvailable ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleAvailable('n')
          },
          {
            text: labels.addPack,
            cssClass: userInfo && ['s', 'w', 'd'].includes(userInfo.type) && !pack?.subPackId ? colors[i++ % 10].name : 'ion-hide',
            handler: () => history.push(`/add-pack-request/${params.id}`)
          },
          {
            text: labels.addToBasket,
            cssClass: userInfo?.type === 'n' && !basket.find(i => i.packId === params.id) ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleAddToBasket()
          },
          {
            text: labels.removeFromBasket,
            cssClass: userInfo?.type === 'n' && basket.find(i => i.packId === params.id) ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleRemoveFromBasket()
          },
          {
            text: labels.rateProduct,
            cssClass: userInfo?.type === 'n' && !ratings.find(r => r.productId === pack?.product.id) ? colors[i++ % 10].name : 'ion-hide',
            handler: () => setRatingOpened(true)
          },
          {
            text: labels.otherProducts,
            cssClass: userInfo?.type === 'n' && otherProductsCount > 0 ? colors[i++ % 10].name: 'ion-hide',
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
