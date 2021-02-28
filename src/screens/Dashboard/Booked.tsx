import theme from '@ngevent/styles/theme';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

const Booked: React.FC = () => {
  return (
    <View style={styles.screen}>
      <Text>Booked List is coming soon, please wait :)</Text>
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

export default Booked;
