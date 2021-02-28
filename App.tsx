/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import theme from '@ngevent/styles/theme';
import Router from '@ngevent/router';
import UserProvider from '@ngevent/provider/UserProvider';
import {QueryClient, QueryClientProvider} from 'react-query';
import Icon from 'react-native-vector-icons/Feather';

const queryClient = new QueryClient();
const App = () => {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <PaperProvider
            theme={theme}
            settings={{
              icon: (props) => <Icon {...props} />,
            }}>
            <Router />
          </PaperProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </UserProvider>
  );
};

export default App;
