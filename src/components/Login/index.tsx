/** @jsx jsx */
import React, {FocusEventHandler} from "react";
import {Form, Icon, Input, Button, Checkbox} from 'antd';
import {css, jsx} from "@emotion/core";
import styled from "@emotion/styled";
import axios from 'axios';
import {inject, observer} from "mobx-react";
import {FormComponentProps} from 'antd/lib/form';
import AccountStore from "@stores/AccountStore";
import {HistoryStore} from "@stores/index";
import {openNotification} from "@utils/notifiations";
import {API_URL} from "@src/constants";
import {checkUser, login, registerReq} from "@src/api";

const Root = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100%;

`;

const Title = styled.div`
font-size: 24px;
font-weight: 500;
text-align: center;
`

export const Body = styled.div`
background-color: white;
box-shadow: 0 0 10px rgba(0,0,0,0.5); 
border-radius: 5px;
padding: 30px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
margin: -10px 0 ;
& > * {
  margin: 10px 0 ;
}

`;


interface IProps {
    historyStore?: HistoryStore
    accountStore?: AccountStore
}

interface IState {
    email: string
    password: string
    isRegisteredUser: boolean
    isCheckEmail: boolean
}

@inject('accountStore', 'historyStore')
@observer
class Login extends React.Component<IProps, IState> {

    state = {
        email: '',
        password: '',
        isRegisteredUser: false,
        isCheckEmail: false
    };

    componentDidMount(): void {
        this.props.accountStore!.isLogin && this.props.historyStore!.history.push('/')
    }

    searchUser = async () => {
        const {email} = this.state;
        if (email === '') return;
        const res = await checkUser(email);
        let isRegisteredUser = false;
        if (res.status === 200 && res.data === 'success') {
            isRegisteredUser = true
        }
        this.setState({isRegisteredUser})
    };

    handleChangeEmail = ({target: {value: email}}: React.ChangeEvent<HTMLInputElement>) => this.setState({email});
    handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({password: e.target.value});

    handleSubmit = async () => {
        const {email: username, password, isRegisteredUser} = this.state;
        if (isRegisteredUser && username && password) {
            try {
                const res = await login({username, password});
                if (res.status === 200) {
                    if (res.data && res.data.access_token) {
                        this.props.accountStore!.setAccessToken(res.data.access_token);
                        this.props.historyStore!.history.push('/myself')
                    } else throw 'Something wrong!'
                } else {
                    throw res.data || 'Something wrong!'
                }
            } catch (e) {
                openNotification(e, 'error')
            }
        }
        if (!isRegisteredUser && username !== '') {
            const res = await registerReq(username)
            if (res.status === 200) {
                this.setState({isCheckEmail: true})
            } else {
                console.log(res)
            }
        }

    };

    render() {
        const {email, isRegisteredUser, password, isCheckEmail} = this.state;
        return (
            <Root>
                <Body>
                    <Title>{isCheckEmail ? 'Check your email' : 'Log in the hotWagger'}<br/><br/></Title>

                    {!isCheckEmail && <Input
                        onBlur={this.searchUser}
                        onKeyPress={({key}) => key === 'Enter' && this.searchUser()}
                        onChange={this.handleChangeEmail}
                        value={email}
                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        placeholder="Email"
                    />}
                    {isRegisteredUser && !isCheckEmail && <Input
                        onChange={this.handleChangePassword}
                        value={password}
                        type="password"
                        prefix={<Icon type="password" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        placeholder="Password"
                    />}
                    {!isCheckEmail && email !== '' &&
                    <Button onClick={this.handleSubmit} css={css`width: 100%`} type="primary">
                        Enjoy
                    </Button>}
                </Body>

            </Root>
        );
    }
}


export default Login
