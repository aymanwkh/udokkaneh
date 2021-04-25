import { useContext, useState, useEffect } from 'react'
import { Block, Page, Navbar, Button } from 'framework7-react'
import { StateContext } from '../data/state-provider'
import labels from '../data/labels'
import { randomColors, storeSummary } from '../data/config'

type ExtendedSections = {
  id: string,
  name: string,
  count: number
}
const StoreSummary = () => {
  const { state } = useContext(StateContext)
  const [sections, setSections] = useState<ExtendedSections[]>([])
  useEffect(() => {
    setSections(() => {
      const storePacks = state.packPrices.filter(p => p.storeId === state.userInfo?.storeId)
      const extendedStorePacks = storePacks.map(p => {
        const packInfo = state.packs.find(pa => pa.id === p.packId)
        return {
          ...p,
          packInfo
        }
      })
      const sections = storeSummary.map(s => {
        const packs = extendedStorePacks.filter(p => (s.id === 'a') 
                                          || (s.id === 'o' && p.price > (p.packInfo?.price ?? 0)) 
                                          || (s.id === 'n' && p.price === (p.packInfo?.price ?? 0))
                                          || (s.id === 'l' && p.price === (p.packInfo?.price ?? 0)))
        return {
          ...s,
          count: packs.length
        }
      })
      return sections
    })
  }, [state.packPrices, state.packs, state.userInfo])
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
    </Page>
  )
}

export default StoreSummary
