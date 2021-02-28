import {EventData, getAllEvents} from '@ngevent/api/event';
import {globalStyles} from '@ngevent/styles/theme';
import * as React from 'react';
import {FlatList, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useQuery} from 'react-query';
import moment from 'moment';
import {CardEvent, CardEventLoading} from '@ngevent/components/BaseComponent';
import {formatDate} from '@ngevent/utils/common';
import {useNavigation} from '@react-navigation/native';
export interface UpcomingProps {}
const Upcoming: React.FC<UpcomingProps> = ({}) => {
  const navigation = useNavigation();
  const startDate = React.useMemo(() => moment().toISOString(), []);
  const endDate = React.useMemo(
    () => moment(startDate).add(30, 'days').toISOString(),
    [startDate],
  );

  const {data, isLoading, refetch} = useQuery(
    [
      'events',
      {
        orderBy: 'asc',
        page: 1,
        sortBy: 'event_date',
        search: '',
        startDate,
        endDate,
      },
    ],
    ({queryKey}) => getAllEvents(queryKey[1]),
    {},
  );

  const renderItem = React.useCallback(
    ({item}: {item: EventData}) => {
      return (
        <CardEvent
          data={{
            title: item.event_name,
            image: item.poster,
            description: `${item.location}, ${formatDate(item.event_date)}`,
            subtitle: `$${item.ticket_price}`,
            badge: item.category.category_name,
          }}
          style={{marginBottom: 8}}
          onPress={() => navigation.navigate('Detail Event', {id: item.id})}
        />
      );
    },
    [navigation],
  );

  const renderFlatlist = React.useCallback(() => {
    if (isLoading) {
      return <CardEventLoading />;
    } else {
      return (
        <FlatList
          keyExtractor={(item) => `upcoming-event-${item.id}`}
          data={data?.data || ([] as EventData[])}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
        />
      );
    }
  }, [data, isLoading, renderItem]);

  return (
    <View style={{marginTop: 44}}>
      <Text style={globalStyles.titleSection}>Upcoming</Text>
      {renderFlatlist()}
    </View>
  );
};

export default Upcoming;
