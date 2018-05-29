import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import { createStore } from 'redux'
import reducer from './reducers'


// a linha do redux devtools quer dizer que se ele viver no nosso objeto windows, ela pode ser invocada,
// isso permite que se use a devtools do redux
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()   
)


ReactDOM.render(<App store={store}/>, document.getElementById('root'))
registerServiceWorker()



//criar store e configurá-la para se igualar a invocação de chamar "createStore"
//que vem do Redux e vai passar "createStore" para o reduce que foi criado   