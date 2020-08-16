/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationContainer} from '@react-navigation/native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Animated from 'react-native-reanimated';

import {DrawerContent, Screens} from './src/components/navigation/Drawer';

import getLocationHook from './src/hooks/getLocationHook';

const Drawer = createDrawerNavigator();

const MainApp = () => {
  const [getLocation, country] = getLocationHook();
  const [progress, setProgress] = useState<Animated.Node<number>>(
    new Animated.Value(0),
  );
  const scale = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });
  const borderRadius = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const animatedStyle = {borderRadius, transform: [{scale}]};

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Covid-19 App',
        message:
          "App needs to access your phone's location to work correctly. " +
          'You can cancel this step but then app will default to Indian Stats',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ).then(() => {
      Geolocation.getCurrentPosition(
        async (pos) => {
          await getLocation({
            long: pos.coords.longitude,
            lat: pos.coords.latitude,
          });
        },
        (err) => {
          console.log(err.message);
          getLocation({lat: '28.644800', long: '77.216721'});
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  }, []);

  return country !== '' ? (
    <NavigationContainer>
      <LinearGradient
        colors={['#DEF7FF', '#B1ECFF']}
        style={{flex: 1, backgroundColor: 'white'}}>
        <Drawer.Navigator
          edgeWidth={100}
          initialRouteName="Screens"
          drawerType="slide"
          overlayColor="transparent"
          drawerStyle={{flex: 1, width: '50%', backgroundColor: 'transparent'}}
          drawerContentOptions={{
            activeBackgroundColor: 'transparent',
            activeTintColor: 'black',
            inactiveTintColor: 'black',
          }}
          sceneContainerStyle={{backgroundColor: 'transparent'}}
          drawerContent={(p) => {
            setProgress(p.progress);
            return <DrawerContent {...p} />;
          }}>
          <Drawer.Screen name="Screens">
            {(p) => <Screens {...p} style={animatedStyle} country={country} />}
          </Drawer.Screen>
        </Drawer.Navigator>
      </LinearGradient>
    </NavigationContainer>
  ) : null;
};

const UserStartingSwitch = createSwitchNavigator(
  {
    MainApp,
  },
  {
    initialRouteName: 'MainApp',
  },
);

export default createAppContainer(UserStartingSwitch);