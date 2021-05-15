import {useState, useEffect, useRef, ChangeEvent, useContext} from 'react'
import {getMessage, addPackRequest} from '../data/actions'
import labels from '../data/labels'
import { IonButton, IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonToggle, useIonToast } from '@ionic/react'
import Header from './headeri'
import { useHistory, useLocation } from 'react-router'
import { StateContext } from '../data/state-provider'
import { checkmarkOutline } from 'ionicons/icons'

type Props = {
  id: string
}
const AddGroup = (props: Props) => {
  const {state} = useContext(StateContext)
  const [error, setError] = useState('')
  const [pack] = useState(() => state.packs.find(p => p.id === props.id)!)
  const [subCount, setSubCount] = useState('')
  const [price, setPrice] = useState('')
  const [specialImage, setSpecialImage] = useState(false)
  const [withGift, setWithGift] = useState(false)
  const [gift, setGift] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [image, setImage] = useState<File>()
  const inputEl = useRef<HTMLInputElement | null>(null);
  const [product] = useState(() => state.packs.find(p => p.id === props.id)!.product)
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast();
  useEffect(() => {
    if (error) {
      message(error, 3000)
      setError('')
    }
  }, [error])
  const onUploadClick = () => {
    if (inputEl.current) inputEl.current.click();
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const filename = files[0].name
    if (filename.lastIndexOf('.') <= 0) {
      setError(labels.invalidFile)
      return
    }
    const fileReader = new FileReader()
    fileReader.addEventListener('load', () => {
      if (fileReader.result) setImageUrl(fileReader.result.toString())
    })
    fileReader.readAsDataURL(files[0])
    setImage(files[0])
  }
  const handleSubmit = () => {
    try{
      if (+subCount === 0 || +subCount !== Math.floor(+subCount)){
        throw new Error('invalidCount')
      }
      if (!withGift && +subCount === 1) {
        throw new Error('invalidCountWithoutGift')
      }
      if (+price <= 0 || +price !== Number((+price).toFixed(2))) {
        throw new Error('invalidPrice')
      }
      const packRequest = {
        id: Math.random().toString(),
        storeId: state.userInfo?.storeId!,
        siblingPackId: props.id,
        name: `${+subCount > 1 ? subCount + '×' : ''}${pack.name}${withGift ? '+' + gift : ''}`,
        price: +price,
        subCount: +subCount,
        withGift,
        gift,
        time: new Date()
      }
      addPackRequest(packRequest, image)
      message(labels.sendRequestSuccess, 3000)
      history.goBack()
    } catch(err) {
			setError(getMessage(location.pathname, err))
		}
  }
  return (
    <IonPage>
      <Header title={`${labels.addGroup} ${product.name}`} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
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
          <IonItem>
            <IonLabel>{labels.specialImage}</IonLabel>
            <IonToggle checked={specialImage} onIonChange={() => setSpecialImage(s => !s)} />
          </IonItem>
          {specialImage &&
            <input 
              ref={inputEl}
              type="file" 
              accept="image/*" 
              style={{display: "none"}}
              onChange={e => handleFileChange(e)}
            />
          }
          {specialImage &&
            <IonButton 
              expand="block" 
              fill="clear" 
              onClick={onUploadClick}
            >
              {labels.setImage}
            </IonButton>
          }
          {specialImage &&
            <img src={imageUrl} className="img-card" alt={labels.noImage} />
          }
        </IonList>
        {subCount && price && (gift || !withGift) &&
          <IonFab vertical="top" horizontal="end" slot="fixed">
            <IonFabButton onClick={handleSubmit}>
              <IonIcon ios={checkmarkOutline} />
            </IonFabButton>
          </IonFab>
        }
      </IonContent>
    </IonPage>
  )
}
export default AddGroup
