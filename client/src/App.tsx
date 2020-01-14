import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import theme from '../src/styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import history from './history';
import { Router, Route, Switch } from 'react-router-dom';
import HomeMainContainer from './pages/Home/HomeMainContainer';

interface Props {}

const App: React.FC<Props> = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={HomeMainContainer} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
