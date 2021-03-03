import {
  BadgePrice,
  Button,
  Header,
  LoadingBlock,
  Statusbar,
} from '@ngevent/components/BaseComponent';
import theme, {globalStyles} from '@ngevent/styles/theme';
import {HEADER_HEIGHT} from '@ngevent/utils/constants';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import * as React from 'react';
import {
  Alert,
  BackHandler,
  LayoutChangeEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ActivityIndicator, Badge, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {formatDate, formatWithoutNegative} from '@ngevent/utils/common';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {ParamRoute} from '@ngevent/types/propTypes';
import {getDetailEventById} from '@ngevent/api/event';
import moment from 'moment';
import {sendCreateOrder} from '@ngevent/api/order';

const DetailEvent: React.FC = ({}) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamRoute, 'DetailEvent'>>();
  const [refresh, setRefresh] = React.useState(false);
  const [marginTop, setMarginTop] = React.useState(0);
  const [book, setBook] = React.useState(0);
  const [dataBook, setDataBook] = React.useState({
    total_price: 0,
    total_qty: 0,
  });

  const {data, isLoading, refetch} = useQuery(
    ['detail-events', {id: route.params.id}],
    ({queryKey}) => getDetailEventById(queryKey[1].id),
    {
      onSuccess: (response) => {
        setDataBook({total_price: response.data.ticket_price, total_qty: 1});
      },
    },
  );

  const {mutate, isLoading: loadingCreate} = useMutation(sendCreateOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(['detail-events', {id: route.params.id}]);
      setBook(0);
      Alert.alert('Success', 'Successfully create order');
    },
    onError: (err) => {
      Alert.alert('Error', err?.message || 'Something error occured');
    },
  });

  const remainingTicket = React.useMemo(
    () => Number(data?.data.total_ticket) - Number(data?.data.sold_ticket),
    [data],
  );

  const isDateValid = React.useMemo(() => {
    const eventDate = moment(data?.data.event_date);
    const today = moment();

    return eventDate.isAfter(today);
  }, [data]);

  const refreshData = React.useCallback(async () => {
    setRefresh(true);
    await refetch();
    setRefresh(false);
  }, [refetch]);

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

  const onSubmit = () => {
    Alert.alert('Confirmation', 'Are you sure to order this ticket?', [
      {text: 'Tidak', onPress: () => null},
      {
        text: 'Yes',
        onPress: () =>
          mutate({
            event_id: route.params.id,
            qty: dataBook.total_qty,
            total_price: dataBook.total_price,
          }),
      },
    ]);
  };

  const getHeightLayoutTitle = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    setMarginTop(height - HEADER_HEIGHT + 24);
  };

  const renderLoading = () => (
    <View style={styles.loading}>
      <ActivityIndicator size={24} color={theme.colors.background} />
    </View>
  );

  const renderBookSection = React.useCallback(() => {
    if (!isLoading) {
      if (isDateValid) {
        if (book) {
          return (
            <View style={[StyleSheet.absoluteFillObject, {zIndex: 11}]}>
              <TouchableOpacity
                style={[
                  StyleSheet.absoluteFillObject,
                  {backgroundColor: 'rgba(0 ,0,0 ,0.6)'},
                ]}
                onPress={() => setBook(0)}
              />
              <View
                style={[
                  globalStyles.cardShadow,
                  styles.bookCard,
                  styles.marginBook,
                ]}>
                <View style={styles.ticketSection}>
                  <View>
                    <Text style={{color: theme.colors.placeholder}}>Total</Text>
                    <Text style={globalStyles.titleLarge}>
                      ${Number(dataBook.total_price)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.titleTicketLeft}>
                      {remainingTicket} left
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={styles.btnMinus}
                        onPress={() =>
                          setDataBook((old) => {
                            const newQty =
                              old.total_qty !== 1 ? old.total_qty - 1 : 1;
                            return {
                              total_price:
                                newQty * Number(data?.data.ticket_price),
                              total_qty: newQty,
                            };
                          })
                        }>
                        <Icon name="minus" size={16} />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.inputNumber}
                        textAlignVertical="center"
                        keyboardType="number-pad"
                        value={String(dataBook.total_qty)}
                        onChangeText={(value) =>
                          setDataBook((old) => {
                            const newValue = +formatWithoutNegative(value);

                            const newQty =
                              newValue > remainingTicket
                                ? remainingTicket
                                : newValue;
                            return {
                              ...old,
                              total_qty: newQty,
                            };
                          })
                        }
                      />
                      <TouchableOpacity
                        style={styles.btnPlus}
                        onPress={() => {
                          setDataBook((old) => {
                            const accumulateQty = old.total_qty + 1;
                            const newQty =
                              accumulateQty > remainingTicket
                                ? old.total_qty
                                : accumulateQty;
                            return {
                              total_price:
                                newQty * Number(data?.data.ticket_price),
                              total_qty: newQty,
                            };
                          });
                        }}>
                        <Icon
                          name="plus"
                          size={16}
                          color={theme.colors.background}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={styles.btnDanger}
                    onPress={() => setBook(0)}>
                    <Icon name="x" color={theme.colors.danger} size={16} />
                  </TouchableOpacity>
                  <View style={{flex: 1}}>
                    <Button onPress={onSubmit}>Confirm</Button>
                  </View>
                </View>
              </View>
            </View>
          );
        } else if (remainingTicket) {
          return (
            <Button style={styles.marginBook} onPress={() => setBook(1)}>
              Book Now
            </Button>
          );
        }
      }

      return (
        <TouchableOpacity
          disabled
          style={[styles.btnDisabled, styles.marginBook]}>
          <Text style={{color: theme.colors.gray}}>Sold Out</Text>
        </TouchableOpacity>
      );
    }
  }, [book, data, dataBook.total_qty, isDateValid, isLoading, remainingTicket]);

  return (
    <>
      <Statusbar type="secondary" />
      <View style={[globalStyles.screensWhite, styles.background]}>
        {loadingCreate && <LoadingBlock />}
        <Header
          background="transparent"
          iconLeft="back"
          style={styles.header}
          onPressIconLeft={() => navigation.goBack()}
        />
        <ScrollView
          contentContainerStyle={{paddingBottom: 100}}
          refreshControl={
            <RefreshControl
              onRefresh={refreshData}
              refreshing={refresh}
              size={16}
              tintColor={theme.colors.primary}
            />
          }>
          {isLoading ? (
            renderLoading()
          ) : (
            <>
              <View style={{position: 'relative'}}>
                <FastImage
                  source={{
                    uri: data?.data.poster,
                  }}
                  style={styles.image}
                />
                <View
                  onLayout={getHeightLayoutTitle}
                  style={[globalStyles.cardShadow, styles.titleSection]}>
                  <Badge visible style={globalStyles.badge} size={28}>
                    {data?.data.category.category_name}
                  </Badge>
                  <Text style={[globalStyles.titleLarge]}>
                    {data?.data.event_name}
                  </Text>
                  <Text style={styles.rowDetail}>
                    <Icon
                      name="map-pin"
                      size={16}
                      color={theme.colors.placeholder}
                    />
                    {'  '}
                    {data?.data.location}
                  </Text>
                  <Text style={{color: theme.colors.placeholder}}>
                    <Icon
                      name="calendar"
                      size={16}
                      color={theme.colors.placeholder}
                    />
                    {'  '}
                    {formatDate(
                      data?.data.event_date || '',
                      'dddd, DD MMMM YYYY',
                    )}
                  </Text>
                  <View style={styles.rowPrice}>
                    <BadgePrice price={Number(data?.data.ticket_price)} />
                    <Text style={{color: theme.colors.placeholder}}>
                      {data?.data.sold_ticket} participants
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.descSection, {marginTop}]}>
                <Text style={globalStyles.title}>Description</Text>
                <Text style={styles.description}>{data?.data.description}</Text>
              </View>
            </>
          )}
        </ScrollView>
        {renderBookSection()}
      </View>
    </>
  );
};

