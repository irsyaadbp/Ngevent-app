import {sendLogout, UserData} from '@ngevent/api/auth';
import {Button, LoadingBlock} from '@ngevent/components/BaseComponent';
import {useUserContext} from '@ngevent/provider/UserProvider';
import theme from '@ngevent/styles/theme';
import {CommonActions, useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useMutation} from 'react-query';

const Profile: React.FC = () => {
  const {user, setUser} = useUserContext();
  const navigation = useNavigation();
  const {mutate, isLoading} = useMutation(sendLogout, {
    onSuccess: () => {
      setUser({} as UserData);
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Login'}],
        }),
      );
    },
    onError: (err) => {
      Alert.alert('Error', err?.message || 'Something error occured');
    },
  });

  const onSubmit = () => {
    Alert.alert('Confirmation', 'Are you sure to logout?', [
      {text: 'No', onPress: () => null},
      {text: 'Yes', onPress: () => mutate()},
    ]);
  };
  return (
    <View style={styles.screen}>
      {isLoading && <LoadingBlock />}
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
