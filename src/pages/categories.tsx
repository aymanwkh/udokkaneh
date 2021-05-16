import {useContext, useState, useEffect} from 'react'
import {IonButton, IonContent, IonLoading, IonPage} from '@ionic/react'
import {StateContext} from '../data/state-provider'
import {randomColors} from '../data/config'
import labels from '../data/labels'
import {Category} from '../data/types'
import Header from './header'
import { useParams } from 'react-router'

type Params = {
  id: string
} 
const Categories = () => {
  const {state} = useContext(StateContext)
  const params = useParams<Params>()
  const [categories, setCategories] = useState<Category[]>([])
  const [inprocess, setInprocess] = useState(false)
  const [currentCategory] = useState<Category>(() => state.categories.find(c => c.id === params.id)!)
  useEffect(() => {
    setCategories(() => {
      const categories = state.categories.filter(c => c.parentId === params.id)
      return categories.sort((c1, c2) => c1.ordering - c2.ordering)
    })
  }, [state.categories, params.id])
  useEffect(() => {
    if (state.packs.length === 0) {
      setInprocess(true)
    } else {
      setInprocess(false)
    }
  }, [state.packs])
  let i = 0
  return (
    <IonPage>
      <Header title={currentCategory.name} />
      <IonContent fullscreen className="ion-padding">
        <IonButton 
          routerLink={`/packs/${params.id}/a`} 
          className="sections"
          expand="block"
          shape="round"
          color={randomColors[i++ % 5].name}
        >
          {labels.allProducts}
        </IonButton>
        {categories.map(c => 
          <IonButton
            routerLink={c.isLeaf ? `/packs/${c.id}/n` : `/categories/${c.id}`} 
            expand="block"
            shape="round"
            color={randomColors[i++ % 5].name}
            className="sections" 
            key={c.id}
          >
            {c.name}
          </IonButton>
        )}
      </IonContent>
      <IonLoading
        isOpen={inprocess}
        message={labels.inprocess}
      />
    </IonPage>
  )

}
export default Categories
