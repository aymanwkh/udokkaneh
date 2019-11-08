import React, { useContext, useMemo } from 'react'
import { Button, Block, Page, Navbar, Toolbar } from 'framework7-react'
import { StoreContext } from '../data/Store';
import BottomToolbar from './BottomToolbar';


const Categories = props => {
  const { state } = useContext(StoreContext)
  const section = useMemo(() => state.sections.find(rec => rec.id === props.id), [state.sections])
  const categories = useMemo(() => state.categories.filter(rec => rec.sectionId === props.id), [state.categories])
  let i = 0
  return(
    <Page>
      <Navbar title={section.name} backLink={state.labels.back} />
      <Block>
        {categories && categories.map(category => {
          return (
            <Button large fill className="sections" color={state.randomColors[i++ % 10].name} href={`/category/${category.id}`} key={category.id}>
              <span className="button-label">{category.name}</span>
            </Button>
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
