import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { KeyboardAvoidingView, LogBox, Platform } from 'react-native';
import 'react-native-gesture-handler';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CustomStatusBar } from './component/customStatusBar/index';
import { RootNavigator } from './navigation/RootNavigator';
import { navigationRef } from './navigation/StackRootNavigator';
import { StoreProvider } from './store';
import { Colors } from './theme';
LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'ViewPropTypes will be removed',
  'new NativeEventEmitter()',
  'Failed prop type: Invalid prop',
  'Require cycle: node_modules',
  'Non-serializable values were found',
]);

//console.log('isDark:', DefaultTheme.colors);

export const statusBarConst = {
  colorStatusBar: 'white',
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <PaperProvider
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              primary: '#f53765',
            },
            dark: false,
          }}>
          <NavigationContainer ref={navigationRef}>
            <SafeAreaProvider>
              <CustomStatusBar />
              <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: 'white' }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <RootNavigator />
              </KeyboardAvoidingView>
            </SafeAreaProvider>
          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
