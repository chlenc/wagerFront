/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { inject, observer } from "mobx-react";
import AccountStore from "@stores/AccountStore";
import { HistoryStore } from "@stores/index";
import { Button } from 'antd';
import { Body } from '@components/Login'
import AccountInfo from "@components/Myself/AccountInfo";

const Root = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100%;

`;


interface IProps {
    historyStore?: HistoryStore
    accountStore?: AccountStore
}


@inject('accountStore', 'historyStore')
@observer
export default class Myself extends React.Component<IProps> {

    handleLogout = () => {
        this.props.accountStore!.logout();
        this.props.historyStore!.history.push('/')
    }

    handleCopySeed = () => {
    }

    render() {
        const {seed, username, address} = this.props.accountStore!;
        if (seed === null || username === null || address === null) return null;
        return (
            <Root>
                <Body>
                    <AccountInfo username={username} address={address} onCopySeed={this.handleCopySeed}/>
                    <Button size={"large"} type="danger" onClick={this.handleLogout}>Logout</Button>
                </Body>
            </Root>
        );
    }
}
