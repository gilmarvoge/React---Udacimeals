import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import { createStore, applyMiddleware, compose } from 'redux'
import reducer from './reducers'
import { Provider } from 'react-redux'

const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// a linha do redux devtools quer dizer que se ele viver no nosso objeto windows, ela pode ser invocada,
// isso permite que se use a devtools do redux
const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(logger)
  )
)


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()


    //criar store e configurá-la para se igualar a invocação de chamar "createStore"
//que vem do Redux e vai passar "createStore" para o reduce que foi criado   