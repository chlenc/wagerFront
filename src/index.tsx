import * as React from 'react';
import { render } from 'react-dom';
import { Provider as MobxProvider } from 'mobx-react';
import { RootStore } from '@stores';
import App from '@components/App';
import './index.css'
import 'rc-notification/assets/index.css'
import 'antd/dist/antd.css';
import {autorun} from "mobx";
import {loadState, saveState} from "@utils/localstorage";

const initState = loadState();
const mobXStore = new RootStore(initState);

autorun(() => {
    const state = mobXStore.serialize();
    console.log('store', state);
    saveState(state);
}, {delay: 1000});


render(<MobxProvider {...mobXStore}><App/></MobxProvider>, document.getElementById('root'));
