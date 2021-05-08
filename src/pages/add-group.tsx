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
  const [subCount, setSubCount] = useState('')
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
      if (+subCount === 0 || +subCount !== Math.floor(+subCount)){
        throw new Error('invalidCount')
      }
      if (!withGift && +subCount === 1) {
        throw new Error('invalidCountWithoutGift')
      }
      const name = `${+subCount > 1 ? subCount + '×' : ''}${pack.name}${withGift ? '+' + gift : ''}`
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
        subCount: +subCount,
        unitsCount: +subCount * pack.unitsCount!,
        byWeight: pack.byWeight,
        isArchived: false,
        specialImage: false,
        imageUrl: pack.imageUrl,
        withGift,
        forSale: state.userInfo?.type === 's'
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
