import React, { useContext, useEffect, useState, useRef } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Actions, ActionsButton, Icon, Link } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import { quantityText, addQuantity } from '../data/actions'
import labels from '../data/labels'
import moment from 'moment'
import 'moment/locale/ar'
import { showMessage, showError, getMessage, rateProduct } from '../data/actions'

const PurchasedPacks = props => {
  const { state } = useContext(StoreContext)
  const [error, setError] = useState('')
	const [purchasedPacks, setPurchasedPacks] = useState([])
  const [deliveredOrders, setDeliveredOrders] = useState([])
  const [currentPack, setCurrentPack] = useState('')
  const actionsList = useRef('')
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
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
            productId: p.productId,
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
  const handleRate = value => {
    try{
      if (state.customerInfo.isBlocked) {
        throw new Error('blockedUser')
      }
      rateProduct(currentPack.productId, value)
      showMessage(labels.ratingSuccess)
    } catch(err) {
      setError(getMessage(props, err))
    }
  }
  const handleActions = pack => {
    setCurrentPack(pack)
    actionsList.current.open()
  }
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
                className={currentPack?.packId === p.packId ? 'selected' : ''}
              >
                <img src={p.imageUrl} slot="media" className="img-list" alt={labels.noImage} />
                <div className="list-subtext1">{`${labels.quantity}: ${quantityText(p.quantity)}`}</div>
                <div className="list-subtext2">{`${labels.lastQuantity}: ${quantityText(p.lastQuantity)}`}</div>
                {state.userInfo.ratings?.find(r => r.productId === currentPack.productId) ? '' : <Link slot="after" iconMaterial="favorite_border" onClick={()=> handleActions(p)}/> }
							</ListItem>
						)
					}
				</List>
      </Block>
      <Actions ref={actionsList}>
        <ActionsButton onClick={() => handleRate(5)}>
          {labels.rateGood}
          <Icon material="thumb_up" color="green"></Icon>
        </ActionsButton>
        <ActionsButton onClick={() => handleRate(3)}>
          {labels.rateMiddle}
          <Icon material="thumbs_up_down" color="blue"></Icon>
        </ActionsButton>
        <ActionsButton onClick={() => handleRate(1)}>
          {labels.rateBad}
          <Icon material="thumb_down" color="red"></Icon>
        </ActionsButton>
      </Actions>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default PurchasedPacks