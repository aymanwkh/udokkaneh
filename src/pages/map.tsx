import { IonFab, IonFabButton, IonIcon, IonPage } from "@ionic/react"
import { checkmarkOutline } from "ionicons/icons"
import { useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvent } from 'react-leaflet'
import { useDispatch } from "react-redux"
import { useHistory, useParams } from "react-router"
import labels from "../data/labels"
import { Position } from "../data/types"
import Header from "./header"

type Props = {
  position: Position
  changePosition: ({lat, lng}: Position) => void
}
function MyMarker(props: Props) {
  const _map = useMapEvent('click', (e) => {
    props.changePosition({lat: e.latlng.lat, lng: e.latlng.lng})
  })
  return props.position ? <Marker position={props.position} /> : null
}

type Params = {
  lat: string,
  lng: string,
  updatable: string
}

const Map = () => {
  const dispatch = useDispatch()
  const params = useParams<Params>()
  const history = useHistory()
  const [position, setPosition] = useState({lat: +params.lat, lng: +params.lng})
  const handleOk = () => {
    dispatch({type: 'SET_MAP_POSITION', payload: position})
    history.goBack()
  }
  const changePosition = (position: Position) => {
    if (params.updatable === '1') setPosition(position)
  }
  return (
    <IonPage>
      <Header title={labels.map}/>
      <div className="ion-padding" style={{height: '100%'}}>
        <MapContainer 
          center={{lat: +params.lat, lng: +params.lng}} 
          zoom={17} 
          scrollWheelZoom
          style={{height: '100%'}}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MyMarker position={position} changePosition={changePosition} />
        </MapContainer>
        {position.lat !== +params.lat &&
          <IonFab vertical="top" horizontal="end" slot="fixed">
            <IonFabButton onClick={handleOk} color="success">
              <IonIcon ios={checkmarkOutline} />
            </IonFabButton>
          </IonFab>
        }
      </div>
    </IonPage>
  )
}

export default Map
