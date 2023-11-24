import React from 'react'
import { render } from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { teal,cyan } from '@material-ui/core/colors'
import CssBaseline from "@material-ui/core/CssBaseline";
import App from './App'
import {BrowserRouter as Router,Route,Link,useParams,Redirect} from 'react-router-dom'
import {store,persistor} from './reducers';
import { PersistGate } from 'redux-persist/integration/react'

import {Provider} from 'react-redux'
const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[600],
      light: teal[50],
      dark:  teal[50],
      contrastText: '#fff'
    },
    secondary: {
      main: teal[600],
      light: teal[50],
      dark:  teal[50],
      contrastText: '#fff'
    },
    type: 'light',
  },
  sidebar:cyan[100],
  topNavApp:{
    bg:cyan[50],
    color:'#000000'
  },
  rootApp:{
    bg:'linear-gradient(to bottom, #33ccff 0%, #ff99cc 100%);'
  }
});

render(
  
  <MuiThemeProvider theme={theme}>
   
    <CssBaseline />
    <Provider store={store}> 
    <PersistGate loading={<h2>Loading....</h2>} persistor={persistor}>
   
    <App />
   
    </PersistGate>

    </Provider>
 
  </MuiThemeProvider>
  
,
  document.getElementById('root')
)