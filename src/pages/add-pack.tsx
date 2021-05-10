import {useState, useContext, useEffect} from 'react'
import {addPackRequest, showMessage, showError, getMessage} from '../data/actions'
import {f7, Page, Navbar, List, ListInput, Fab, Icon} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
type Props = {
  id: string
}
const AddPack = (props: Props) => {
  const {state} = useContext(StateContext)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleSubmit = () => {
    try{
      if (+price <= 0 || +price !== Number((+price).toFixed(2))) {
        throw new Error('invalidPrice')
      }
      const packRequest = {
        id: Math.random().toString(),
        storeId: state.userInfo?.storeId!,
        siblingPackId: props.id,
        name,
        specialImage: false,
        price: +price,
        time: new Date()
      }
      addPackRequest(packRequest)
      showMessage(labels.sendRequestSuccess)
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
          label={labels.weightVolume}
          type="text" 
          clearButton
          autofocus
          value={name}
          onChange={e => setName(e.target.value)}
          onInputClear={() => setName('')}
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
      {price && name &&
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default AddPack
