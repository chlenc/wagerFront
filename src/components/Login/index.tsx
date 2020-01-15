/** @jsx jsx */
import React from "react";
import { Button, Icon, Input } from 'antd';
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { inject, observer } from "mobx-react";
import AccountStore from "@stores/AccountStore";
import { HistoryStore } from "@stores/index";
import { checkUser, registerReq } from "@src/api";

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
        let isRegisteredUser = false;
        if (isValidEmail(email)) {
            try {
                const res = await checkUser(email);
                if (res.status === 200 && res.data === 'success') {
                    isRegisteredUser = true
                }
            } catch (e) {
            }
        }
        this.setState({isRegisteredUser})
    };

    handleChangeEmail = ({target: {value: email}}: React.ChangeEvent<HTMLInputElement>) => this.setState({email});
    handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({password: e.target.value});

    handleSubmit = async () => {
        const {email: username, password, isRegisteredUser} = this.state;
        if (isRegisteredUser && username && password) {
            await this.props.accountStore!.login(username, password)
        }
        if (!isRegisteredUser && username !== '') {
            const res = await registerReq(username);
            if (res.status === 200) {
                this.setState({isCheckEmail: true})
            } else {
                console.error(res)
            }
        }

    };

    handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        this.searchUser()
    }

    render() {
        const {email, isRegisteredUser, password, isCheckEmail} = this.state;
        const validEmail = isValidEmail(email);
        return (
            <Root>
                <Body>
                    <Title>{isCheckEmail ? 'Check your email' : 'Log in the hotWagger'}<br/><br/></Title>

                    {!isCheckEmail && <Input
                        onKeyUp={this.handleKeyPress}
                        onChange={this.handleChangeEmail}
                        value={email}
                        type="email"
                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        placeholder="Email"
                    />}
                    {isRegisteredUser && validEmail && !isCheckEmail && <Input
                        onChange={this.handleChangePassword}
                        value={password}
                        type="password"
                        prefix={<Icon type="password" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        placeholder="Password"
                    />}
                    {!isCheckEmail && validEmail &&
                    <Button onClick={this.handleSubmit} css={css`width: 100%`} type="primary">
                        Enjoy
                    </Button>}
                </Body>

            </Root>
        );
    }
}

function isValidEmail(email: string) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export default Login
