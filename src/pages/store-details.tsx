import {useContext, useState, useEffect} from 'react'
import {f7, Page, Navbar, List, ListInput, Fab, Icon, Actions, ActionsButton} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {addAlarm, getMessage, showMessage, showError} from '../data/actions'

type Props = {
  storeId: string,
  packId: string
}
const StoreDetails = (props: Props) => {
  const {state, dispatch} = useContext(StateContext)
  const [packStore] = useState(() => state.packStores.find(p => p.storeId === props.storeId && p.packId === props.packId))
  const [store, setStore] = useState(() => state.stores.find(s => s.id === props.storeId)!)
  const [actionOpened, setActionOpened] = useState(false);
  const [error, setError] = useState('')
  useEffect(() => {
    setStore(() => state.stores.find(s => s.id === props.storeId)!)
  }, [state.stores, props.storeId])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleAddAlarm = (type: string) => {
    f7.dialog.confirm(labels.confirmationText, labels.confirmationTitle, () => {
      try{
        if (state.alarms.find(a => a.storeId === props.storeId && a.time === new Date())){
          throw new Error('duplicateAlarms')
        }
        const alarm = {
          packId: props.packId,
          storeId: props.storeId,
          type,
          time: new Date()  
        }
        addAlarm(alarm)
        showMessage(labels.sendSuccess)
        f7.views.current.router.back()
      } catch(err) {
        setError(getMessage(f7.views.current.router.currentRoute.path, err))
      }
    })  
  }
  const handleAddToBasket = () => {
    dispatch({type: 'ADD_TO_BASKET', payload: packStore})
  }
  return (
    <Page>
      <Navbar title={labels.storeDetails} backLink={labels.back} />
      <List form inlineLabels>
        <ListInput 
          name="name" 
          label={labels.name}
          value={store.name}
          type="text" 
          readonly
        />
        <ListInput
          name="mobile"
          label={labels.mobile}
          value={store.mobile}
          type="number"
          readonly
        />
        <ListInput
          name="location"
          label={labels.location}
          value={state.locations.find(l => l.id === store.locationId)?.name || ''}
          type="text"
          readonly
        />
        <ListInput 
          name="address" 
          label={labels.address}
          value={store.address}
          type="text"
        />
      </List>
      <Fab position="left-top" slot="fixed" color="red" className="top-fab" onClick={() => setActionOpened(true)}>
        <Icon material="menu"></Icon>
      </Fab>
      <Actions opened={actionOpened} onActionsClosed={() => setActionOpened(false)}>
        {!state.basket.find(p => p.packId === props.packId) && 
          <ActionsButton onClick={handleAddToBasket}>
            {labels.addToBasket}
          </ActionsButton>
        }
        <ActionsButton onClick={() => handleAddAlarm('m')}>
          {labels.addNotFoundAlarm}
        </ActionsButton>
        <ActionsButton onClick={() => handleAddAlarm('p')}>
          {labels.addChangePriceAlarm}
        </ActionsButton>
      </Actions>
    </Page>
  )
}
export default StoreDetails
