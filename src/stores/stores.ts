import AsyncStorage from '@react-native-async-storage/async-storage'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist'
import rootReducer from '../reducers/index'
import { forwardToRenderer, triggerAlias, replayActionMain, replayActionRenderer } from 'electron-redux'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'dataReducer'
  ],
  blacklist: []
} // Middleware: Redux Persist Persisted Reducer

const persistedReducer = persistReducer(persistConfig, rootReducer) // Redux: Store
const store = createStore(persistedReducer, applyMiddleware(
  triggerAlias,
  createLogger(),
  forwardToRenderer
)) // Middleware: Redux Persist Persister

replayActionMain(store)

const persister = persistStore(store)
export { store, persister }
