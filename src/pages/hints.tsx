import {useContext, useState, useEffect} from 'react'
import {Block, Page, Navbar, List, ListItem} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {productOfText} from '../data/actions'
import {Pack} from '../data/types'

type Props = {
  id: string,
  type: string
}
type ExtendedPack = Pack & {
  categoryName: string,
  countryName: string,
  trademarkName?: string
}
const Hints = (props: Props) => {
  const {state} = useContext(StateContext)
  const [pack] = useState(() => state.packs.find(p => p.id === props.id))
  const [packs, setPacks] = useState<ExtendedPack[]>([])
  useEffect(() => {
    setPacks(() => {
      const packs = state.packs.filter(p => 
        (props.type === 'a' && p.product.id !== pack?.product.id && p.product.categoryId === pack?.product.categoryId) ||
        (props.type === 'p' && p.id !== pack?.id && p.product.id === pack?.product.id)
      )
      const results = packs.map(p => {
        const categoryInfo = state.categories.find(c => c.id === p.product.categoryId)!
        const trademarkInfo = state.trademarks.find(t => t.id === p.product.trademarkId)
        const countryInfo = state.countries.find(c => c.id === p.product.countryId)!
        return {
          ...p, 
          categoryName: categoryInfo.name,
          countryName: countryInfo.name,
          trademarkName: trademarkInfo?.name
        }
      })
      return results.sort((p1, p2) => p1.weightedPrice! - p2.weightedPrice!)  
    })
  }, [pack, state.packs, state.categories, state.trademarks, state.countries, props.type]) 
  return(
    <Page>
      <Navbar title={props.type === 'a' ? labels.otherProducts : labels.otherPacks} backLink={labels.back} />
      <Block>
        <List mediaList>
          {packs.length === 0 ? 
            <ListItem title={labels.noData} />
          : packs.map(p => 
              <ListItem
                link={`/pack-details/${p.id}/type/c`}
                title={p.product.name}
                subtitle={p.product.description}
                text={p.name}
                footer={`${labels.category}: ${p.categoryName}`}
                after={p.price!.toFixed(2)}
                key={p.id}
              >
                <img src={p.imageUrl || p.product.imageUrl} slot="media" className="img-list" alt={labels.noImage} />
                <div className="list-subtext1">{productOfText(p.countryName, p.trademarkName)}</div>
              </ListItem>
            )
          }
        </List>
      </Block>
    </Page>
  )
}

export default Hints