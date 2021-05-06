import {useContext, useEffect, useState} from 'react'
import {f7, Block, Page, Navbar, List, ListItem, Toolbar, Actions, ActionsButton} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import Footer from './footer'
import {Pack} from '../data/types'
import {deletePackRequest, getMessage, productOfText, showError} from '../data/actions'

type ExtendedPack = Pack & {
  countryName: string,
  categoryName: string,
  trademarkName?: string
}
const Basket = () => {
  const {state, dispatch} = useContext(StateContext)
  const [currentPack, setCurrentPack] = useState<Pack | undefined>(undefined)
  const [basket, setBasket] = useState<ExtendedPack[]>([])
  const [error, setError] = useState('')
  const [actionOpened, setActionOpened] = useState(false);
  useEffect(() => {
    setBasket(() => {
      return state.basket.map(p => {
        const countryName = state.countries.find(c => c.id === p.product.countryId)!.name
        const categoryName = state.categories.find(c => c.id === p.product.categoryId)!.name
        const trademarkName = state.trademarks.find(t => t.id === p.product.trademarkId)?.name
        return {
          ...p,
          countryName,
          categoryName,
          trademarkName
        }
      })
    })
  }, [state.basket, state.stores, state.packs, state.categories, state.countries, state.trademarks])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleMore = (pack: Pack) => {
    setCurrentPack(pack)
    setActionOpened(true)
  }
  const handleDelete = () => {
    try{
      if (state.userInfo?.storeId) {
        deletePackRequest(state.packRequests.find(p => p.storeId === state.userInfo?.storeId! && p.packId === currentPack?.id!)!)
      } 
      dispatch({type: 'DELETE_FROM_BASKET', payload: currentPack})
    } catch(err) {
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }
  return(
    <Page>
    <Navbar title={labels.basket} backLink={labels.back} />
    <Block>
      <List mediaList>
        {basket.length === 0 ?
          <ListItem title={labels.noData} />
        : basket.map(p => 
          <ListItem
            title={p.product.name}
            subtitle={p.product.description}
            text={p.name}
            footer={p.categoryName}
            after={p.price?.toFixed(2)}
            key={p.id}
            className={(currentPack && currentPack.id === p.id) ? 'selected' : ''}
            onClick={()=> handleMore(p)}
          >
            <img src={p.imageUrl} slot="media" className="img-list" alt={labels.noImage}/>
            <div className="list-subtext1">{productOfText(p.countryName, p.trademarkName)}</div>
          </ListItem>
        )}
      </List>
    </Block>
    <Actions opened={actionOpened} onActionsClosed={() => setActionOpened(false)}>
      <ActionsButton onClick={() => f7.views.current.router.navigate(`/pack-details/${currentPack?.id}`)}>
        {labels.details}
      </ActionsButton>
      <ActionsButton onClick={handleDelete}>
        {labels.delete}
      </ActionsButton>
    </Actions>
    <Toolbar bottom>
      <Footer />
    </Toolbar>
  </Page>
  )
}
export default Basket