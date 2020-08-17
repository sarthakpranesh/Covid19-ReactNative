import { StyleSheet, Dimensions } from 'react-native'

const { scale } = Dimensions.get('window')

const Styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#DEF7FF'
  },
  mainHeader: {
    flex: 1,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 60,
    paddingBottom: 40
  },
  mainHeaderText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#D41D3E',
    fontFamily: '',
    fontSize: 18 * scale
  }
})

export default Styles
