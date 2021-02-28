import {EventData, getAllEvents} from '@ngevent/api/event';
import theme from '@ngevent/styles/theme';
import {formatDate} from '@ngevent/utils/common';
import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useInfiniteQuery} from 'react-query';
import {CardEvent, CardEventLoading} from '../BaseComponent';
import ButtonLoadMore from '../BaseComponent/ButtonLoadMore';

export interface SearchListProps {
  searchQuery?: string;
}
const SearchList: React.FC<SearchListProps> = ({searchQuery = ''}) => {
  const navigation = useNavigation();
  const [refresh, setRefresh] = React.useState(false);
  const {
    data,
    isError,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery(
    [
      'events',
      {
        orderBy: 'asc',
        sortBy: 'event_date',
        search: searchQuery,
        startDate: '',
        endDate: '',
      },
    ],
    ({pageParam, queryKey}) => getAllEvents({page: pageParam, ...queryKey[1]}),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage) {
          return lastPage.allPage > lastPage.currentPage
            ? +lastPage.currentPage + 1
            : false;
        }
        return false;
      },
    },
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

  const refreshData = React.useCallback(async () => {
    setRefresh(true);
    await refetch();
    setRefresh(false);
  }, [refetch]);

  const renderButtonLoadMore = React.useCallback(() => {
    return (
      <ButtonLoadMore
        loading={isFetchingNextPage}
        hasMore={!!hasNextPage}
        renderLoading={<CardEventLoading />}
        onPress={() => fetchNextPage()}
      />
    );
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderEmptyComponent = React.useCallback(
    () => (
      <Text style={{textAlign: 'center'}}>
        {isError
          ? 'Something error occured, swipe to refresh'
          : 'There are no events to booked :('}
      </Text>
    ),
    [isError],
  );

  if (isLoading) {
    return <CardEventLoading />;
  }

  return (
    <View>
      <FlatList
        data={[
          ...([] as EventData[]).concat(
            ...(data?.pages || []).map((d) => d.data),
          ),
        ]}
        keyExtractor={(item) => `search-events-${item.id}`}
        style={
          data?.pages[0].data.length === 0 || isError ? {height: '100%'} : {}
        }
        contentContainerStyle={{paddingTop: 16, paddingBottom: 80}}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.01}
        refreshControl={
          <RefreshControl
            onRefresh={refreshData}
            refreshing={refresh}
            size={16}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderButtonLoadMore}
      />
    </View>
  );
};

export default SearchList;
