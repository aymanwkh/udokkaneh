import React, { useContext} from 'react'
import { Icon, Link } from 'framework7-react'
import { rateProduct } from '../data/Actions'
import { StoreContext } from '../data/Store';

const RateProduct = props => {
  const { user, dispatch } = useContext(StoreContext)
  const handleRate = (rating) => {
    rateProduct(props.product, rating).then(id => {
      dispatch({type: 'RATE_PRODUCT', rating: {id, productId: props.product.id, user: user.uid, rating, time: new Date()}})
    })
  }
  return(
    <React.Fragment>
      <Link onClick={() => handleRate(1)}><Icon material="thumb_up" color="green"></Icon></Link>
      <Link onClick={() => handleRate(-1)}><Icon material="thumb_down" color="red"></Icon></Link>
    </React.Fragment>
  )
}


export default RateProduct

