import {useState, useContext, useEffect} from 'react'
import {addPack, showMessage, showError, getMessage} from '../data/actions'
import {f7, Page, Navbar, List, ListInput, Fab, Icon} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {units} from '../data/config'
type Props = {
  id: string
}
const AddPack = (props: Props) => {
  const {state} = useContext(StateContext)
  const [error, setError] = useState('')
  const [unitsCount, setUnitsCount] = useState('')
  const [unitsCountError, setUnitsCountError] = useState('')
  const [price, setPrice] = useState('')
  const [pack] = useState(() => state.packs.find(p => p.id === props.id)!)
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  useEffect(() => {
    if (state.packs.find(p => p.product.id === pack.product.id && p.unitsCount === +unitsCount)) {
      setUnitsCountError(labels.duplicatePack)
    } else {
      setUnitsCountError('')
    }
  }, [unitsCount, state.packs, pack])
  const handleSubmit = () => {
    try{
      
      const stores = [{
        storeId: state.userInfo?.storeId!,
        price: +price,
        isRetail: state.userInfo?.type === 's',
        time: new Date()
      }]
      const newPack = {
        name: `${unitsCount} ${units.find(u => u.id === pack.product.unit)!.name}`,
        product: pack.product,
        stores,
        unitsCount: +unitsCount,
        byWeight: pack.byWeight,
        isArchived: false,
        specialImage: false,
        forSale: true,
        imageUrl: state.packs.find(p => p.id === props.id)!.imageUrl
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
      <Navbar title={labels.addPack} backLink={labels.back} />
      <List form inlineLabels>
        <ListInput 
          name="name" 
          label={labels.name}
          type="text" 
          value={pack.product.name}
          readonly
        />
        <ListInput 
          name="unit" 
          label={labels.unit}
          type="text" 
          value={units.find(u => u.id === pack.product.unit)?.name}
          readonly
        />
        <ListInput 
          name="unitsCount" 
          label={labels.weightVolume}
          clearButton
          autofocus
          type="number" 
          errorMessage={unitsCountError}
          errorMessageForce
          value={unitsCount} 
          onChange={e => setUnitsCount(e.target.value)}
          onInputClear={() => setUnitsCount('')}
        />
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
      {price && unitsCount && !unitsCountError &&
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default AddPack
