import {useState, useContext, useEffect} from 'react'
import {addPack, showMessage, showError, getMessage} from '../data/actions'
import {f7, Page, Navbar, List, ListInput, Fab, Icon, ListItem, Toggle} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'

type Props = {
  id: string
}
const AddGroup = (props: Props) => {
  const {state} = useContext(StateContext)
  const [error, setError] = useState('')
  const [pack] = useState(() => state.packs.find(p => p.id === props.id)!)
  const [subQuantity, setSubQuantity] = useState('')
  const [quantityError, setQuantityError] = useState('')
  const [giftError, setGiftError] = useState('')
  const [price, setPrice] = useState('')
  const [withGift, setWithGift] = useState(false)
  const [gift, setGift] = useState('')
  const [forSale, setForSale] = useState(true)
  const [product] = useState(() => state.packs.find(p => p.id === props.id)!.product)
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  useEffect(() => {
    const validateQuantity = (value: number) => {
      if (value === 0 || value !== Math.floor(value) || (!withGift && value === 1)){
        setQuantityError(labels.invalidQuantity)
      } else {
        setQuantityError('')
      }
    }
    if (subQuantity) validateQuantity(+subQuantity)
    else setQuantityError('')
  }, [subQuantity, withGift])
  useEffect(() => {
    if (withGift && !gift) setGiftError(labels.enterValue)
    else setGiftError('')
  }, [withGift, gift])
  useEffect(() => {
    if (!forSale) setWithGift(false)
  }, [forSale])
  const handleSubmit = () => {
    try{
      const name = `${+subQuantity > 1 ? subQuantity + '×' : ''}${pack.name}${withGift ? '+' + gift : ''}`
      if (state.packs.find(p => p.product.id === pack.product.id && p.name === name)) {
        throw new Error('duplicateName')
      }
      const stores = [{
        storeId: state.userInfo?.storeId!,
        price: +price,
        isRetail: state.userInfo?.type === 's',
        time: new Date()
      }]
      const newPack = {
        name,
        product,
        stores,
        subPackId: props.id,
        subQuantity: +subQuantity,
        unitsCount: +subQuantity * pack.unitsCount!,
        byWeight: pack.byWeight,
        isArchived: false,
        specialImage: false,
        imageUrl: pack.imageUrl,
        withGift,
        forSale
      }
      addPack(newPack)
      showMessage(labels.addSuccess)
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
          name="subQuantity" 
          label={labels.quantity}
          value={subQuantity}
          clearButton
          autofocus
          errorMessage={quantityError}
          errorMessageForce
          type="number" 
          onChange={e => setSubQuantity(e.target.value)}
          onInputClear={() => setSubQuantity('')}
        />
        <ListItem>
          <span>{labels.forSale}</span>
          <Toggle 
            name="forSale" 
            color="green" 
            checked={forSale} 
            onToggleChange={() => setForSale(s => !s)}
          />
        </ListItem>
        {forSale && 
          <ListItem>
            <span>{labels.withGift}</span>
            <Toggle 
              name="withGift" 
              color="green" 
              checked={withGift} 
              onToggleChange={() => setWithGift(s => !s)}
            />
          </ListItem>
        }
        {withGift && 
          <ListInput 
            name="gift" 
            label={labels.gift}
            clearButton
            type="text" 
            errorMessage={giftError}
            errorMessageForce  
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
      </List>
      {subQuantity && price && !quantityError && !giftError &&
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default AddGroup
