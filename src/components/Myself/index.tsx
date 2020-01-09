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
    accountStore?: AccountStore
}


@inject('accountStore', 'historyStore')
@observer
class Myself extends React.Component<IProps> {

    handleLogout = () => {
        this.props.accountStore!.logout();
        this.props.historyStore!.history.push('/')
    }

    render() {
        return (
            <Root>
                <Body>
                    {this.props.accountStore
                        ? <Root css={css`justify-content: space-around; height: 200px;width: 200px`}>
                            <div>Hello 🙋🏿</div>
                            <Button type="danger" onClick={this.handleLogout}>Logout</Button>
                        </Root>
                        : <Spin size="large"/>}
                </Body>
            </Root>
        );
    }
}

export default Myself
