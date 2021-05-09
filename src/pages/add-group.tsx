import {useState, useContext, useEffect, useRef, ChangeEvent} from 'react'
import {addPackRequest, showMessage, showError, getMessage} from '../data/actions'
import {f7, Page, Navbar, List, ListInput, Fab, Icon, ListItem, Toggle, ListButton} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import { PackRequest } from '../data/types'

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
      if (+subCount === 0 || +subCount !== Math.floor(+subCount)){
        throw new Error('invalidCount')
      }
      if (!withGift && +subCount === 1) {
        throw new Error('invalidCountWithoutGift')
      }
      const packRequest = {
        id: Math.random().toString(),
        storeId: state.userInfo?.storeId!,
        siblingPackId: props.id,
        name: `${+subCount > 1 ? subCount + '×' : ''}${pack.name}${withGift ? '+' + gift : ''}`,
        price: +price,
        subCount: +subCount,
        specialImage,
        withGift,
        gift,
        time: new Date()
      }
      addPackRequest(packRequest, image)
      showMessage(labels.sendRequestSuccess)
      f7.views.current.router.back()
    } catch(err) {
			setError(getMessage(f7.views.current.router.currentRoute.path, err))
		}
  }
  return (
    <Page>
      <Navbar title={`${labels.addGroup} ${product.name}`} backLink={labels.back} />
      <List form inlineLabels>
        <ListInput 
          name="subCount" 
          label={labels.count}
          value={subCount}
          clearButton
          autofocus
          type="number" 
          onChange={e => setSubCount(e.target.value)}
          onInputClear={() => setSubCount('')}
        />
        <ListItem>
          <span>{labels.withGift}</span>
          <Toggle 
            name="withGift" 
            color="green" 
            checked={withGift} 
            onToggleChange={() => setWithGift(s => !s)}
          />
        </ListItem>
        {withGift && 
          <ListInput 
            name="gift" 
            label={labels.gift}
            clearButton
            type="text" 
            value={gift} 
            onChange={e => setGift(e.target.value)}
            onInputClear={() => setGift('')}
          />
        }
        <ListInput 
          name="price" 
          label={labels.price}
          value={price}
          clearButton
          type="number" 
          onChange={e => setPrice(e.target.value)}
          onInputClear={() => setPrice('')}
        />
        <ListItem>
          <span>{labels.specialImage}</span>
          <Toggle 
            name="specialImage" 
            color="green" 
            checked={specialImage} 
            onToggleChange={() => setSpecialImage(s => !s)}
          />
        </ListItem>
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
          <ListButton title={labels.setImage} onClick={onUploadClick} />
        }
        {specialImage &&
          <img src={imageUrl} className="img-card" alt={labels.noImage} />
        }
      </List>
      {subCount && price && (gift || !withGift) &&
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default AddGroup
