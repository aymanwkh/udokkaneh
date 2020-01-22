import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, Toolbar, Button } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import labels from '../data/labels'
import { randomColors, storeSummary } from '../data/config'

const StoreSummary = props => {
  const { state } = useContext(StoreContext)
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
  let i = 0
  return(
    <Page>
      <Navbar title={labels.myPacks} backLink={labels.back} />
      <Block>
        {sections.map(s => 
          <Button 
            text={`${s.name} (${s.count})`} 
            large 
            fill 
            className="sections" 
            color={randomColors[i++ % 10].name} 
            href={`/store-packs/${s.id}`} 
            key={s.id}
          /> 
        )}
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default StoreSummary
