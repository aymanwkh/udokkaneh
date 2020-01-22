import React, { useContext, useEffect, useState, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import { quantityText, addQuantity } from '../data/actions'
import PackImage from './pack-image'
import labels from '../data/labels'
import moment from 'moment'
import 'moment/locale/ar'

const PurchasedPacks = props => {
	const { state } = useContext(StoreContext)
	const [purchasedPacks, setPurchasedPacks] = useState([])
	const deliveredOrders = useMemo(() => {
    const deliveredOrders = state.orders.filter(o => o.status === 'd')
    return deliveredOrders.sort((o1, o2) => o1.activeTime.seconds - o2.activeTime.seconds)
  }, [state.orders])
	
	let i = 0
	useEffect(() => {
		let packsArray = []
		deliveredOrders.forEach(o => {
			o.basket.forEach(p => {
        const packInfo = state.packs.find(pa => pa.id === p.packId)
        const found = packsArray.find(pa => pa.packId === p.packId)
				if (found) {
          packsArray = packsArray.filter(pa => pa.packId !== found.packId)
          packsArray.push({
            ...found,
            bestPrice: found.bestPrice <= p.actual ? found.bestPrice : p.actual,
            lastPrice: p.actual,
            quantity: addQuantity(found.quantity, p.purchased),
            lastQuantity: p.purchased,
            lastTime: o.activeTime
          })
				} else {
          packsArray.push({
            packId: p.packId,
            packInfo,
            bestPrice: p.actual,
            lastPrice: p.actual,
            quantity: p.purchased,
            lastQuantity: p.purchased,
            lastTime: o.activeTime
          })
        }
			})
		})
		setPurchasedPacks(packsArray.sort((p1, p2) => p2.lastTime.seconds - p1.lastTime.sconds))
	}, [deliveredOrders, state.packs, state.products])
  return(
    <Page>
      <Navbar title={labels.purchasedPacks} backLink={labels.back} />
      <Block>
				<List mediaList>
					{purchasedPacks.length === 0 ? 
						<ListItem title={labels.noData} /> 
					: purchasedPacks.map(p => 
							<ListItem
								title={`${p.packInfo.productName} ${p.packInfo.name}`}
								subtitle={`${labels.bestPrice}: ${(p.bestPrice / 1000).toFixed(3)}`}
                text={`${labels.lastPrice}: ${(p.lastPrice / 1000).toFixed(3)}`}
                footer={`${labels.lastTime}: ${moment(p.lastTime.toDate()).fromNow()}`}
								key={i++}
							>
								<PackImage slot="media" pack={p.packInfo} type="list" />
                <div className="list-subtext1">{`${labels.quantity}: ${quantityText(p.quantity)}`}</div>
                <div className="list-subtext2">{`${labels.lastQuantity}: ${quantityText(p.lastQuantity)}`}</div>
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

export default PurchasedPacks