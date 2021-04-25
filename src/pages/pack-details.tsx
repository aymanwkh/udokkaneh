import { useContext, useEffect, useState } from 'react'
import { f7, Page, Navbar, Card, CardContent, CardHeader, CardFooter, Fab, Icon, Actions, ActionsButton, Preloader } from 'framework7-react'
import RatingStars from './rating-stars'
import { StateContext } from '../data/state-provider'
import { addAlarm, showMessage, showError, getMessage, updateFavorites, productOfText } from '../data/actions'
import labels from '../data/labels'
import { alarmTypes } from '../data/config'
import { Pack } from '../data/types'

type Props = {
  id: string,
  type: string
}
type ExtendedPack = Pack & {
  countryName: string,
  trademarkName?: string
}
const PackDetails = (props: Props) => {
  const { state } = useContext(StateContext)
  const [error, setError] = useState('')
  const [pack, setPack] = useState<ExtendedPack>()
  const [isAvailable, setIsAvailable] = useState(-1)
  const [otherProducts, setOtherProducts] = useState<Pack[]>([])
  const [otherOffers, setOtherOffers] = useState<Pack[]>([])
  const [otherPacks, setOtherPacks] = useState<Pack[]>([])
  const [actionOpened, setActionOpened] = useState(false);
  useEffect(() => {
    setPack(() => {
      const pack = state.packs.find(p => p.id === props.id)!
      const trademarkInfo = state.trademarks.find(t => t.id === pack.product.trademarkId)
      const countryInfo = state.countries.find(c => c.id === pack.product.countryId)!
      return {
        ...pack,
        trademarkName: trademarkInfo?.name,
        countryName: countryInfo.name
      }
    })
  }, [state.packs, state.trademarks, state.countries, props.id])
  useEffect(() => {
    pack && setIsAvailable(() => state.packPrices.find(p => p.storeId === state.userInfo?.storeId && p.packId === pack.id) ? 1 : -1)
  }, [state.packPrices, state.userInfo, pack])
  useEffect(() => {
    pack && setOtherProducts(() => state.packs.filter(pa => pa.product.categoryId === pack.product.categoryId && pa.product.rating > pack.product.rating))
    pack && setOtherOffers(() => state.packs.filter(pa => pa.product.id === pack.product.id && pa.id !== pack.id && (pa.isOffer || pa.offerEnd)))
    pack && setOtherPacks(() => state.packs.filter(pa => pa.product.id === pack.product.id && pa.weightedPrice < pack.weightedPrice))
  }, [pack, state.packs])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])

  const handleAddAlarm = (alarmTypeId: string) => {
    try {
      if (alarmTypeId === 'ua') {
        f7.dialog.confirm(labels.confirmationText, labels.confirmationTitle, () => {
          try{
            if (state.userInfo?.alarms?.find(a => a.packId === props.id && a.status === 'n')){
              throw new Error('duplicateAlarms')
            }
            const alarm = {
              packId: props.id,
              type: alarmTypeId,
              status: 'n'
            }
            addAlarm(alarm)
            showMessage(labels.sendSuccess)
            f7.views.current.router.back()
          } catch(err) {
            setError(getMessage(f7.views.current.router.currentRoute.path, err))
          }
        })  
      } else {
        if (state.userInfo?.alarms?.find(a => a.packId === props.id && a.status === 'n')){
          throw new Error('duplicateAlarms')
        }
        f7.views.current.router.navigate(`/add-alarm/${props.id}/type/${alarmTypeId}`)
      }  
    } catch(err) {
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }
  const handleFavorite = () => {
    try{
      if (state.userInfo && pack) {
        updateFavorites(state.userInfo, pack.product.id)
        showMessage(state.userInfo?.favorites?.includes(pack.product.id) ? labels.removeFavoriteSuccess : labels.addFavoriteSuccess)  
      }
		} catch (err){
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }
  if (!pack) return <Page><Preloader /></Page>
  return (
    <Page>
      <Navbar title={pack.product.name} backLink={labels.back} />
      <Card>
        <CardHeader className="card-header">
          <div className="price">
            {((pack.price ?? 0) / 100).toFixed(2)}
          </div>
        </CardHeader>
        <CardContent>
          <p className="card-title">{pack.name}</p>
          <img src={pack.imageUrl} className="img-card" alt={labels.noImage} />
          <p className="card-title">{pack.product.description}</p>
        </CardContent>
        <CardFooter>
          <p>{productOfText(pack.countryName, pack.trademarkName)}</p>
          <p><RatingStars rating={pack.product.rating ?? 0} count={pack.product.ratingCount ?? 0} /></p>
        </CardFooter>
      </Card>
      {state.user ?
        <Fab position="left-top" slot="fixed" color="red" className="top-fab" onClick={() => setActionOpened(true)}>
          <Icon material="menu"></Icon>
        </Fab>
      : ''}
      {props.type === 'c' && pack.isOffer ? <p className="note">{labels.offerHint}</p> : ''}
      <Actions opened={actionOpened} onActionsClosed={() => setActionOpened(false)}>
        {props.type === 'c' ? 
          <>
            <ActionsButton onClick={() => handleFavorite()}>{pack.product.id && state.userInfo?.favorites?.includes(pack.product.id) ? labels.removeFromFavorites : labels.addToFavorites}</ActionsButton>
            {otherProducts.length === 0 ? '' :
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/hints/${pack.id}/type/p`)}>{labels.otherProducts}</ActionsButton>
            }
            {otherOffers.length === 0 ? '' :
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/hints/${pack.id}/type/o`)}>{labels.otherOffers}</ActionsButton>
            }
            {otherPacks.length === 0 ? '' :
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/hints/${pack.id}/type/w`)}>{labels.otherPacks}</ActionsButton>
            }
          </>
        : ''}
        {props.type === 'o' && alarmTypes.map(p =>
          p.isAvailable === 0 || p.isAvailable === isAvailable ?
            <ActionsButton key={p.id} onClick={() => handleAddAlarm(p.id)}>
              {p.name}
            </ActionsButton>
          : ''
        )}
      </Actions>
    </Page>
  )
}

export default PackDetails
