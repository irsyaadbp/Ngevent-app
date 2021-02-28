import theme, {Colors} from '@ngevent/styles/theme';
import * as React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
export interface ButtonLoadMoreProps {
  loading: boolean;
  hasMore: boolean;
  renderLoading: React.ReactElement;
  onPress: () => void;
  colorIcon?: Colors;
  colorButton?: Colors;
  styleButton?: StyleProp<ViewStyle>;
}

const ButtonLoadMore: React.FC<ButtonLoadMoreProps> = ({
  loading = false,
  renderLoading,
  hasMore = false,
  onPress = () => {},
}) => {
  return loading ? (
    renderLoading
  ) : hasMore ? (
    <View style={styles.container}>
      <IconButton
        icon="plus-circle"
        size={36}
        onPress={onPress}
        style={{marginLeft: 16}}
      />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
});

export default ButtonLoadMore;
