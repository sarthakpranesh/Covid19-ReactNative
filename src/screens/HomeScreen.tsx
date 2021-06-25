import React, { useState, useCallback } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  StyleSheet,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native'
// import { View as MotiView } from 'moti'

// importing components
import MotiView from '../components/MotiView/MotiView'
import { Github, Vaccine } from '../components/Svgs/index'
import SafeAreaView from '../components/SafeAreaView'
import Country from '../components/Country'
import CandleCharts from '../components/CandleCharts'

// importing reducers
import { updateData } from '../reducers/DataReducer'

// importing API functions
import getCovidData from '../API/functions/getCovidData'

// importing raw vaccine site data
import vaccineData from '../rawVaccine'

// import common style
import Styles from '../Styles'

const HomeScreen = (props: any) => {
  const [refreshing, setRefresh] = useState<boolean>(false)

  const onRefresh = useCallback(async () => {
    setRefresh(true)
    const data = await getCovidData(props.country)
    props.updateData(data)
    setRefresh(false)
  }, [])

  const results = props.data
  const country = props.country

  return (
    <SafeAreaView>
      <MotiView
        style={styles.topIconsContainer}
        from={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          type: 'timing',
          duration: 200,
          delay: 400
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            elevation: 8,
            marginRight: 6
          }}
          onPress={() => Linking.openURL('https://github.com/sarthakpranesh/Covid19')}
        >
          <Github
            style={{
              margin: 8
            }}
            color="black"
          />
        </TouchableOpacity>
        {
          Object.keys(vaccineData).includes(country.toLowerCase()) ? (
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                elevation: 8,
                marginRight: 6
              }}
              onPress={() => Linking.openURL(vaccineData[country.toLowerCase()])}
            >
              <Vaccine
                style={{
                  margin: 8
                }}
                color="black"
              />
            </TouchableOpacity>
          ) : null
        }
      </MotiView>
      <ScrollView
        style={Styles.scrollView}
        contentContainerStyle={Styles.scrollViewContentContainer}
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={Styles.mainHeader}>
          <Image
            style={styles.mainHeaderImage}
            source={require('../../assets/img/ic1.png')}
          />
        </View>

        <MotiView
          from={{
            translateX: 50,
            opacity: 0
          }}
          animate={{
            translateX: 0,
            opacity: 1
          }}
          transition={{
            type: 'timing',
            duration: 200
          }}
        >
          <Country
            data={results?.global}
            countryName="World"
            containerStyle={'#B1ECFF'}
          />
        </MotiView>

        <MotiView
          from={{
            translateX: 50,
            opacity: 0
          }}
          animate={{
            translateX: 0,
            opacity: 1
          }}
          transition={{
            type: 'timing',
            duration: 200,
            delay: 200
          }}
        >
          <Country data={results?.country} countryName={country} />
        </MotiView>

        <MotiView
          from={{
            translateX: 50,
            opacity: 0
          }}
          animate={{
            translateX: 0,
            opacity: 1
          }}
          transition={{
            type: 'timing',
            duration: 200,
            delay: 400
          }}
        >
          <CandleCharts country={country} data={results?.timeline} />
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  topIconsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 999,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainHeaderImage: {
    width: 200,
    height: 40,
    alignSelf: 'center',
    marginBottom: 0
  },
  lineChartContainer: {
    marginVertical: -10,
    paddingVertical: 0,
    marginBottom: 0
  }
})

const mapStateToProps = (state: any) => {
  const data = state.dataReducer.data
  return data
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      updateData
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
