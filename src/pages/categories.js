import React, { useContext, useMemo } from 'react'
import { Button, Block, Page, Navbar, Toolbar } from 'framework7-react'
import { StoreContext } from '../data/store'
import BottomToolbar from './bottom-toolbar'
import labels from '../data/labels'
import { randomColors } from '../data/config'

const Categories = props => {
  const { state } = useContext(StoreContext)
  const categories = useMemo(() => {
    const categories = state.categories.filter(c => c.parentId === props.id)
    return categories.sort((c1, c2) => c1.ordering - c2.ordering)
  }, [state.categories, props.id])
  let i = 0
  return(
    <Page>
      <Navbar title={state.categories.find(c => c.id === props.id).name} backLink={labels.back} />
      <Block>
        {categories.map(c => {
          return (
            <Button 
              text={c.name}
              large 
              fill 
              className="sections" 
              color={randomColors[i++ % 10].name} 
              href={c.isLeaf ? `/packs/${c.id}` : `/categories/${c.id}`} 
              key={c.id}
            />
          )
        })}
      </Block>
      <Toolbar bottom>
        <BottomToolbar isHome="1"/>
      </Toolbar>
    </Page>
  )
}


export default Categories
