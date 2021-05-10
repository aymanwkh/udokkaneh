import {useState, useEffect, ChangeEvent, useRef, useContext} from 'react'
import {f7, Page, Navbar, List, ListInput, Fab, Icon, ListButton} from 'framework7-react'
import {addProductRequest, showMessage, showError, getMessage} from '../data/actions'
import labels from '../data/labels'
import { StateContext } from '../data/state-provider'

type Props = {
  id: string
}
const AddProductRequest = (props: Props) => {
  const {state} = useContext(StateContext)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [weight, setWeight] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<File>()
  const inputEl = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (error) {
      showError(error)
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
      showMessage(labels.sendRequestSuccess)
      f7.views.current.router.back()
    } catch(err) {
			setError(getMessage(f7.views.current.router.currentRoute.path, err))
		}
  }
  return (
    <Page>
      <Navbar title={labels.addProductRequest} backLink={labels.back} />
      <List form inlineLabels>
        <ListInput 
          name="name" 
          label={labels.name}
          clearButton
          autofocus
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)}
          onInputClear={() => setName('')}
        />
        <ListInput 
          name="weight" 
          label={labels.weightVolume}
          clearButton
          type="text" 
          value={weight} 
          onChange={e => setWeight(e.target.value)}
          onInputClear={() => setWeight('')}
        />
        <ListInput 
          name="country" 
          label={labels.country}
          clearButton
          type="text" 
          value={country} 
          onChange={e => setCountry(e.target.value)}
          onInputClear={() => setCountry('')}
        />
        <ListInput 
          name="price" 
          label={labels.price}
          value={price}
          clearButton
          type="number" 
          onChange={(e) => setPrice(e.target.value)}
          onInputClear={() => setPrice('')}
        />
        <input 
          ref={inputEl}
          type="file" 
          accept="image/*" 
          style={{display: "none"}}
          onChange={e => handleFileChange(e)}
        />
        <ListButton title={labels.setImage} onClick={onUploadClick} />
        <img src={imageUrl} className="img-card" alt={labels.noImage} />
      </List>
      {name && country && weight && price && imageUrl &&
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default AddProductRequest
