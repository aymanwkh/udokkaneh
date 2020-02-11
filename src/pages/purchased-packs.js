import React, { useContext, useEffect, useState } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import { quantityText, addQuantity } from '../data/actions'
import labels from '../data/labels'
import moment from 'moment'
import 'moment/locale/ar'
import PackImage from './pack-image'

const PurchasedPacks = props => {
  const { state } = useContext(StoreContext)
	const [purchasedPacks, setPurchasedPacks] = useState([])
  const [deliveredOrders, setDeliveredOrders] = useState([])
  useEffect(() => {
    setDeliveredOrders(() => {
      const deliveredOrders = state.orders.filter(o => o.status === 'd')
      return deliveredOrders.sort((o1, o2) => o1.time.seconds - o2.time.seconds)
    })
  }, [state.orders])
	useEffect(() => {
		let packsArray = []
		deliveredOrders.forEach(o => {
			o.basket.forEach(p => {
        const found = packsArray.findIndex(pa => pa.packId === p.packId)
				if (found > -1) {
          packsArray.splice(found, 1, {
            ...packsArray[found],
            bestPrice: packsArray[found].bestPrice <= p.actual ? packsArray[found].bestPrice : p.actual,
            lastPrice: p.actual,
            quantity: addQuantity(packsArray[found].quantity, p.purchased),
            lastQuantity: p.purchased,
            lastTime: o.time
          })
				} else {
          packsArray.push({
            packId: p.packId,
            productName: p.productName,
            productAlias: p.productAlias,
            packName: p.packName,
            imageUrl: p.imageUrl,
            subQuantity: p.subQuantity,
            bonusPackId: p.bonusPackId,
            bonusImageUrl: p.bonusImageUrl,
            bonusQuantity: p.bonusQuantity,
            bestPrice: p.actual,
            lastPrice: p.actual,
            quantity: p.purchased,
            lastQuantity: p.purchased,
            lastTime: o.time
          })
        }
			})
		})
		setPurchasedPacks(packsArray.sort((p1, p2) => p2.lastTime.seconds - p1.lastTime.sconds))
  }, [deliveredOrders])
  let i = 0
  return(
    <Page>
      <Navbar title={labels.purchasedPacks} backLink={labels.back} />
      <Block>
				<List mediaList>
					{purchasedPacks.length === 0 ? 
						<ListItem title={labels.noData} /> 
					: purchasedPacks.map(p => 
							<ListItem
								title={`${p.productName} ${p.packName}`}
								subtitle={`${labels.bestPrice}: ${(p.bestPrice / 1000).toFixed(3)}`}
                text={`${labels.lastPrice}: ${(p.lastPrice / 1000).toFixed(3)}`}
                footer={`${labels.lastTime}: ${moment(p.lastTime.toDate()).fromNow()}`}
								key={i++}
							>
                <PackImage slot="media" pack={p} type="list" />
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