import { useContext, useEffect, useState } from 'react'
import { f7, Page, Navbar, Card, CardContent, CardHeader, CardFooter, Fab, Icon, Actions, ActionsButton, Preloader } from 'framework7-react'
import RatingStars from './rating-stars'
import { StateContext } from '../data/state-provider'
import { addPackPrice, changePrice, deleteStorePack, deletePackRequest, addPackRequest, addAlarm, showMessage, showError, getMessage, updateFavorites, productOfText } from '../data/actions'
import labels from '../data/labels'
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
  const [isAvailable, setIsAvailable] = useState(false)
  const [otherProducts, setOtherProducts] = useState<Pack[]>([])
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
    setIsAvailable(() => Boolean(state.packPrices.find(p => p.storeId === state.userInfo?.storeId && p.packId === pack?.id)))
  }, [state.packPrices, state.userInfo, pack])
  useEffect(() => {
    setOtherProducts(() => state.packs.filter(pa => pa.product.id !== pack?.product.id && pa.product.categoryId === pack?.product.categoryId))
    setOtherPacks(() => state.packs.filter(pa => pa.id !== pack?.id && pa.product.id === pack?.product.id))
  }, [pack, state.packs])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const deletePrice = (flag: boolean) => {
    try{
      const storePack = state.packPrices.find(p => p.storeId === state.userInfo?.storeId && p.packId === pack?.id)!
      deleteStorePack(storePack, state.packPrices, state.packs, flag)
      showMessage(flag ? labels.addSuccess : labels.deleteSuccess)
      f7.views.current.router.back()
    } catch(err) {
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }
  const handleUnAvailable = () => {
    f7.dialog.confirm(labels.newRequestText, labels.newRequestTitle, () => deletePrice(true), () => deletePrice(false))
  }
  const handleNewRequest = () => {
    try{
      addPackRequest(state.userInfo?.storeId!, pack?.id!)
      showMessage(labels.addSuccess)
      f7.views.current.router.back()
    } catch(err) {
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }
  const handleRemoveRequest = () => {
    try{
      deletePackRequest(state.userInfo?.storeId!, pack?.id!)
      showMessage(labels.deleteSuccess)
      f7.views.current.router.back()
    } catch(err) {
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }
  const handleAvailable = (type: string) => {
    f7.dialog.prompt(labels.price, labels.enterPrice, value => {
      try{
        if (Number(value) !== Number(Number(value).toFixed(2))) {
          throw new Error('invalidPrice')
        }
        if (Number(value) <= 0) {
          throw new Error('invalidPrice')
        }
        const storePack = {
          packId: pack?.id!,
          storeId: state.userInfo?.storeId!,
          price: +value,
          time: new Date()
        }
        if (type === 'n') addPackPrice(storePack, state.packs)
        else changePrice(storePack, state.packPrices)
        showMessage(type === 'n' ? labels.addSuccess : labels.editSuccess)
        f7.views.current.router.back()
        } catch(err) {
          setError(getMessage(f7.views.current.router.currentRoute.path, err))
      }
    })
  }

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
            {pack.price.toFixed(2)}
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
      {state.user &&
        <Fab position="left-top" slot="fixed" color="red" className="top-fab" onClick={() => setActionOpened(true)}>
          <Icon material="menu"></Icon>
        </Fab>
      }
      <Actions opened={actionOpened} onActionsClosed={() => setActionOpened(false)}>
        {!state.userInfo?.storeId &&
          <>
            <ActionsButton onClick={() => handleFavorite()}>{pack.product.id && state.userInfo?.favorites?.includes(pack.product.id) ? labels.removeFromFavorites : labels.addToFavorites}</ActionsButton>
            {otherProducts.length > 0 &&
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/hints/${pack.id}/type/p`)}>{labels.otherProducts}</ActionsButton>
            }
            {otherPacks.length > 0 &&
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/hints/${pack.id}/type/w`)}>{labels.otherPacks}</ActionsButton>
            }
          </>
        }
        {state.userInfo?.storeId && isAvailable && <>
          <ActionsButton onClick={handleUnAvailable}>
            {labels.unAvailable}
          </ActionsButton>
          <ActionsButton onClick={() => handleAvailable('c')}>
            {labels.changePrice}
          </ActionsButton>
        </>}
        {state.userInfo?.storeId && !isAvailable &&
          <ActionsButton onClick={() => handleAvailable('n')}>
            {labels.available}
          </ActionsButton>
        }
        {state.userInfo?.storeId && !isAvailable && state.packRequests.find(r => r.packId === pack?.id && r.storeId === state.userInfo?.storeId) && 
          <ActionsButton onClick={handleRemoveRequest}>
            {labels.removeRequest}
          </ActionsButton>
        }
        {state.userInfo?.storeId && !isAvailable && !state.packRequests.find(r => r.packId === pack?.id && r.storeId === state.userInfo?.storeId) && 
          <ActionsButton onClick={handleNewRequest}>
            {labels.newRequest}
          </ActionsButton>
        }
        {state.userInfo?.storeId && <>
          <ActionsButton onClick={() => f7.views.current.router.navigate(`/add-pack/${props.id}`)}>
            {labels.addPack}
          </ActionsButton>
          <ActionsButton onClick={() => f7.views.current.router.navigate(`/add-group/${props.id}`)}>
            {labels.addGroup}
          </ActionsButton>
        </>}
      </Actions>
    </Page>
  )
}

export default PackDetails
