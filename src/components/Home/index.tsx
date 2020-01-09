/** @jsx jsx */
import React from "react";
import {css, jsx, keyframes} from "@emotion/core";
import styled from "@emotion/styled";
import {Button} from 'antd';
import {inject, observer} from "mobx-react";
import {HistoryStore} from "@stores/index";
import AccountStore from "@stores/AccountStore";

const Root = styled.div`
font-size: 72px;
font-weight: 700;
display: flex;
align-items: center;
justify-content: center;
height: 100%;
position: relative;
@media(max-width: 768px){
  font-size: 64px;
}
@media(max-width: 375px){
  font-size: 48px;
}
`;

const bounce = keyframes`
  0%{ transform: scale(1)}
  50%{transform: scale(1.2)}
  100%{transform: scale(1)}
`;

const buttonStyle = css`
position: absolute;
top: 5%;
right: 5%;
width: 170px;
animation: ${bounce} 5s ease infinite;
@media(max-width: 375px){
  right: unset;
  margin: auto;
}
`;

interface IProps {
    historyStore?: HistoryStore
    accountStore?: AccountStore
}

@inject('accountStore', 'historyStore')
@observer
export default class Home extends React.Component<IProps> {

    handleClick = () => {
        this.props.historyStore!.history.push(this.props.accountStore!.isLogin ? '/myself' : 'login')
    }

    render() {
        return <Root>
            <Button
                onClick={this.handleClick}
                css={buttonStyle}
                type="danger"
                icon="user"
                size="large"
            >{this.props.accountStore!.isLogin ? 'Look at myself' : 'Login or register'}</Button>
            HotWagger
        </Root>
    }
}
