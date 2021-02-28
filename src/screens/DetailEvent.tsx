import theme from '@ngevent/styles/theme';
import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

const DetailEvent: React.FC = ({}) => {
  const navigation = useNavigation();
  React.useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.screen}>
      <Text>Detail Event Coming Soon</Text>
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

export default DetailEvent;
