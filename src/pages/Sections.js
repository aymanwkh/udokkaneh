import React, { useContext, useMemo } from 'react'
import { Button, Block } from 'framework7-react'
import { StoreContext } from '../data/Store';

const Sections = props => {
  const { state } = useContext(StoreContext)
  const sections = useMemo(() => [...state.sections].sort((s1, s2) => s1.name > s2.name ? 1 : -1)
  , [state.sections])
  let i = 0
  return (
    <Block>
      {sections.map(s => {
        return (
          <Button 
            href={`/section/${s.id}`} key={s.id}
            large 
            fill 
            className="sections" 
            color={state.randomColors[i++ % 10].name} 
          >
            <span className="button-label">{s.name}</span>
          </Button>
        )
      })}
    </Block>
  )

}
export default Sections
