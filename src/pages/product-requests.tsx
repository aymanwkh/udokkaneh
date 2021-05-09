import {useContext, useState, useEffect} from 'react'
import {f7, Page, Block, Navbar, List, ListItem, Searchbar, NavRight, Link, Fab, Icon} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {deleteProductRequest, getMessage, showError, showMessage} from '../data/actions'
import { ProductRequest } from '../data/types'

const ProductRequests = () => {
  const {state} = useContext(StateContext)
  const [error, setError] = useState('')
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([])
  useEffect(() => {
    setProductRequests(() => {
      const productRequests = state.productRequests.filter(r => r.storeId === state.userInfo?.storeId)
      return productRequests.sort((r1, r2) => r1.time! > r2.time! ? 1 : -1)
    })
  }, [state.productRequests, state.userInfo])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleDelete = (productRequest: ProductRequest) => {
    f7.dialog.confirm(labels.confirmationText, labels.confirmationTitle, async () => {
      try{
        await deleteProductRequest(productRequest, state.productRequests)
        showMessage(labels.deleteSuccess) 
      } catch(err) {
        setError(getMessage(f7.views.current.router.currentRoute.path, err))
      }
    })
  }

  return(
    <Page>
      <Navbar title={labels.productRequests} backLink={labels.back}>
        <NavRight>
          <Link searchbarEnable=".searchbar" iconMaterial="search"></Link>
        </NavRight>
        <Searchbar
          className="searchbar"
          searchContainer=".search-list"
          searchIn=".item-inner"
          clearButton
          expandable
          placeholder={labels.search}
        />
      </Navbar>
        <Block>
          <List className="searchbar-not-found">
            <ListItem title={labels.noData} />
          </List>
          <List mediaList className="search-list searchbar-found">
            {productRequests.length === 0 ? 
              <ListItem title={labels.noData} /> 
            : productRequests.map(p => 
                <ListItem
                  title={p.name}
                  subtitle={p.weight}
                  text={p.country}
                  footer={`${labels.price}: ${p.price.toFixed(2)}`}
                  key={p.id}
                >
                  <img slot="media" src={p.imageUrl} className="img-list" alt={labels.noImage} />
                  <Link slot="after" iconMaterial="delete" onClick={()=> handleDelete(p)}/>
                </ListItem>
              )
            }
          </List>
      </Block>
      <Fab position="left-top" slot="fixed" color="green" className="top-fab" href="/add-product-request/">
        <Icon material="add"></Icon>
      </Fab>
    </Page>
  )
}

export default ProductRequests