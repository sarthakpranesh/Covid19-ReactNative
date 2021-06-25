import React from 'react'
import { View } from 'react-native'

export type MotiViewParams = any;

const MotiView = (props: MotiViewParams) => {
  return (
    <View style={props.style}>
      {props.children}
    </View>
  )
}

export default MotiView
