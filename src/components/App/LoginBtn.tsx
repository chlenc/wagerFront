import React from 'react';
import { Button } from 'antd';
import { css } from '@emotion/core';
import { AccountStore, HistoryStore } from '@stores/index';
import { inject, observer } from 'mobx-react';
import User from '@components/App/User';

const buttonStyle = css`
@media(max-width: 375px){
  right: unset;
  margin: auto;
}
`;

interface IProps {
    historyStore?: HistoryStore,
    accountStore?: AccountStore
}

@inject('accountStore', 'historyStore')
@observer
export default class LoginBtn extends React.Component<IProps> {

    handleClick = () => this.props.historyStore!.history.push('login');

    render() {
        const {address, username, isLogin} = this.props.accountStore!;
        return address && username && isLogin
            ? <User/>
            : <Button onClick={this.handleClick} css={buttonStyle} type="danger" icon="user" size="large">
                Login or register
            </Button>;

    }
}
