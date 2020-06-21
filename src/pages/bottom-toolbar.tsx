import React, { useContext } from 'react'
import { Icon, Link, Badge} from 'framework7-react'
import { StoreContext } from '../data/store'

interface iProps {
  isHome: string
}

const BottomToolbar = (props: iProps) => {
  const { state } = useContext(StoreContext)
  const searchHome = props.isHome === '1' ? 'search' : 'home'
  return (
    <React.Fragment>
      <Link href={`/${searchHome}/`} iconMaterial={searchHome} />
      <Link href={state.basket.length > 0 ? '/basket/' : ''}>
        <Icon material="shopping_cart" >
          {state.basket.length > 0 ? <Badge color="red">{state.basket.length}</Badge> : ''}
        </Icon>
      </Link>
    </React.Fragment>
  )
}

export default BottomToolbar
