import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Badge } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import PackImage from './pack-image'
import moment from 'moment'
import labels from '../data/labels'

const Hints = props => {
  const { state } = useContext(StoreContext)
  const pack = useMemo(() => state.packs.find(p => p.id === props.id)
  , [state.packs, props.id])
  const packs = useMemo(() => {
    const packs = state.packs.filter(p => 
      (props.type === 'p' && p.tagId === pack.tagId && (p.sales > pack.sales || p.rating > pack.rating)) ||
      (props.type === 'o' && p.productId === pack.productId && p.id !== pack.id && (p.isOffer || p.endOffer)) ||
      (props.type === 'w' && p.productId === pack.productId && p.weightedPrice < pack.weightedPrice)
    )
    return packs.sort((p1, p2) => p1.weightedPrice - p2.weightedPrice)
  }, [pack, props.type, state.packs]) 
  return(
    <Page>
      <Navbar title={props.type === 'p' ? labels.otherProducts : (props.type === 'o' ? labels.otherOffers : labels.otherPacks)} backLink={labels.back} />
      <Block>
        <List mediaList>
          {packs.length === 0 ? 
            <ListItem title={labels.noData} />
          : packs.map(p => {
              return (
                <ListItem
                  link={`/pack-details/${p.id}`}
                  title={p.productName}
                  subtitle={p.name}
                  text={`${labels.productOf} ${p.trademark ? labels.company + ' ' + p.trademark + '-' : ''}${p.country}`}
                  footer={p.offerEnd ? `${labels.offerUpTo}: ${moment(p.offerEnd.toDate()).format('Y/M/D')}` : ''}
                  after={(p.price / 1000).toFixed(3)}
                  key={p.id}
                >
                  <PackImage slot="media" pack={p} type="list" />
                  {p.isOffer ? <Badge slot="title" color='green'>{labels.offer}</Badge> : ''}
                </ListItem>
              )
            })
          }
        </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Hints