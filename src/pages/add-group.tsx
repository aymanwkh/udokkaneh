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
  const [price, setPrice] = useState('')
  const [withGift, setWithGift] = useState(false)
  const [gift, setGift] = useState('')
  const [product] = useState(() => state.packs.find(p => p.id === props.id)!.product)
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleSubmit = () => {
    try{
      if (!withGift && +subQuantity <= 1) {
        throw new Error('invalidQuantity')
      }
      if (withGift && +subQuantity < 1) {
        throw new Error('invalidQuantity')
      }
      const name = `${+subQuantity > 1 ? subQuantity + 'x' : ''}${pack.name}${withGift ? '+' + gift : ''}`
      if (state.packs.find(p => p.product.id === pack.product.id && p.name === name)) {
        throw new Error('duplicateName')
      }
      const prices = [{
        storeId: state.userInfo?.storeId!,
        price: +price,
        time: new Date()
      }]
      const newPack = {
        name,
        product,
        prices,
        subPackId: props.id,
        subQuantity: +subQuantity,
        unitsCount: +subQuantity * pack.unitsCount!,
        byWeight: pack.byWeight,
        isArchived: false,
        specialImage: false,
        imageUrl: pack.imageUrl
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
          type="number" 
          onChange={e => setSubQuantity(e.target.value)}
          onInputClear={() => setSubQuantity('')}
        />
        <ListItem>
          <span>{labels.withGift}</span>
          <Toggle 
            name="byWeight" 
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
      </List>
      {subQuantity && price && (!withGift || gift) &&
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default AddGroup
