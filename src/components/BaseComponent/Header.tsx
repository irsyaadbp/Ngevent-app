import theme, {ColorsType, globalStyles} from '@ngevent/styles/theme';
import {HEADER_HEIGHT} from '@ngevent/utils/constants';
import * as React from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StatusBar,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

interface HeaderProps {
  title?: string;
  background?: ColorsType | 'transparent';
  style?: StyleProp<ViewStyle>;
  iconLeft?:
    | ImageSourcePropType
    | 'back'
    | React.ReactElement<any, string>
    | undefined;
  iconLeftColor?: ColorsType;
  styleIconLeft?: StyleProp<ViewStyle>;
  onPressIconLeft?: (event: GestureResponderEvent) => void;
  iconRight?: ImageSourcePropType | React.ReactElement<any, string> | undefined;
  iconRightColor?: ColorsType;
  styleIconRight?: StyleProp<ViewStyle>;
  onPressIconRight?: (event: GestureResponderEvent) => void;
}

const Header: React.FC<HeaderProps> = ({
  style,
  background,
  iconLeft,
  iconLeftColor = 'gray',
  styleIconLeft,
  onPressIconLeft,
  iconRight,
  iconRightColor = 'gray',
  onPressIconRight,
  styleIconRight,
  title,
}) => {
  const {colors} = useTheme();

  const backgroundColor = React.useMemo(() => {
    if (background) {
      return colors[background];
    } else if (background === 'transparent') {
      return 'transparent';
    }

    return colors.primary;
  }, [background, colors]);

  const renderIconLeft = React.useCallback(() => {
    if (iconLeft) {
      if (iconLeft === 'back') {
        if (background === 'transparent') {
          return (
            <View style={styles.backBackground}>
              <Icon name="arrow-left" color={colors[iconLeftColor]} size={24} />
            </View>
          );
        } else {
          return (
            <Icon name="arrow-left" color={colors[iconLeftColor]} size={24} />
          );
        }
      } else if (!React.isValidElement(iconLeft)) {
        return <Image source={iconLeft} style={[globalStyles.icon]} />;
      } else if (React.isValidElement(iconLeft)) {
        return iconLeft;
      }
    }
    return null;
  }, [background, colors, iconLeft, iconLeftColor]);

  const renderIconRight = React.useCallback(() => {
    if (iconRight) {
      if (iconRight === 'back') {
        return (
          <Icon name="arrow-left" color={colors[iconRightColor]} size={24} />
        );
      } else if (!React.isValidElement(iconRight)) {
        return <Image source={iconRight} style={[globalStyles.icon]} />;
      } else if (React.isValidElement(iconRight)) {
        return iconRight;
      }
    }
    return null;
  }, [colors, iconRight, iconRightColor]);

  return (
    <>
      <View style={[styles.header, {backgroundColor}, style]}>
        {!!iconLeft && (
          <TouchableOpacity
            onPress={onPressIconLeft}
            style={[{paddingVertical: 8}, styleIconLeft]}>
            {renderIconLeft()}
          </TouchableOpacity>
        )}
        <Text style={{paddingHorizontal: 16, fontSize: 16, flex: 1}}>
          {title}
        </Text>
        {!!iconRight && (
          <TouchableOpacity onPress={onPressIconRight} style={styleIconRight}>
            {renderIconRight()}
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backBackground: {
    backgroundColor: theme.colors.background,
    height: '100%',
    borderRadius: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
