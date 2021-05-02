import {useState, useContext, useEffect} from 'react'
import {addPack, showMessage, showError, getMessage} from '../data/actions'
import {f7, Page, Navbar, List, ListItem, ListInput, Fab, Icon, Toggle} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'

type Props = {
  id: string
}
const AddPack = (props: Props) => {
  const {state} = useContext(StateContext)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [typeUnits, setTypeUnits] = useState(0)
  const [unitId, setUnitId] = useState('')
  const [byWeight, setByWeight] = useState(false)
  const [price, setPrice] = useState(0)
  const [product] = useState(() => state.packs.find(p => p.id === props.id)!.product)
  const [units] = useState(() => state.units.filter(u => u.type === product.unitType))
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])

  const generateName = () => {
    let suggestedName
    if (unitId && typeUnits) {
      suggestedName = `${typeUnits} ${state.units.find(u => u.id === unitId)!.name}`
      if (!name) setName(suggestedName)
    }
  }

  const handleSubmit = () => {
    try{
      if (state.packs.find(p => p.product.id === props.id && p.name === name)) {
        throw new Error('duplicateName')
      }
      const standardUnits = units.find(u => u.id === unitId)!.factor * typeUnits
      const prices = [{
        storeId: state.userInfo?.storeId!,
        price: +price,
        time: new Date()
      }]
      const pack = {
        name,
        product,
        prices,
        typeUnits,
        standardUnits,
        unitId,
        byWeight,
        isArchived: false,
        specialImage: false,
        imageUrl: state.packs.find(p => p.id === props.id)!.imageUrl
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
      <Navbar title={`${labels.addPack} ${product?.name}`} backLink={labels.back} />
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
        <ListItem>
          <span>{labels.byWeight}</span>
          <Toggle 
            name="byWeight" 
            color="green" 
            checked={byWeight} 
            onToggleChange={() => setByWeight(s => !s)}
          />
        </ListItem>
        {!byWeight &&
          <ListItem 
            title={labels.unit}
            smartSelect
            // @ts-ignore
            smartSelectParams={{
              // el: "#units", 
              openIn: "sheet",
              closeOnSelect: true, 
            }}
          >
            <select name="unitId" value={unitId} onChange={e => setUnitId(e.target.value)} onBlur={() => generateName()}>
              <option value=""></option>
              {units.map(u => 
                <option key={u.id} value={u.id}>{u.name}</option>
              )}
            </select>
          </ListItem>
        }
        {!byWeight &&
          <ListInput 
            name="typeUnits" 
            label={labels.unitsCount}
            clearButton
            type="number" 
            value={typeUnits} 
            onChange={e => setTypeUnits(e.target.value)}
            onInputClear={() => setTypeUnits(0)}
            onBlur={() => generateName()}
          />
        }
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
      {name && unitId && typeUnits &&
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default AddPack
