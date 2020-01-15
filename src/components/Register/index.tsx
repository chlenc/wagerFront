/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { inject, observer } from "mobx-react";
import { AccountStore, HistoryStore } from "@stores/index";
import { Button, Icon, Input } from 'antd';
import { Body } from '@components/Login'
import { RouteChildrenProps } from 'react-router'
import { checkHash } from "@src/api";

const Root = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100%;

`;


interface IProps extends RouteChildrenProps {
    historyStore?: HistoryStore
    accountStore?: AccountStore
}


interface IState {
    pass1: string
    pass2: string
    hash: string
}


@inject('historyStore', 'accountStore')
@observer
export default class Register extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        const hash = this.props.match && (this.props.match!.params as any).string;
        if (!hash) this.props.history.push('/404')
        checkHash(hash).catch(e => this.props.history.push('/login'))
    }

    state = {
        pass1: '',
        pass2: '',
    }

    handleClick = async () => {
        const {pass1, pass2} = this.state;
        if (pass1.length < 6 || pass1 !== pass2) return;
        await this.props.accountStore!.register((this.props.match!.params as any).string, pass1)
    };

    render() {
        const {pass1, pass2} = this.state;
        return (
            <Root>
                <Body>
                    <Root css={css`justify-content: space-around; height: 200px;width: 200px; font-size: 24px`}>
                        <div css={css`text-align: center; text-overflow: ellipsis`}>register</div>
                        <Input
                            onChange={(e) => this.setState({pass1: e.target.value})}
                            value={pass1}
                            type="password"
                            prefix={<Icon type="password" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="Password"
                        />
                        <Input
                            onChange={(e) => this.setState({pass2: e.target.value})}
                            value={pass2}
                            type="password"
                            prefix={<Icon type="password" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="Password"
                        />
                        <Button type="danger" disabled={pass1.length < 6 || pass1 !== pass2}
                                onClick={this.handleClick}>Register</Button>
                    </Root>
                </Body>
            </Root>
        );

    }
}

