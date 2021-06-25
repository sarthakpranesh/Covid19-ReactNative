import React from 'react'
import { View } from 'moti'

export type MotiViewParams = any;

const MotiView = (props: MotiViewParams) => {
  return (
    <View {...props}>
      {props.children}
    </View>
  )
}

export default MotiView
