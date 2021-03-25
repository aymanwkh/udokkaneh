import { useContext, useState, useEffect, Fragment } from 'react'
import { StoreContext } from '../data/store'
import labels from '../data/labels'
import { sortByList, setup } from '../data/config'
import { getChildren, productOfText } from '../data/actions'
import { Pack } from '../data/interfaces'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    detail1: {
      display: 'block',
      color: 'red',
      fontSize: '0.9em'
    },
    detail2: {
      display: 'block',
      color: 'blue',
      fontSize: '0.9em'
    },
    detail3: {
      display: 'block',
      color: 'purple',
      fontSize: '0.9em'
    },
    detail4: {
      display: 'block',
      color: 'green',
      fontSize: '0.9em'
    },
    large: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  }),
);

interface Props {
  id: string,
  type: string
}

const Packs = (props: Props) => {
  const { state, dispatch } = useContext(StoreContext)
  const classes = useStyles();
  const history = useHistory()
  const [packs, setPacks] = useState<Pack[]>([])
  const [category] = useState(() => state.categories.find(c => c.id === props.id))
  const [sortBy, setSortBy] = useState(() => sortByList.find(s => s.id === 'v'))
  const [openActions, setOpenActions] = useState(false)
  useEffect(() => {
    setPacks(() => {
      const children = props.type === 'a' ? getChildren(props.id, state.categories) : [props.id]
      const packs = state.packs.filter(p => !props.id || (props.type === 'f' && state.userInfo?.favorites?.includes(p.productId)) || children.includes(p.categoryId))
      let extendedPacks = packs.map(p => {
        const categoryInfo = state.categories.find(c => c.id === p.categoryId)
        const trademarkInfo = state.trademarks.find(t => t.id === p.trademarkId)
        const countryInfo = state.countries.find(c => c.id === p.countryId)
        return {
          ...p,
          name: setup.locale === 'en' ? p.ename : p.name,
          productName: setup.locale === 'en' ? p.productEname : p.productName,
          productDescription: setup.locale === 'en' ? p.productEdescription : p.productDescription,
          categoryName: setup.locale === 'en' ? categoryInfo?.ename : categoryInfo?.name,
          trademarkName: setup.locale === 'en' ? trademarkInfo?.ename : trademarkInfo?.name,
          countryName: setup.locale === 'en' ? countryInfo?.ename : countryInfo?.name,
        }
      })
      return extendedPacks.sort((p1, p2) => p1.weightedPrice - p2.weightedPrice)
    })
  }, [state.packs, state.userInfo, props.id, props.type, state.categories, state.trademarks, state.countries])
  useEffect(() => {
    dispatch({type: 'SET_PAGE_TITLE', payload: (setup.locale === 'en' ? category?.ename : category?.name) || (props.type === 'f' ? labels.favorites : labels.allProducts)})
  }, [dispatch, category, props.type])
  const handleSorting = (sortByValue: string) => {
    setSortBy(() => sortByList.find(s => s.id === sortByValue))
    switch(sortByValue){
      case 'p':
        setPacks([...packs].sort((p1, p2) => p1.price - p2.price))
        break
      case 's':
        setPacks([...packs].sort((p1, p2) => p2.sales - p1.sales))
        break
      case 'r':
        setPacks([...packs].sort((p1, p2) => p2.rating - p1.rating))
        break
      case 'o':
        setPacks([...packs].sort((p1, p2) => (p2.isOffer || p2.offerEnd ? 1 : 0) - (p1.isOffer || p1.offerEnd ? 1 : 0)))
        break
      case 'v':
        setPacks([...packs].sort((p1, p2) => p1.weightedPrice - p2.weightedPrice))
        break
      default:
    }
  }
  return(
    <Container maxWidth="sm" style={{paddingBottom: 50, paddingTop: 50}}>
      {packs.length > 1 &&
        <>
          <List className={classes.root}>
            <ListItem alignItems="flex-start" button onClick={() => setOpenActions(true)}>
              <ListItemText primary={labels.sortBy} />
              <ListItemSecondaryAction>{setup.locale === 'en' ? sortBy?.ename : sortBy?.name}</ListItemSecondaryAction>
            </ListItem>
          </List>
          <Divider />
        </>
      }
      <List className={classes.root}>
        {packs.length === 0 ?
          <ListItem><ListItemText primary={labels.noData} /></ListItem>
        : packs.map(p => (
            <Fragment key={p.id}>
              <ListItem alignItems="flex-start" button onClick={() => history.push(`/pack-details/${p.id}/type/c`)}>
                <ListItemAvatar style={{marginRight: 10}}>
                  <Avatar alt="Remy Sharp" variant="rounded" src={p.imageUrl} className={classes.large}/>
                </ListItemAvatar>
                <ListItemText
                  primary={p.productName}
                  secondary={
                    <>
                      <span className={classes.detail1}>
                        {p.productDescription}
                      </span>
                      <span className={classes.detail2}>
                        {p.name}
                      </span>
                      <span className={classes.detail3}>
                        {productOfText(p.trademarkName, p.countryName)}
                      </span>
                      <span className={classes.detail4}>
                        {`${labels.category}: ${p.categoryName}`}
                      </span>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  {p.isOffer || p.offerEnd ? '' : (p.price / 100).toFixed(2)}
                  <IconButton edge="end">
                    <ArrowForwardIos />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
            </Fragment>
          ))
        }
      </List>
      <Drawer anchor="bottom" open={openActions} onClose={() => setOpenActions(false)}>
        <div
          style={{width: 'auto'}}
          onClick={() => setOpenActions(false)}
          onKeyDown={() => setOpenActions(false)}
        >
          <List>
            {sortByList.map(o => 
              o.id === sortBy?.id ? ''
              : <Fragment key={o.id}>
                  <ListItem button onClick={() => handleSorting(o.id)}><ListItemText style={{textAlign: 'center', color: 'blue'}} primary={setup.locale === 'en' ? o.ename : o.name} /> </ListItem>
                  <Divider />
                </Fragment>
            )}
          </List>
        </div>
      </Drawer>
    </Container>
    //   <Navbar title={(setup.locale === 'en' ? category?.ename : category?.name) || (props.type === 'f' ? labels.favorites : labels.allProducts)} backLink={labels.back}>
    //     <NavRight>
    //       <Link searchbarEnable=".searchbar" iconMaterial="search"></Link>
    //     </NavRight>
    //     <Searchbar
    //       className="searchbar"
    //       searchContainer=".search-list"
    //       searchIn=".item-inner"
    //       clearButton
    //       expandable
    //       placeholder={labels.search}
    //     />
    //   </Navbar>

    //   <Block>
    //     <List className="searchbar-not-found">
    //       <ListItem title={labels.noData} />
    //     </List>
    //     <List mediaList className="search-list searchbar-found">
    //       {packs.length > 1 &&
    //         <ListItem 
    //           title={labels.sortBy} 
    //           after={setup.locale === 'en' ? sortBy?.ename : sortBy?.name}
    //           onClick={() => sortList.current?.open()}
    //         />
    //       }
    //       {packs.length === 0 ?
    //         <ListItem title={labels.noData} />
    //       : packs.map(p => 
    //           <ListItem
    //             link={`/pack-details/${p.id}/type/c`}
    //             title={p.productName}
    //             subtitle={p.productDescription}
    //             text={p.name}
    //             footer={`${labels.category}: ${p.categoryName}`}
    //             after={p.isOffer || p.offerEnd ? '' : (p.price / 100).toFixed(2)}
    //             key={p.id}
    //           >
    //             <img src={p.imageUrl} slot="media" className="img-list" alt={labels.noImage} />
    //             <div className="list-subtext1">{productOfText(p.trademarkName, p.countryName)}</div>
    //             {(p.isOffer || p.offerEnd) && <Badge slot="after" color="green">{(p.price / 100).toFixed(2)}</Badge>}
    //             {p.closeExpired && <Badge slot="text" color="red">{labels.closeExpired}</Badge>}
    //           </ListItem>
              
    //         )
    //       }
    //     </List>
    //   </Block>
    //   <Actions ref={sortList}>
    //     <ActionsLabel>{labels.sortBy}</ActionsLabel>
    //     {sortByList.map(o => 
    //       o.id === sortBy?.id ? ''
    //       : <ActionsButton key={o.id} onClick={() => handleSorting(o.id)}>{setup.locale === 'en' ? o.ename : o.name}</ActionsButton>
    //     )}
    //   </Actions>
    //   <Toolbar bottom>
    //     <Footer/>
    //   </Toolbar>
    // </Page>
  )
}

export default Packs