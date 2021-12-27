import { IonBackButton, IonButtons, IonHeader, IonIcon, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import labels from '../data/labels'
import { State } from '../data/types'

type Props = {
  title?: string,
  withSearch?: boolean
}
const Header = (props: Props) => {
  const searchText = useSelector<State, string>(state => state.searchText)
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const handleVisible = () => {
    dispatch({type: 'CLEAR_SEARCH'})
    setVisible(true)
  }
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton text={labels.back} defaultHref="/" />
        </IonButtons>
        {props.withSearch && 
          <IonButtons slot="end" onClick={handleVisible}>
            <IonIcon 
              name="search-outline" 
              color="primary" 
              size="small" 
              style={{fontSize: '20px', marginLeft: '10px'}}
            />
          </IonButtons>
        }
        <IonTitle>{props.title}</IonTitle>
      </IonToolbar>
      {visible && 
        <IonToolbar>
          <IonSearchbar
            placeholder={labels.search} 
            value={searchText} 
            onIonChange={e => dispatch({type: 'SET_SEARCH', payload: e.detail.value})}
          />
        </IonToolbar>
      }
    </IonHeader>
  )
}

export default Header