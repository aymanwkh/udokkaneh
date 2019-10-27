import React, { useContext } from 'react'
import { Icon, Link, Badge} from 'framework7-react'
import { StoreContext } from '../data/Store';

const BottomToolbar = props => {
  const { state } = useContext(StoreContext)
  const searchHome = props.isHome === '1' ? 'search' : 'home'
  const searchHomeIcon = props.isHome === '1' ? 'search' : 'house_alt'
  return (
    <React.Fragment>
      <Link href={`/${searchHome}/`}>
        <Icon ios={`f7:${searchHomeIcon}`} aurora={`f7:${searchHomeIcon}`} md={`material:${searchHome}`} />
      </Link>
      <Link href={state.basket.length > 0 ? '/basket/' : ''}>
        <Icon ios="f7:cart" aurora="f7:cart" md="material:shopping_cart">
          {state.basket.length > 0 ? <Badge color="red">{state.basket.length}</Badge> : ''}
        </Icon>
      </Link>
    </React.Fragment>
  )
}

export default BottomToolbar
