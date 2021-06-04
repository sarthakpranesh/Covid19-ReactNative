import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { Provider as ReduxProvider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen'
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

// importing redux persist stores
import { store, persister } from './src/stores/stores'

// Importing reducer functions
import { setCountry, updateData } from './src/reducers/DataReducer'

// Importing API functions
import getCountry from './src/API/functions/getCountry'
import getCovidData from './src/API/functions/getCovidData'

// Importing splash screen
import WebSplashScreen from './src/screens/SplashScreen'
import HomeScreen from './src/screens/HomeScreen'

// default location, if permission for location not provided
const INDIA: Location.LocationObject = {
  "timestamp": 0,
  "coords": {
    latitude: 28.644800,
    longitude: 77.216721,
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    speed: 0
  }
}

const mapStateToProps = (state: any) => {
  const data = state.dataReducer.data
  return data
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setCountry,
      updateData
    },
    dispatch
  )

const MainApp = connect(mapStateToProps, mapDispatchToProps)((props: any) => {
  const [loaded] = useFonts({
    Roboto: require('./assets/fonts/Roboto.ttf'),
  });
  
  // small helper
  const fetchAndSetCountry = async (location: Location.LocationObject) => {
    const country: string = await getCountry({
      long: location.coords.longitude,
      lat: location.coords.latitude
    })
    props.setCountry(country)
  }

  // Get mobile location -> set country
  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({status}) => {
        console.log('Status:', status);
        if (status !== 'granted') {
          return;
        }
        return Location.getCurrentPositionAsync({})
      })
      .then((location) => {
        fetchAndSetCountry(location ? location : INDIA)
      })
      .catch((err) => {
        fetchAndSetCountry(INDIA)
        console.log('Location Permission Error:', err.message);
      });
  }, [])

  // if mobile location set -> get covid stats
  useEffect(() => {
    if (props.country !== null) {
      getCovidData(props.country)
        .then((data) => {
          props.updateData(data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [props.country])

  // hide all implementation of splash screen from native and web
  useEffect(() => {
    if (props.data?.global !== undefined && loaded === true) {
      hideAsync()
    }
  }, [props.data?.global, loaded])

  // expo-splash-screen not supported on web
  // therefore using a extra stack with react native component for splash on web
  if (Platform.OS === 'web') {
    if (props.data?.global === undefined) {
      return <WebSplashScreen />
    }
  }

  if (props.country === null || props.data?.global === undefined) {
    return null
  }

  return <HomeScreen />
})

const App = () => {
  useEffect(() => {
    preventAutoHideAsync()
  }, [])
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={false} persistor={persister}>
        <SafeAreaProvider>
          <StatusBar hidden={true} />
          <MainApp />
        </SafeAreaProvider>
      </PersistGate>
    </ReduxProvider>
  )
}

export default App
