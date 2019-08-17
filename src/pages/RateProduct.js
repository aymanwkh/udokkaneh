import React, { useContext} from 'react'
import { Icon, Fab, FabButton, FabButtons } from 'framework7-react'
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
    <Fab position="left-top" slot="fixed" color="blue">
      <Icon ios="f7:heart" aurora="f7:heart" md="material:favorite_border"></Icon>
      <Icon ios="f7:close" aurora="f7:close" md="material:close"></Icon>
      <FabButtons position="bottom">
        <FabButton color="green" onClick={() => handleRate(1)}>
          <Icon ios="f7:thumbs_up" aurora="f7:thumbs_up" md="material:thumb_up"></Icon>
        </FabButton>
        <FabButton color="red" onClick={() => handleRate(-1)}>
        <Icon ios="f7:thumbs_down" aurora="f7:thumbs_down" md="material:thumb_down"></Icon>
        </FabButton>
      </FabButtons>
    </Fab>
  )
}


export default RateProduct

