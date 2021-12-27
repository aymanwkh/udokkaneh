import { useState, useEffect, useMemo } from 'react'
import { addClaim, getMessage, sendNotification } from '../data/actions'
import labels from '../data/labels'
import { IonActionSheet, IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation, useParams } from 'react-router'
import { menuOutline } from 'ionicons/icons'
import Footer from './footer'
import { colors, userTypes } from '../data/config'
import QRCode from 'qrcode'
import { useSelector } from 'react-redux'
import { Pack, PackStore, Region, State, Store, UserInfo } from '../data/types'
import firebase from '../data/firebase'

type Params = {
  storeId: string,
  packId: string
}
const StoreDetails = () => {
  const stores = useSelector<State, Store[]>(state => state.stores)
  const packs = useSelector<State, Pack[]>(state => state.packs)
  const packStores = useSelector<State, PackStore[]>(state => state.packStores)
  const regions = useSelector<State, Region[]>(state => state.regions)
  const userInfo = useSelector<State, UserInfo | undefined>(state => state.userInfo)
  const user = useSelector<State, firebase.User | undefined>(state => state.user)
  const params = useParams<Params>()
  const store = useMemo(() => stores.find(s => s.id === params.storeId)!, [stores, params.storeId])
  const pack = useMemo(() => packs.find(p => p.id === params.packId), [packs, params.packId])
  const price = useMemo(() => packStores.find(s => s.packId === params.packId && s.storeId === params.storeId)?.price, [packStores, params.storeId, params.packId])
  const [actionOpened, setActionOpened] = useState(false)
  const [message] = useIonToast();
  const location = useLocation()
  const history = useHistory()
  const [alert] = useIonAlert()
  useEffect(() => {
    QRCode.toCanvas(document.getElementById('canvas'), store.id || '', function (error) {
      if (error) console.error(error)
      console.log('success!');
    })
  }, [store])
  const handleAddClaim = () => {
    alert({
      header: labels.claimTitle,
      message: labels.claimText,
      buttons: [
        {text: labels.cancel},
        {text: labels.ok, handler: async () => {
          try{
            const packStore = packStores.find(s => s.storeId === params.storeId && s.packId === params.packId)
            if (packStore?.claimUserId === user?.uid){
              throw new Error('duplicateClaims')
            }
            addClaim(params.storeId, params.packId, packStores)
            message(labels.sendSuccess, 3000)
            history.goBack()
          } catch(err) {
            message(getMessage(location.pathname, err), 3000)
          }
        }},
      ],
    })
  }
  const handleConfirm = () => {
    const myStore = stores.find(s => s.ownerId === user?.uid)
    const typeName = userTypes.find(t => t.id === userInfo?.type)?.name
    let notificationText: string, messageText: string
    if (myStore?.type === 'd' && ['s', 'r'].includes(store.type)) {
      notificationText = `${labels.doYouWant} ${pack?.product.name} ${pack?.name}`
      messageText = labels.confirmRequest
    } else {
      notificationText = `${labels.isPack} ${pack?.product.name} ${pack?.name} ${labels.exists} ${price?.toFixed(2)}`
      messageText = labels.confirmAvailable
    }
    alert({
      header: labels.confirm,
      message: messageText,
      buttons: [
        {text: labels.cancel},
        {text: labels.ok, handler: async () => {
          try{
            const confirmMessage = {
              id: Math.random().toString(),
              userId: user?.uid || null,
              userName: `${userInfo?.name} ${myStore ? '-' + (myStore.type === 'd' ? typeName : myStore.name) : ''}` || '',
              title: labels.confirm,
              message: notificationText,
              isResponse: false,
              time: new Date()
            }        
            sendNotification(store.ownerId!, confirmMessage)
            message(labels.sendSuccess, 3000)
            history.goBack()
          } catch(err) {
            message(getMessage(location.pathname, err), 3000)
          }
        }},
      ],
    })
  }
  let i = 0
  return (
    <IonPage>
      <Header title={store.type === 'd' ? labels.salesmanDetails : labels.storeDetails} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.name}
            </IonLabel>
            <IonInput 
              value={store.name} 
              readonly
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.mobile}
            </IonLabel>
            <IonInput 
              value={store.mobile} 
              readonly
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.type}
            </IonLabel>
            <IonInput 
              value={userTypes.find(t => t.id === store.type)?.name} 
              readonly
            />
          </IonItem>
          {store.type !== 'd' && <>
            <IonItem>
              <IonLabel position="floating" color="primary">
                {labels.region}
              </IonLabel>
              <IonInput 
                value={regions.find(r => r.id === store.regionId)?.name || ''} 
                readonly
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating" color="primary">
                {labels.address}
              </IonLabel>
              <IonInput 
                value={store.address} 
                readonly
              />
            </IonItem>
            {userInfo?.type === 'n' &&
              <IonItem>
                <IonLabel position="floating" color="primary">
                  {labels.alarmsCount}
                </IonLabel>
                <IonInput 
                  value={store.claimsCount} 
                  readonly
                />
              </IonItem>
            }
          </>}
        {params.packId !== '0' && <>
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.productName}
            </IonLabel>
            <IonInput 
              value={pack?.product.name} 
              readonly
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.price}
            </IonLabel>
            <IonInput 
              value={price?.toFixed(2)} 
              readonly
            />
          </IonItem>
        </>}
        </IonList>
        <canvas id="canvas"></canvas>
      </IonContent>
      <IonFab vertical="top" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setActionOpened(true)}>
          <IonIcon ios={menuOutline}/>
        </IonFabButton>
      </IonFab>
      <IonActionSheet
        isOpen={actionOpened}
        onDidDismiss={() => setActionOpened(false)}
        buttons={[
          {
            text: labels.packs,
            cssClass: store.type !== 'r' ? colors[i++ % 10].name : 'ion-hide',
            handler: () => history.push(`/packs/s/0/${store.id}`)
          },
          {
            text: labels.map,
            cssClass: store.type !== 'd' ? colors[i++ % 10].name : 'ion-hide',
            handler: () => history.push(`/map/${store.position?.lat}/${store.position?.lng}/0`)
          },
          {
            text: labels.addClaim,
            cssClass: userInfo?.type === 'n' || store.type === 'w' ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleAddClaim()
          },
          {
            text: labels.confirm,
            cssClass: params.packId !== '0' ? colors[i++ % 10].name : 'ion-hide',
            handler: () => handleConfirm()
          },
        ]}
      />
      <Footer />
    </IonPage>
  )
}
export default StoreDetails
