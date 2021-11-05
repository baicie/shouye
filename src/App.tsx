import TeachHomePage from '@/pages/index';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React, { ReactElement } from 'react';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import store from './store';

function App(): ReactElement {
  return (
    <ConfigProvider locale={zhCN}>
      <ReduxStoreProvider store={store}>
        <HashRouter>
          <Switch>
            <Route path="/" component={TeachHomePage} />
          </Switch>
        </HashRouter>
      </ReduxStoreProvider>
    </ConfigProvider>
  );
}

export default App;
