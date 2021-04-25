import { useContext, useState, useEffect } from 'react'
import { Block, Page, Navbar, List, ListItem, Badge } from 'framework7-react'
import { StateContext } from '../data/state-provider'
import moment from 'moment'
import 'moment/locale/ar'
import labels from '../data/labels'
import { storeSummary } from '../data/config'
import { productOfText } from '../data/actions'
import { PackPrice, Pack } from '../data/types'

type Props = {
  type: string
}
type ExtendedPackPrice = PackPrice & {
  packInfo: Pack,
  countryName: string,
  trademarkName?: string
}
const StorePacks = (props: Props) => {
  const { state } = useContext(StateContext)
  const [storePacks, setStorePacks] = useState<ExtendedPackPrice[]>([])
  useEffect(() => {
    setStorePacks(() => {
      const storePacks = state.packPrices.filter(p => p.storeId === state.userInfo?.storeId)
      const extendedStorePacks = storePacks.map(p => {
        const packInfo = state.packs.find(pa => pa.id === p.packId)!
        const trademarkInfo = state.trademarks.find(t => t.id === packInfo.product.trademarkId)
        const countryInfo = state.countries.find(c => c.id === packInfo.product.countryId)!
        return {
          ...p,
          packInfo,
          countryName: countryInfo.name,
          trademarkName: trademarkInfo?.name
        }
      })
      return extendedStorePacks.filter(p => (props.type === 'a')
                            || (props.type === 'o' && p.price > p.packInfo.price) 
                            || (props.type === 'n' && p.price === p.packInfo.price)
                            || (props.type === 'l' && p.price === p.packInfo.price))
    })
  }, [state.packPrices, state.packs, state.userInfo, state.trademarks, state.countries, props.type])
  let i = 0
  return(
    <Page>
      <Navbar title={storeSummary.find(s => s.id === props.type)?.name} backLink={labels.back} />
      <Block>
        <List mediaList>
          {storePacks.length === 0 ? 
            <ListItem title={labels.noData} /> 
          : storePacks.map(p => 
              <ListItem
                link={`/pack-details/${p.packId}/type/o`}
                title={p.packInfo?.product.name}
                subtitle={p.packInfo?.product.description}
                text={p.packInfo?.name}
                footer={moment(p.time).fromNow()}
                after={((p.packInfo?.price ?? 0) / 100).toFixed(2)}
                key={i++}
              >
                <img src={p.packInfo?.imageUrl} slot="media" className="img-list" alt={labels.noImage} />
                <div className="list-subtext1">{productOfText(p.countryName, p.trademarkName)}</div>
                {p.price > (p.packInfo?.price ?? 0) && <div className="list-subtext2">{`${labels.myPrice}: ${(p.price / 100).toFixed(2)}`}</div>}
                {p.packInfo?.isOffer && <Badge slot="title" color='green'>{labels.offer}</Badge>}
              </ListItem>
            )
          }
        </List>
      </Block>
    </Page>
  )
}

export default StorePacks
