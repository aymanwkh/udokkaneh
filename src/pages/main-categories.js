import React, { useContext, useMemo } from 'react'
import { Button, Block } from 'framework7-react'
import { StoreContext } from '../data/store'
import { randomColors } from '../data/config'

const MainCategories = props => {
  const { state } = useContext(StoreContext)
  const categories = useMemo(() => {
    const categories = state.categories.filter(c => c.parentId === '0')
    return categories.sort((c1, c2) => c1.ordering - c2.ordering)
  }, [state.categories])
  let i = 0
  return (
    <Block>
      {categories.map(c => {
        return (
          <Button href={`/categories/${c.id}`} large fill className="sections" color={randomColors[i++ % 10].name} key={c.id}>
            {c.name}
          </Button>
        )
      })}
    </Block>
  )

}
export default MainCategories