const IMAGE_HEIGHT = 350;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  image: {
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  header: {position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10},
  background: {paddingTop: 0, paddingBottom: 0},
  titleSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: IMAGE_HEIGHT - HEADER_HEIGHT,
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  rowDetail: {color: theme.colors.placeholder, marginTop: 8},
  rowPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    alignItems: 'flex-end',
  },
  descSection: {marginHorizontal: 16},
  description: {color: theme.colors.placeholder, marginTop: 8},
  marginBook: {
    bottom: 20,
    left: 16,
    right: 16,
    position: 'absolute',
  },
  bookCard: {
    height: 180,
    marginHorizontal: 0,
    marginVertical: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  btnDanger: {
    borderWidth: 1,
    borderColor: theme.colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  btnMinus: {
    borderWidth: 1,
    borderColor: theme.colors.gray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
  },
  btnPlus: {
    borderWidth: 1,
    borderColor: theme.colors.gray,
    backgroundColor: theme.colors.gray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
  },
  btnDisabled: {
    borderWidth: 1,
    borderColor: theme.colors.grayLight,
    backgroundColor: theme.colors.grayLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTicketLeft: {
    color: theme.colors.placeholder,
    textAlign: 'right',
    marginBottom: 4,
  },
  inputNumber: {
    width: 60,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 8,
    fontWeight: 'bold',
  },
  ticketSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loading: {
    ...globalStyles.backgroundLoading,
    borderRadius: 0,
    marginTop: 0,
    marginHorizontal: 0,
    backgroundColor: theme.colors.gray,
    height: IMAGE_HEIGHT,
  },
});

export default DetailEvent;
