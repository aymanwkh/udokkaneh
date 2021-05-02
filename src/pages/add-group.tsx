import {useState, useContext, useEffect} from 'react'
import {addPack, showMessage, showError, getMessage} from '../data/actions'
import {f7, Page, Navbar, List, ListInput, Fab, Icon} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'

type Props = {
  id: string
}
const AddGroup = (props: Props) => {
  const {state} = useContext(StateContext)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [packInfo] = useState(() => state.packs.find(p => p.id === props.id)!)
  const [subQuantity, setSubQuantity] = useState(0)
  const [price, setPrice] = useState(0)
  const [product] = useState(() => state.packs.find(p => p.id === props.id)!.product)
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const generateName = () => {
    let suggestedName
    if (subQuantity) {
      suggestedName = `${subQuantity > 1 ? subQuantity + '×' : ''}${packInfo.name}`
      if (!name) setName(suggestedName)
    }
  }
  const handleSubmit = () => {
    try{
      if (state.packs.find(p => p.product.id === props.id && p.name === name)) {
        throw new Error('duplicateName')
      }
      if (Number(subQuantity) <= 1) {
        throw new Error('invalidQuantity')
      }
      const prices = [{
        storeId: state.userInfo?.storeId!,
        price: +price,
        time: new Date()
      }]
      const pack = {
        name,
        product,
        prices,
        subPackId: props.id,
        subQuantity,
        typeUnits: subQuantity * packInfo.typeUnits!,
        standardUnits: subQuantity * packInfo.standardUnits!,
        byWeight: packInfo.byWeight,
        isArchived: false,
        unitId: packInfo.unitId,
        specialImage: false,
        imageUrl: packInfo.imageUrl
      }
      addPack(pack)
      showMessage(labels.addSuccess)
      f7.views.current.router.back()
    } catch(err) {
			setError(getMessage(f7.views.current.router.currentRoute.path, err))
		}
  }
  return (
    <Page>
      <Navbar title={`${labels.addGroupPage} ${product.name}`} backLink={labels.back} />
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
          name="subQuantity" 
          label={labels.quantity}
          value={subQuantity}
          clearButton
          type="number" 
          onChange={e => setSubQuantity(e.target.value)}
          onInputClear={() => setSubQuantity(0)}
          onBlur={() => generateName()}
        />
        <ListInput 
          name="price" 
          label={labels.price}
          value={price}
          clearButton
          type="number" 
          onChange={e => setPrice(e.target.value)}
          onInputClear={() => setPrice(0)}
        />
      </List>
      {name && subQuantity && price &&
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default AddGroup
