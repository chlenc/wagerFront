import React from "react";
import { Button } from "antd";
import { css } from "@emotion/core";
import { AccountStore, HistoryStore } from "@stores/index";
import { inject, observer } from "mobx-react";
import Avatar from "@components/Avatar";
import styled from "@emotion/styled";

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
`
const UserInfo = styled.div`
display: flex;
flex-direction: column;
`
const Username = styled.div`
font-weight: 500;
`
const Balance = styled.div`
font-size: 12px;
`
@inject('accountStore', 'historyStore')
@observer
export default class LoginBtn extends React.Component<IProps> {

    handleClick = () => this.props.historyStore!.history.push(this.props.accountStore!.isLogin ? '/myself' : 'login');


    render() {
        const {address, username, isLogin, balance} = this.props.accountStore!;
        return address && username && isLogin
            ? <UserRoot onClick={this.handleClick}>
                <Avatar address={address}/>
                <UserInfo>
                    <Username>{username}</Username>
                    <Balance>{balance && balance} {<small><b>WAVELETS</b></small>}</Balance>
                </UserInfo>
            </UserRoot>
            : <Button onClick={this.handleClick} css={buttonStyle} type="danger" icon="user" size="large">
                Login or register
            </Button>;

    }
}
