import { useContext } from 'react'
import { Icon, Link, Badge} from 'framework7-react'
import { StoreContext } from '../data/store'

interface Props {
  isHome?: string
}

const BottomToolbar = (props: Props) => {
  const { state } = useContext(StoreContext)
  const searchHome = props.isHome === '1' ? 'search' : 'home'
  return (
    <>
      <Link href={`/${searchHome}/`} iconMaterial={searchHome} />
      <Link href={state.basket.length > 0 ? '/basket/' : ''}>
        <Icon material="shopping_cart" >
          {state.basket.length > 0 ? <Badge color="red">{state.basket.length}</Badge> : ''}
        </Icon>
      </Link>
    </>
  )
}

export default BottomToolbar
