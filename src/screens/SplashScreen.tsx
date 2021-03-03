import Statusbar from '@ngevent/components/BaseComponent/Statusbar';
import {useUserContext} from '@ngevent/provider/UserProvider';
import theme from '@ngevent/styles/theme';
import {getUserData} from '@ngevent/utils/common';
import {KEY_USER, SCREEN_HEIGHT} from '@ngevent/utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';

const SplashScreen: React.FC = () => {
  const {setUser} = useUserContext();
  const navigation = useNavigation();

  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      const isLoged = await getUserData();

      await AsyncStorage.removeItem(KEY_USER);
      if (isLoged?.id) {
        setUser(isLoged);
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'Dashboard'}],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'Login'}],
          }),
        );
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Statusbar />
      <View style={styles.background}>
        <Text style={styles.title}>Ngevent</Text>
        <ActivityIndicator color="#fff" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.primary,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
});

export default SplashScreen;
