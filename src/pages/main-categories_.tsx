import { useContext, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import { StoreContext } from '../data/store'
import { randomColors, setup } from '../data/config'
import labels from '../data/labels'
import { Category } from '../data/interfaces'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    margin: '20px auto',
    width: '100%',
    color: 'white'
  },
  list: {
    marginBottom: theme.spacing(2),
  },
}));

const MainCategories = () => {
  const { state } = useContext(StoreContext)
  const classes = useStyles();
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    setCategories(() => {
      const categories = state.categories.filter(c => c.parentId === '0')
      return categories.sort((c1, c2) => c1.ordering - c2.ordering)  
    })
  }, [state.categories])
  const history = useHistory()
  let i = 0
  return (
    <>
      <Button
        onClick={() => history.push(`/search`)} 
        size="large" 
        variant="contained" 
        className={classes.button}
        style={{backgroundColor: randomColors[i++ % 10].name}}
      >
        {labels.allProducts}
      </Button>
      {categories.map(c => 
        <Button
          onClick={() => history.push(`/categories/${c.id}`)} 
          size="large" 
          variant="contained" 
          className={classes.button}
          style={{backgroundColor: randomColors[i++ % 10].name}}
          key={c.id}
        >
          {setup.locale === 'en' ? c.ename : c.name}
        </Button>
      )}
    </>
  )

}
export default MainCategories
