/** @jsx jsx */
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import Home from "@components/Home";
import Login from "@components/Login";
import styled from "@emotion/styled";
import bg from '@src/assets/icons/bg.jpeg'
import { HistoryStore } from "@stores/index";
import { inject, observer } from "mobx-react";
import Myself from "@components/Myself";
import Register from "@components/Register";
import { Layout } from "antd";
import { css, jsx } from "@emotion/core";
import Logo from './Logo'
import LoginBtn from "@components/App/LoginBtn";

const {Header, Content, Footer} = Layout;

interface IProps {
    historyStore?: HistoryStore,
}

const Root = styled.div`
background-image: url(${bg});
background-size: contain;
height: 100%;
`;


@inject('historyStore')
@observer
class App extends React.Component<IProps> {

    render() {
        return <Root>

            <Router history={this.props.historyStore!.history}>
                <Layout style={{height: '100%', background: '#f0f2f599'}}>
                    <Header css={css`display: flex; align-items: center; justify-content: space-between`}>
                        <Logo/>
                        <LoginBtn/>
                    </Header>
                    <Content style={{padding: '0 50px'}}>
                        <Switch>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/myself" component={Myself}/>
                            <Route exact path="/register/:string" component={Register}/>
                            <Route exact path={["/", "/:string"]} component={Home}/>
                        </Switch>
                        {/*<Route component={NoMatch}/>*/}
                    </Content>
                    <Footer style={{textAlign: 'center', background: 'transparent'}}>hotWager ©2020</Footer>
                </Layout>
            </Router>
        </Root>
    }
}


export default App;
