import {UserData} from '@ngevent/api/auth';
import {Button, LoadingBlock} from '@ngevent/components/BaseComponent';
import {useUserContext} from '@ngevent/provider/UserProvider';
import theme from '@ngevent/styles/theme';
import {KEY_USER} from '@ngevent/utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

const Profile: React.FC = () => {
  const {user, setUser} = useUserContext();
  const navigation = useNavigation();

  const onSubmit = () => {
    Alert.alert('Confirmation', 'Are you sure to logout?', [
      {text: 'No', onPress: () => null},
      {text: 'Yes', onPress: () => logout()},
    ]);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(KEY_USER);
    setUser({} as UserData);
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Login'}],
      }),
    );
  };

  return (
    <View style={styles.screen}>
      <Text>
        Helo, <Text style={{fontWeight: 'bold'}}>{user.fullname}</Text>{' '}
      </Text>
      <Button mode="text" labelColor="danger" onPress={onSubmit}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default Profile;
