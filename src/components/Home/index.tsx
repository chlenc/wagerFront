/** @jsx jsx */
import React, { FunctionComponent } from "react";
import { css, jsx, keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import { Button, Icon, Layout, Menu } from 'antd';
import { inject, observer } from "mobx-react";
import { HistoryStore } from "@stores/index";
import AccountStore from "@stores/AccountStore";
import EventsStore from "@stores/EventsStore";
import { RouteChildrenProps } from "react-router";
import Scrollbar from 'react-perfect-scrollbar'

const {SubMenu} = Menu;
const {Header, Content, Footer, Sider} = Layout;
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
//position: absolute;
//top: 5%;
//right: 5%;
animation: ${bounce} 5s ease infinite;
@media(max-width: 375px){
  right: unset;
  margin: auto;
}
`;

const Body = styled.div`
display: flex;
padding-top: 120px;
height: 100%;
margin: -10px;
width: 90%;
& > * {
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
  margin: 10px;
}
`

interface IProps extends RouteChildrenProps {
    historyStore?: HistoryStore
    accountStore?: AccountStore
    eventsStore?: EventsStore
}

const Logo = styled.div`
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
`

const LoginBtn: FunctionComponent<{ handleClick: () => void, isLogin: boolean }> = ({handleClick, isLogin}) =>
    <Button onClick={handleClick} css={buttonStyle} type="danger" icon="user" size="large">
        {isLogin ? 'Look at myself' : 'Login or register'}
    </Button>


@inject('accountStore', 'historyStore', 'eventsStore')
@observer
export default class Home extends React.Component<IProps> {

    handleClick = () =>
        this.props.historyStore!.history.push(this.props.accountStore!.isLogin ? '/myself' : 'login');


    handleOpenEvent = (hash: string) => () => this.props.historyStore!.history.push(`/${hash}`);

    render() {
        const dappAddress = this.props.match ? (this.props.match!.params as any).string : undefined;
        const selectedDapp = dappAddress? [dappAddress]: [];
        return <Root>

            <Layout style={{height: '100%', background: '#f0f2f599'}}>
                <Header css={css`display: flex; align-items: center; justify-content: flex-end`}>
                    <LoginBtn isLogin={this.props.accountStore!.isLogin} handleClick={this.handleClick}/>
                </Header>
                <Content style={{padding: '0 50px'}}>
                    <Layout style={{margin: '16px 0', padding: '24px 0', background: '#fff', height: '100%'}}>
                        <Scrollbar css={css`overflow: hidden`}>
                            <Sider width={200} style={{background: '#fff'}}>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={selectedDapp}
                                    defaultOpenKeys={['sub1']}
                                    style={{height: '100%'}}
                                >
                                    <SubMenu key="sub1" title={<span><Icon type="user"/>Test events</span>}>
                                        {this.props.eventsStore!.events && this.props.eventsStore!.events
                                            .map(({title, dapp}) =>
                                                <Menu.Item key={dapp} onClick={this.handleOpenEvent(dapp)}>
                                                    {title}
                                                </Menu.Item>
                                            )}
                                    </SubMenu>

                                </Menu>
                            </Sider>
                        </Scrollbar>
                        <Content style={{padding: '0 24px', minHeight: 280}}>Content</Content>
                    </Layout>
                </Content>
                <Footer style={{textAlign: 'center', background: 'transparent'}}>hotWager ©2020</Footer>
            </Layout>


            {/*{this.props.eventsStore!.events != null ? <Body>*/}
            {/*        <Menu style={{flex: 1}}>*/}
            {/*            {this.props.eventsStore!.events.map(({title, dapp, id}) =>*/}
            {/*                <Menu.Item key={id} onClick={this.handleOpenEvent(dapp)}>*/}
            {/*                    {title}*/}
            {/*                </Menu.Item>*/}
            {/*            )}*/}
            {/*        </Menu>*/}
            {/*        <div style={{flex: 3}}>content</div>*/}
            {/*        <div style={{flex: 1}}>sidebar</div>*/}
            {/*    </Body>*/}
            {/*    : <Spin/>}*/}
        </Root>
    }
}
