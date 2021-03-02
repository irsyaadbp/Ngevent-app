import theme, {globalStyles} from '@ngevent/styles/theme';
import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ActivityIndicator, Badge, Text, useTheme} from 'react-native-paper';

export type CardEventData = {
  badge?: string;
  title: string;
  description: string;
  subtitle?: string;
  image: string;
};
interface CardEventProps {
  data: CardEventData;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

const CardEvent: React.FC<CardEventProps> = ({
  data,
  style,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[globalStyles.card, style]}
      onPress={onPress}
      disabled={disabled}>
      <FastImage
        source={{
          uri: data.image,
        }}
        style={styles.image}
      />
      <View style={styles.titleSection}>
        {!!data.badge && (
          <Badge visible style={globalStyles.badge} size={24}>
            {data.badge}
          </Badge>
        )}
        <Text style={[globalStyles.titleSmall]} numberOfLines={1}>
          {data.title}
        </Text>
        <Text style={{marginBottom: 8}} numberOfLines={1}>
          {data.description}
        </Text>
      </View>
      {!!data.subtitle && <Text style={styles.subtitle}>{data.subtitle}</Text>}
    </TouchableOpacity>
  );
};

export const CardEventLoading: React.FC = () => {
  const {colors} = useTheme();
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.background} size={32} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 120,
    width: 100,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  titleSection: {flex: 1, paddingHorizontal: 12},
  loading: {
    ...globalStyles.backgroundLoading,
    height: 144,
  },
  subtitle: {
    ...globalStyles.titleSmall,
    position: 'absolute',
    right: 12,
    top: 12,
  },
});

export default CardEvent;
