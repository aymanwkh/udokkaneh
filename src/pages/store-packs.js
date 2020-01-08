import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Badge } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import moment from 'moment'
import 'moment/locale/ar'
import PackImage from './pack-image'
import labels from '../data/labels'
import { storeSummary } from '../data/config'

const StorePacks = props => {
  const { state } = useContext(StoreContext)
  const storePacks = useMemo(() => {
    const packs = state.storePacks.map(p => {
      const packInfo = state.packs.find(pa => pa.id === p.packId)
      const productInfo = state.products.find(p => p.id === packInfo.productId)
      return {
        ...p,
        packInfo,
        productInfo
      }
    })
    return packs.filter(p => (props.type === 'a')
                          || (props.type === 'o' && p.price > p.packInfo.price) 
                          || (props.type === 'n' && p.price === p.packInfo.price && p.storeId !== p.packInfo.minStoreId)
                          || (props.type === 'l' && p.price === p.packInfo.price && p.storeId === p.packInfo.minStoreId))
  }, [state.storePacks, state.packs, state.products, props.type])

  return(
    <Page>
      <Navbar title={storeSummary.find(s => s.id === props.type).name} backLink={labels.back} />
      <Block>
        <List mediaList>
          {storePacks.length === 0 ? 
            <ListItem title={labels.noData} /> 
          : storePacks.map(p => 
              <ListItem
                link={`/pack-details/${p.packId}/type/s`}
                title={p.productInfo.name}
                subtitle={p.packInfo.name}
                text={`${labels.productOf} ${p.productInfo.trademark ? labels.company + ' ' + p.productInfo.trademark + '-' : ''}${p.productInfo.country}`}
                footer={moment(p.time.toDate()).fromNow()}
                after={(p.packInfo.price / 1000).toFixed(3)}
                key={p.id}
              >
                <PackImage slot="media" pack={p.packInfo} type="list" />
                {p.price > p.packInfo.price ? <div className="list-subtext1">{`${labels.myPrice}: ${(p.price / 1000).toFixed(3)}`}</div> : ''}
                {p.packInfo.isOffer ? <Badge slot="title" color='green'>{labels.offer}</Badge> : ''}
              </ListItem>
            )
          }
        </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default StorePacks
