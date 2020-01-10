import React, { useContext, useMemo, useEffect, useState } from 'react'
import { f7, Block, Page, Navbar, Toolbar, Button } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import labels from '../data/labels'
import { getStorePacks, getMessage, showError } from '../data/actions'
import { randomColors, storeSummary } from '../data/config'

const StoreSummary = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const store = useMemo(() => state.stores.find(s => s.id === state.customer.storeId)
  , [state.stores, state.customer])
  useEffect(() => {
    const retreiveStorePacks = async () => {
      try{
        setInprocess(true)
        const storePacks = await getStorePacks(state.customer)
        setInprocess(false)
        dispatch({type: 'SET_STORE_PACKS', storePacks})
      } catch(err) {
        setInprocess(false)
        setError(getMessage(props, err))
      }
    }
    if (state.storePacks.length === 0 || state.lastRetreive < store.lastUpdate) {
      retreiveStorePacks()
    }
  }, [state.storePacks, state.customer, state.lastRetreive, store, dispatch, props])
  const sections = useMemo(() => {
    const storePacks = state.storePacks.map(p => {
      const packInfo = state.packs.find(pa => pa.id === p.packId)
      return {
        ...p,
        packInfo
      }
    })
    const sections = storeSummary.map(s => {
      const packs = storePacks.filter(p => (s.id === 'a') 
                                        || (s.id === 'o' && p.price > p.packInfo.price) 
                                        || (s.id === 'n' && p.price === p.packInfo.price && p.storeId !== p.packInfo.minStoreId)
                                        || (s.id === 'l' && p.price === p.packInfo.price && p.storeId === p.packInfo.minStoreId))
      return {
        ...s,
        count: packs.length
      }
    })
    return sections
  }, [state.storePacks, state.packs])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
    useEffect(() => {
    if (inprocess) {
      f7.dialog.preloader(labels.inprocess)
    } else {
      f7.dialog.close()
    }
  }, [inprocess])
  let i = 0
  return(
    <Page>
      <Navbar title={store.name} backLink={labels.back} />
      <Block>
        {sections.map(s => 
          <Button large fill className="sections" color={randomColors[i++ % 10].name} href={`/store-packs/${s.id}`} key={s.id}>
            {`${s.name} (${s.count})`}
          </Button>
        )}
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default StoreSummary
