import * as React from 'react';
import {Alert, View} from 'react-native';
import {IconButton, Searchbar, Text} from 'react-native-paper';
import theme, {globalStyles} from '@ngevent/styles/theme';
import {Button} from '@ngevent/components/BaseComponent';
import {SearchList} from '@ngevent/components/Search';
import useDebounce from '@ngevent/hooks/useDebounce';

const Search: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const debounceSearch = useDebounce(query, 600);
  return (
    <View style={[globalStyles.screensWhite]}>
      <View
        style={{flexDirection: 'row', marginBottom: 4, paddingHorizontal: 16}}>
        <Searchbar
          icon="search"
          placeholder="Search"
          onChangeText={(search) => setQuery(search)}
          value={query}
          style={{flex: 1, borderRadius: 16}}
        />
        <IconButton
          icon="filter"
          onPress={() =>
            Alert.alert(
              'Coming Soon',
              'This feature is coming soon, please just wait',
            )
          }
          style={{marginLeft: 16}}
        />
      </View>
      <SearchList searchQuery={debounceSearch} />
    </View>
  );
};

export default Search;
