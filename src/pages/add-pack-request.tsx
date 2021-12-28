import { useState, useRef, ChangeEvent, useMemo } from 'react'
import { getMessage, addPackRequest } from '../data/actions'
import labels from '../data/labels'
import { IonButton, IonContent, IonFab, IonFabButton, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonSegment, IonSegmentButton, IonToggle, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation, useParams } from 'react-router'
import { checkmarkOutline } from 'ionicons/icons'
import { Pack, PackRequest, State, UserInfo } from '../data/types'
import { useSelector } from 'react-redux'

type Params = {
  id: string
}
const AddPackRequest = () => {
  const packs = useSelector<State, Pack[]>(state => state.packs)
  const userInfo = useSelector<State, UserInfo | undefined>(state => state.userInfo)
  const params = useParams<Params>()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [form, setForm] = useState('w')
  const [subCount, setSubCount] = useState('')
  const [withGift, setWithGift] = useState(false)
  const [gift, setGift] = useState('')
  const pack = useMemo(() => packs.find(p => p.id === params.id)!, [packs, params.id])
  const [specialImage, setSpecialImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [image, setImage] = useState<File>()
  const inputEl = useRef<HTMLInputElement | null>(null);
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast()
  const onUploadClick = () => {
    if (inputEl.current) inputEl.current.click();
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files
      if (!files || files.length === 0) return
      const filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        throw new Error('invalidFile')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        if (fileReader.result) setImageUrl(fileReader.result.toString())
      })
      fileReader.readAsDataURL(files[0])
      setImage(files[0])
    } catch (err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handleSubmit = () => {
    try{
      if (+price <= 0 || +price !== Number((+price).toFixed(2))) {
        throw new Error('invalidPrice')
      }
      if (form === 'g') {
        if (+subCount === 0 || +subCount !== Math.floor(+subCount)){
          throw new Error('invalidCount')
        }
        if (!withGift && +subCount === 1) {
          throw new Error('invalidCountWithoutGift')
        }
      }
      const packName = form === 'g' ? `${+subCount > 1 ? subCount + '×' : ''}${pack.name}${withGift ? '+' + gift : ''}` : name
      const packRequest: PackRequest = {
        id: Math.random().toString(),
        storeId: userInfo?.storeId!,
        siblingPackId: params.id,
        name: packName,
        price: +price,
        time: new Date()
      }
      if (form === 'g') {
        packRequest.subCount = +subCount
        packRequest.withGift = withGift
        packRequest.gift = gift
      }
      addPackRequest(packRequest, image)
      message(labels.sendRequestSuccess, 3000)
      history.goBack()
    } catch(err) {
			message(getMessage(location.pathname, err), 3000)
		}
  }
  return (
    <IonPage>
      <Header title={labels.addPack} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonSegment value={form} onIonChange={e => setForm(e.detail.value!)}>
            <IonSegmentButton value="w">
              <IonLabel>{labels.newWight}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="g">
              <IonLabel>{labels.newGroup}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="o">
              <IonLabel>{labels.others}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <IonItem>
            <IonLabel position="floating">
              {labels.productName}
            </IonLabel>
            <IonInput 
              value={pack.product.name} 
              readonly
            />
          </IonItem>
          {form === 'g' ? <>
            <IonItem>
              <IonLabel position="floating">
                {labels.count}
              </IonLabel>
              <IonInput 
                value={subCount} 
                type="number" 
                autofocus
                clearInput
                onIonChange={e => setSubCount(e.detail.value!)} 
              />
            </IonItem>
            <IonItem>
              <IonLabel>{labels.withGift}</IonLabel>
              <IonToggle checked={withGift} onIonChange={() => setWithGift(s => !s)} />
            </IonItem>
            {withGift &&
              <IonItem>
                <IonLabel position="floating">
                  {labels.gift}
                </IonLabel>
                <IonInput 
                  value={gift} 
                  type="text" 
                  clearInput
                  onIonChange={e => setGift(e.detail.value!)} 
                />
              </IonItem>
            }
          </> : 
            <IonItem>
              <IonLabel position="floating">
                {form === 'w' ? labels.weightVolume : labels.description}
              </IonLabel>
              <IonInput 
                value={name} 
                type="text" 
                autofocus
                clearInput
                onIonChange={e => setName(e.detail.value!)} 
              />
            </IonItem>
          }
          <IonItem>
            <IonLabel position="floating">
              {labels.price}
            </IonLabel>
            <IonInput 
              value={price} 
              type="number" 
              clearInput
              onIonChange={e => setPrice(e.detail.value!)} 
            />
          </IonItem>
          {form === 'o' &&
            <IonItem>
              <IonLabel>{labels.specialImage}</IonLabel>
              <IonToggle checked={specialImage} onIonChange={() => setSpecialImage(s => !s)} />
            </IonItem>
          }
          {specialImage && <>
            <input 
              ref={inputEl}
              type="file" 
              accept="image/*" 
              style={{display: "none"}}
              onChange={e => handleFileChange(e)}
            />
            <IonButton 
              expand="block" 
              fill="clear" 
              onClick={onUploadClick}
            >
              {labels.setImage}
            </IonButton>
            <IonImg src={imageUrl} alt={labels.noImage} />
          </>}
        </IonList>
      </IonContent>
      {price && (name || (form === 'g' && subCount && (gift || !withGift))) &&
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleSubmit} color="success">
            <IonIcon ios={checkmarkOutline} />
          </IonFabButton>
        </IonFab>
      }
    </IonPage>
  )
}
export default AddPackRequest
