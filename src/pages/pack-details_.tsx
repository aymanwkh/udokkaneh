import { useContext, useEffect, useState, useRef } from 'react'
import RatingStars from './rating-stars'
import { StoreContext } from '../data/store'
import { addAlarm, showMessage, showError, getMessage, updateFavorites, productOfText, notifyFriends } from '../data/actions'
import labels from '../data/labels'
import { setup, alarmTypes } from '../data/config'
import { Pack } from '../data/interfaces'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useHistory, useLocation, useParams } from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles((theme) => ({
  media: {
    height: '60vh',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  spinner: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fab: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1
  }
}));

interface Props {
  id: string,
  type: string
}
const PackDetails = () => {
  const { state, dispatch } = useContext(StoreContext)
  const classes = useStyles();
  const history = useHistory()
  const location = useLocation()
  const props = useParams<Props>()
  const [error, setError] = useState('')
  const [pack, setPack] = useState<Pack>()
  const [isAvailable, setIsAvailable] = useState(-1)
  const [subPackInfo, setSubPackInfo] = useState('')
  const [bonusPackInfo, setBonusPackInfo] = useState('')
  const [otherProducts, setOtherProducts] = useState<Pack[]>([])
  const [otherOffers, setOtherOffers] = useState<Pack[]>([])
  const [otherPacks, setOtherPacks] = useState<Pack[]>([])
  const [openActions, setOpenActions] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [currentAlarmTypeId, setCurrentAlarmTypeId] = useState('')
  // const offerActions = useRef<Actions>(null)
  // const packActions = useRef<Actions>(null)
  useEffect(() => {
    setPack(() => {
      const pack = state.packs.find(p => p.id === props.id)!
      const trademarkInfo = state.trademarks.find(t => t.id === pack.trademarkId)
      const countryInfo = state.countries.find(c => c.id === pack.countryId)
      return {
        ...pack,
        productName: setup.locale === 'en' ? pack.productEname : pack.productName,
        productDescription: setup.locale === 'en' ? pack.productEdescription : pack.productDescription,
        name: setup.locale === 'en' ? pack.ename : pack.name,
        trademarkName: setup.locale === 'en' ? trademarkInfo?.ename : trademarkInfo?.name,
        countryName: setup.locale === 'en' ? countryInfo?.ename : countryInfo?.name
      }
    })
  }, [state.packs, state.trademarks, state.countries, props.id])
  useEffect(() => {
    pack && setIsAvailable(() => state.packPrices.find(p => p.storeId === state.customerInfo?.storeId && p.packId === pack.id) ? 1 : -1)
  }, [state.packPrices, state.customerInfo, pack])
  useEffect(() => {
    if (!pack) return
    setSubPackInfo(() => {
      if (pack.subPackId) {
        const price = Math.round(pack.price / (pack.subQuantity ?? 0) * (pack.subPercent ?? 0) * (1 + setup.profit))
        return `${pack.productName} ${pack.subPackName}(${(price / 100).toFixed(2)})`
      } else {
        return ''
      }  
    })
    setBonusPackInfo(() => {
      if (pack.bonusPackId) {
        const price = Math.round(pack.price / (pack.bonusQuantity ?? 0) * (pack.bonusPercent ?? 0) * (1 + setup.profit))
        return `${pack.bonusProductName} ${pack.bonusPackName}(${(price / 100).toFixed(2)})`
      } else {
        return ''
      }  
    })
    setOtherProducts(() => state.packs.filter(pa => pa.categoryId === pack.categoryId && (pa.sales > pack.sales || pa.rating > pack.rating)))
    setOtherOffers(() => state.packs.filter(pa => pa.productId === pack.productId && pa.id !== pack.id && (pa.isOffer || pa.offerEnd)))
    setOtherPacks(() => state.packs.filter(pa => pa.productId === pack.productId && pa.weightedPrice < pack.weightedPrice))
  }, [pack, state.packs])
  useEffect(() => {
    if (error) {
      dispatch({type: 'ERROR', payload: error})
      setError('')
    }
  }, [error])
  useEffect(() => {
    dispatch({type: 'SET_PAGE_TITLE', payload: pack?.productName})
  }, [dispatch, pack])
  const addToBasket = (packId?: string) => {
    if (!pack || !packId) return
    try{
      if (state.customerInfo?.isBlocked) {
        throw new Error('blockedUser')
      }
      if (state.basket.find(p => p.packId === packId)) {
        throw new Error('alreadyInBasket')
      }
      let foundPack = pack
      let price = pack.price ?? 0
      let maxQuantity
      if (packId !== pack.id) {
        foundPack = state.packs.find(p => p.id === packId)!
        if (packId === pack.subPackId) {
          price = Math.round((pack.price ?? 0) / (pack.subQuantity ?? 0) * (pack.subPercent ?? 0) * (1 + setup.profit))
          maxQuantity = (pack.subQuantity ?? 0) - 1
          if (pack.bonusPackId) maxQuantity++
        } else  {
          price = Math.round((pack.price ?? 0) / (pack.bonusQuantity ?? 0) * (pack.bonusPercent ?? 0) * (1 + setup.profit))
          maxQuantity = pack.bonusQuantity ?? 0
        }
      }
      const purchasedPack = {
        ...foundPack,
        price,
        maxQuantity
      }
      const orderLimit = state.customerInfo?.orderLimit ?? setup.orderLimit
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
      const activeOrdersTotal = activeOrders.reduce((sum, o) => sum + o.total, 0)
      if (activeOrdersTotal + purchasedPack.price > orderLimit) {
        throw new Error('limitOverFlow')
      }
      dispatch({type: 'ADD_TO_BASKET', payload: purchasedPack})
      showMessage(labels.addToBasketSuccess)
      history.goBack()  
		} catch (err){
      setError(getMessage(location.pathname, err))
    }
  }
  const handleAddAlarm = (alarmTypeId: string) => {
    try {
      if (alarmTypeId === 'ua') {
        setCurrentAlarmTypeId(alarmTypeId)
        setOpenDialog(true)
      } else {
        if (state.customerInfo?.isBlocked) {
          throw new Error('blockedUser')
        }
        if (state.userInfo?.alarms?.find(a => a.packId === props.id && a.status === 'n')){
          throw new Error('duplicateAlarms')
        }
        history.push(`/add-alarm/${props.id}/type/${alarmTypeId}`)
      }  
    } catch(err) {
      setError(getMessage(location.pathname, err))
    }
  }
  const handleConfirm = () => {
    try{
      if (state.customerInfo?.isBlocked) {
        throw new Error('blockedUser')
      }
      if (state.userInfo?.alarms?.find(a => a.packId === props.id && a.status === 'n')){
        throw new Error('duplicateAlarms')
      }
      const alarm = {
        packId: props.id,
        type: currentAlarmTypeId,
        status: 'n'
      }
      addAlarm(alarm)
      showMessage(labels.sendSuccess)
      history.goBack()
    } catch(err) {
      setError(getMessage(location.pathname, err))
    }
  }
  const handleFavorite = () => {
    try{
      if (state.userInfo && pack) {
        updateFavorites(state.userInfo, pack.productId)
        showMessage(state.userInfo?.favorites?.includes(pack.productId) ? labels.removeFavoriteSuccess : labels.addFavoriteSuccess)  
      }
		} catch (err){
      setError(getMessage(location.pathname, err))
    }
  }
  const handleNotifyFriends = () => {
    try{
      if (state.customerInfo?.isBlocked) {
        throw new Error('blockedUser')
      }
      if (pack) {
        notifyFriends(pack.id)
        showMessage(labels.sendSuccess)  
      }
    } catch(err) {
      setError(getMessage(location.pathname, err))
    }
  }
  if (!pack) return <div className={classes.spinner}><CircularProgress /></div>
  return (
    <>
      <Card>
        <CardHeader title={((pack.price ?? 0) / 100).toFixed(2)} style={{backgroundColor: '#f9f9f9'}}/>
        <CardMedia
          className={classes.media}
          image={pack.imageUrl}
        />
        <CardContent style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex'}}>
          <div style={{flexGrow: 1}}>
            {`${pack.name} ${pack.closeExpired ? '(' + labels.closeExpired + ')' : ''}`}
          </div>
          <div>
            {pack.productDescription}
          </div>
          </div>
          <Divider />
          <div style={{display: 'flex'}}>
            <div style={{flexGrow: 1}}>{productOfText(pack.trademarkName, pack.countryName)}</div>
            <div>{pack.ratingCount > 0 ? `(${pack.ratingCount})` : ''} <Rating name="half-rating-read" defaultValue={pack.rating ?? 0} precision={0.5} readOnly /></div>
          </div>
        </CardContent>
      </Card>
      {props.type === 'c' ? 
        <Fab color="secondary" aria-label="add" className={classes.fab}
          onClick={() => pack.isOffer ? setOpenActions(true) : addToBasket(pack.id)}
        >
          <AddIcon/>
        </Fab>
      : ''}
      {/* {state.user ?
        <Fab position="left-top" slot="fixed" color="red" className="top-fab" onClick={() => packActions.current?.open()}>
          <Icon material="menu"></Icon>
        </Fab>
      : ''}
      {props.type === 'c' && pack.isOffer ? <p className="note">{labels.offerHint}</p> : ''}
      <Actions ref={packActions}>
        {props.type === 'c' ? 
          <>
            <ActionsButton onClick={() => handleFavorite()}>{pack.productId && state.userInfo?.favorites?.includes(pack.productId) ? labels.removeFromFavorites : labels.addToFavorites}</ActionsButton>
            {pack.isOffer && state.userInfo?.friends?.find(f => f.status === 'r') ? 
              <ActionsButton onClick={() => handleNotifyFriends()}>{labels.notifyFriends}</ActionsButton>
            : ''}
            {otherProducts.length === 0 ? '' :
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/hints/${pack.id}/type/p`)}>{labels.otherProducts}</ActionsButton>
            }
            {otherOffers.length === 0 ? '' :
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/hints/${pack.id}/type/o`)}>{labels.otherOffers}</ActionsButton>
            }
            {otherPacks.length === 0 ? '' :
              <ActionsButton onClick={() => f7.views.current.router.navigate(`/hints/${pack.id}/type/w`)}>{labels.otherPacks}</ActionsButton>
            }
          </>
        : ''}
        {props.type === 'o' && alarmTypes.map(p =>
          p.isAvailable === 0 || p.isAvailable === isAvailable ?
            <ActionsButton key={p.id} onClick={() => handleAddAlarm(p.id)}>
              {p.name}
            </ActionsButton>
          : ''
        )}
      </Actions>
      
      <Actions ref={offerActions}>
        <ActionsButton onClick={() => addToBasket(pack.id)}>{labels.allOffer}</ActionsButton>
        <ActionsButton onClick={() => addToBasket(pack.subPackId)}>{subPackInfo}</ActionsButton>
        {pack.bonusPackId ? <ActionsButton onClick={() => addToBasket(pack.bonusPackId)}>{bonusPackInfo}</ActionsButton> : ''}
      </Actions> */}
      <Drawer anchor="bottom" open={openActions} onClose={() => setOpenActions(false)}>
        <div
          style={{width: 'auto'}}
          onClick={() => setOpenActions(false)}
          onKeyDown={() => setOpenActions(false)}
        >
          <List>
            <ListItem button onClick={() => addToBasket(pack.id)}>
              <ListItemText style={{textAlign: 'center', color: 'blue'}} primary={labels.allOffer} /> 
            </ListItem>
            <Divider />
            <ListItem button onClick={() => addToBasket(pack.subPackId)}>
              <ListItemText style={{textAlign: 'center', color: 'blue'}} primary={subPackInfo} /> 
            </ListItem>
            <Divider />
            <ListItem button onClick={() => addToBasket(pack.bonusPackId)}>
              <ListItemText style={{textAlign: 'center', color: 'blue'}} primary={bonusPackInfo} /> 
            </ListItem>
            <Divider />
          </List>
        </div>
      </Drawer>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{labels.confirmationTitle}</DialogTitle>
        <DialogContent> 
          <DialogContentText id="alert-dialog-description">
            {labels.confirmationText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PackDetails
