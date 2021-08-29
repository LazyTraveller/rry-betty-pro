/* eslint-disable no-use-before-define */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Router, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { configure } from 'mobx';
import App from './App.tsx';
import locale from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
// import './App.less';

const About = () => {
  return <>About</>;
};

configure({ enforceActions: 'never' });

ReactDOM.render(
    // <ConfigProvider locale={locale}>
    <Provider>
        <Router history={createBrowserHistory()}>
            <Route path="/" component={App} />
            <Route path="/about" component={About} />
        </Router>
    </Provider>
    // </ConfigProvider>
  ,
  document.getElementById('root')
);