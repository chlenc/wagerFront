/** @jsx jsx */
import React from "react";
import {css, jsx} from "@emotion/core";
import styled from "@emotion/styled";
import {inject, observer} from "mobx-react";
import AccountStore from "@stores/AccountStore";
import {HistoryStore} from "@stores/index";
import {Spin, Button} from 'antd';
import {Body} from '@components/Login'

const Root = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100%;

`;


interface IProps {
    historyStore?: HistoryStore
}


@inject( 'historyStore')
@observer
export default class NoMatch extends React.Component<IProps> {

    handleClick = () => this.props.historyStore!.history.push('/');

    render() {
        return (
            <Root>
                <Body>
                        <Root css={css`justify-content: space-around; height: 200px;width: 200px; font-size: 72px`}>
                            <div css={css`text-align: center`}>🤖<br/>404</div>
                            <Button type="danger" onClick={this.handleClick}>Go home</Button>
                        </Root>
                </Body>
            </Root>
        );
    }
}

