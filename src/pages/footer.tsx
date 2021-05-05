import {useContext} from 'react'
import {Icon, Link, Badge} from 'framework7-react'
import {StateContext} from '../data/state-provider'

const Footer = () => {
  const {state} = useContext(StateContext)
  return (
    <>
      <Link href="/home/" iconMaterial="home" />
      <Link href={state.basket.length > 0 ? '/basket/' : ''}>
        <Icon material="shopping_cart" >
          {state.basket.length > 0 && <Badge color="red">{state.basket.length}</Badge>}
        </Icon>
      </Link>
    </>
  )
}

export default Footer