import { useState, useContext, useEffect } from 'react'
import { f7, Page, Navbar, List, ListInput, Fab, Icon } from 'framework7-react'
import { StateContext } from '../data/state-provider'
import { changePrice, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'
import { PackPrice } from '../data/types'

type Props = {
  id: string
}

const ChangePrice = (props: Props) => {
  const { state } = useContext(StateContext)
  const [error, setError] = useState('')
  const [pack] = useState(() => state.packs.find(p => p.id === props.id))
  const [storePack] = useState(() => state.packPrices.find(p => p.packId === props.id && p.storeId === state.userInfo?.storeId)!)
  const [price, setPrice] = useState(0)
  const [priceErrorMessage, setPriceErrorMessage] = useState('')
  useEffect(() => {
    const validatePrice = (value: number) => {
      if (value > 0 && value !== pack?.price) {
        setPriceErrorMessage('')
      } else {
        setPriceErrorMessage(labels.invalidPrice)
      } 
    }
    if (price) validatePrice(price)
  }, [price, pack])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const formatPrice = (value: number) => {
    return Number((+value).toFixed(2))
  } 
  const handleSubmit = () => {
    try{
      const newStorePack: PackPrice = {
        packId: props.id,
        storeId: state.userInfo?.storeId!,
        price: +price,
        time: new Date()
      }
      changePrice(newStorePack, state.packPrices)
      showMessage(labels.editSuccess)
      f7.views.current.router.back()
    } catch (err) {
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }

  if (!state.user) return <Page><h3 className="center"><a href="/login/">{labels.relogin}</a></h3></Page>
  return (
    <Page>
      <Navbar title={labels.changePrice} backLink={labels.back} />
      <List form>
        <ListInput 
          name="productName" 
          label={labels.productName}
          value={pack?.product.name}
          type="text" 
          readonly
        />
        <ListInput 
          name="packName" 
          label={labels.packName}
          value={pack?.name}
          type="text" 
          readonly
        />
        <ListInput 
          name="currentPrice" 
          label={labels.currentPrice}
          value={storePack?.price.toFixed(2)}
          type="number" 
          readonly
        />
        <ListInput 
          name="price" 
          label={labels.price}
          placeholder={labels.pricePlaceholder}
          clearButton 
          autofocus
          type="number" 
          value={price} 
          errorMessage={priceErrorMessage}
          errorMessageForce  
          onChange={e => setPrice(e.target.value)}
          onInputClear={() => setPrice(0)}
          onBlur={e => setPrice(formatPrice(e.target.value))}
        />
      </List>
      {!price || priceErrorMessage ? '' :
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default ChangePrice
