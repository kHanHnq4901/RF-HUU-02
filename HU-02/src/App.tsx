import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigation/RootNavigator';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { KeyboardAvoidingView, Platform, StatusBar, Text } from 'react-native';
import { LogBox } from 'react-native';
import Theme, { Colors } from './theme';
import { StoreProvider } from './store';
LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'ViewPropTypes will be removed',
  'new NativeEventEmitter()',
  'Failed prop type: Invalid prop',
  'Require cycle: node_modules',
  'Non-serializable values were found',
]);
//console.log('isDark:', DefaultTheme.colors);
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
          }}>
          <NavigationContainer>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar
                backgroundColor={Colors.primary}
                barStyle={
                  Platform.OS === 'android' ? 'light-content' : 'dark-content'
                }
              />
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 30}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <RootNavigator />
              </KeyboardAvoidingView>
            </SafeAreaView>
          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
