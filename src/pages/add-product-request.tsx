import {useState, useRef, ChangeEvent, useContext} from 'react'
import {getMessage, addProductRequest} from '../data/actions'
import labels from '../data/labels'
import { IonButton, IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonToggle, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation } from 'react-router'
import { StateContext } from '../data/state-provider'
import { checkmarkOutline } from 'ionicons/icons'

const AddProductRequest = () => {
  const {state} = useContext(StateContext)
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [weight, setWeight] = useState('')
  const [price, setPrice] = useState('')
  const [specialImage, setSpecialImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [image, setImage] = useState<File>()
  const inputEl = useRef<HTMLInputElement | null>(null);
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast();
  const onUploadClick = () => {
    if (inputEl.current) inputEl.current.click();
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files
      if (!files) return
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
      const productRequest = {
        id: Math.random().toString(),
        storeId: state.userInfo?.storeId!,
        name,
        country,
        weight,
        price: +price,
        imageUrl,
        time: new Date()
      }
      addProductRequest(productRequest, image)
      message(labels.sendRequestSuccess, 3000)
      history.goBack()
    } catch(err) {
			message(getMessage(location.pathname, err), 3000)
		}
  }
  return (
    <IonPage>
      <Header title={labels.addProductRequest} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating">
              {labels.name}
            </IonLabel>
            <IonInput 
              value={name} 
              type="text" 
              autofocus
              clearInput
              onIonChange={e => setName(e.detail.value!)} 
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              {labels.weightVolume}
            </IonLabel>
            <IonInput 
              value={weight} 
              type="text" 
              autofocus
              clearInput
              onIonChange={e => setWeight(e.detail.value!)} 
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              {labels.country}
            </IonLabel>
            <IonInput 
              value={country} 
              type="text" 
              autofocus
              clearInput
              onIonChange={e => setCountry(e.detail.value!)} 
            />
          </IonItem>
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
        {name && country && weight && price && imageUrl &&
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
export default AddProductRequest
