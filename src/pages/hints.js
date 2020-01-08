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
  const product = useMemo(() => state.products.find(p => p.id === pack.productId)
  , [state.products, pack])
  const packs = useMemo(() => {
    let packs = state.packs.filter(p => 
      (props.type === 'p' && state.products.find(pr => pr.id === p.productId && pr.tagId === product.tagId && (pr.sales > product.sales || pr.rating > product.rating))) ||
      (props.type === 'o' && p.productId === product.id && p.id !== pack.id && (p.isOffer || p.endOffer)) ||
      (props.type === 'w' && p.productId === product.id && p.weightedPrice < pack.weightedPrice)
    )
    packs = packs.map(p => {
      const productInfo = state.products.find(pr => pr.id === p.productId)
      return {
        ...p,
        productInfo,
      }
    })
    return packs.sort((p1, p2) => p1.weightedPrice - p2.weightedPrice)
  }, [pack, product, props.type, state.packs, state.products]) 
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
                  title={p.productInfo.name}
                  subtitle={p.name}
                  text={`${labels.productOf} ${p.productInfo.trademark ? labels.company + ' ' + p.productInfo.trademark + '-' : ''}${p.productInfo.country}`}
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