import React, { useContext, useMemo } from 'react'
import { Button, Block } from 'framework7-react'
import { StoreContext } from '../data/Store';

const Sections = props => {
  const { state } = useContext(StoreContext)
  const sections = useMemo(() => [...state.sections].sort((rec1, rec2) => rec1.name > rec2.name ? 1 : -1)
  , [state.sections])
  let i = 0
  return (
    <Block>
      {sections.map(section => {
        return (
          <Button large fill className="sections" color={state.randomColors[i++ % 10].name} href={`/section/${section.id}`} key={section.id}>
            <span className="button-label">{section.name}</span>
          </Button>
        )
      })}
    </Block>
  )

}
export default Sections
