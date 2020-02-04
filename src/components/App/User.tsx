/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { inject, observer } from 'mobx-react';
import AccountStore from '@stores/AccountStore';
import { HistoryStore } from '@stores/index';
import Avatar from '@components/Avatar';
import AccountInfo from '@components/Story/AccountInfo';

interface IProps {
    historyStore?: HistoryStore
    accountStore?: AccountStore
}

interface IState {
    open: boolean
}

const Root = styled.div`
position:relative;
color: white;
`;

const UserRoot = styled.div`
display: flex;
color: white;
line-height: 18px;
margin: 0 -5px;
transition-duration: 2s;
& > * {
  margin: 0 5px;
}
cursor: pointer;
:hover{
  transform: scale(1.1);
}
`;
const UserInfo = styled.div`
display: flex;
flex-direction: column;
`;
const Username = styled.div`
font-weight: 500;
`;
const Balance = styled.div`
font-size: 12px;
`;

const DropDown = styled.div`
display: flex;
position: absolute;
background-color: #001529;
z-index: 2;
border-radius: 4px;
`;

@inject('accountStore', 'historyStore')
@observer
export default class User extends React.Component<IProps, IState> {
    state = {
        open: false
    };

    handleLogout = () => {
        this.props.accountStore!.logout();
        this.props.historyStore!.history.push('/');
    };

    handleCopySeed = () => {
    };

    handleOpen = () => this.setState({open: true});

    handleClose = () => this.setState({open: false});

    onOlenHistory = () => this.props.historyStore!.history.push('/story');

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event: any) => {
        const path = event.path || event.composedPath();
        if (!(path.some((element: any) => element.dataset && element.dataset.owner === 'user'))) {
            this.handleClose();
        }
    };

    render() {
        const {seed, username, address, balance} = this.props.accountStore!;
        if (seed === null || username === null || address === null) return null;
        return <Root data-owner={'user'}>
            <UserRoot onClick={this.handleOpen}>
                <Avatar address={address}/>
                <UserInfo>
                    <Username>{username}</Username>
                    <Balance>{balance && balance} {<small><b>WAVELETS</b></small>}</Balance>
                </UserInfo>
            </UserRoot>
            {this.state.open && <DropDown onBlur={this.handleClose}>
                <AccountInfo
                    username={username}
                    address={address}
                    onCopySeed={this.handleCopySeed}
                    handleLogout={this.handleLogout}
                    handleOlenHistory={this.onOlenHistory}
                />
            </DropDown>}
        </Root>;
    }
}
