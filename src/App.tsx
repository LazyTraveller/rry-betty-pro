// eslint-disable-next-line no-use-before-define
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, toJS } from 'mobx';
import _ from 'lodash';
// import { DatePicker } from 'antd'
// import 'antd/dist/antd.css'
// import store from './store'


const store = observable({
    data: [
      {
        value: 1,
        text: '南山'
      },
      {
        value: 2,
        text: '福田'
      },
      {
        value: 3,
        text: '罗湖'
      },
      {
        value: 4,
        text: '宝安'
      },
      {
        value: 5,
        text: '福永'
      }
    ]
  });

class App extends Component {
    render() {
        // const { count, add, reduce } = store
        return (
            <>
                {/* <DatePicker /> */}
                {/* <div>{count}</div>
                <button onClick={add}>add</button>
                <button onClick={reduce}>reduce</button> */}
                Hello
                {_.map(store.data,(item, index) => {
                    return (
                        <div className="m-text-primary" key={index}>{item.text}</div>
                    );
                })}
            </>
        );
    }
}

export default App;