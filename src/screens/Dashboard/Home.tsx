import {CarouselHome, Upcoming} from '@ngevent/components/Home';
import theme, {globalStyles} from '@ngevent/styles/theme';
import * as React from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {Text} from 'react-native-paper';

const Home: React.FC = () => {
  const [refresh, setRefresh] = React.useState(false);
  const refreshData = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  };
  return (
    <>
      <ScrollView
        contentContainerStyle={globalStyles.scrollWhite}
        refreshControl={
          <RefreshControl
            onRefresh={refreshData}
            refreshing={refresh}
            size={16}
            tintColor={theme.colors.primary}
          />
        }>
        <Text style={globalStyles.titlePageLarge}>Home</Text>
        <CarouselHome isRefresh={refresh} />
        <Upcoming isRefresh={refresh} />
      </ScrollView>
    </>
  );
};

export default Home;
