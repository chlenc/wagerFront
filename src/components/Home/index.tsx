/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/core";
import { Col, Icon, Layout, Menu, Radio, Row } from 'antd';
import { inject, observer } from "mobx-react";
import { HistoryStore } from "@stores/index";
import EventsStore from "@stores/EventsStore";
import { RouteChildrenProps } from "react-router";
import Scrollbar from 'react-perfect-scrollbar'
import { RadioChangeEvent } from "antd/lib/radio";
import EventInfo from "@components/Home/EventInfo";
import styled from "@emotion/styled";
import DappStore from "@stores/DappStore";

const {SubMenu} = Menu;
const {Content, Sider} = Layout;

const betThreshold = 10;
const betMax = 100;


interface IProps extends RouteChildrenProps {
    historyStore?: HistoryStore
    eventsStore?: EventsStore
    dappStore?: DappStore
}

interface IState {
    selectedValue: number
    selectedEvent?: 1 | 2
}

const Placeholder = styled.div`
width: 100%;
text-align: center;
`

@inject('historyStore', 'eventsStore', 'dappStore')
@observer
export default class Home extends React.Component<IProps, IState> {

    state: IState = {
        selectedValue: 10,
    };

    handleChangeSelectedValue = (selectedValue: number | number[]) => {
        if (typeof selectedValue === 'number') this.setState({selectedValue})
    };
    handleSelectEvent = (e: RadioChangeEvent) => this.setState({selectedEvent: e.target.value});

    get currentCoefficient() {
        const {selectedEvent, selectedValue} = this.state;
        const {currentEvent} = this.props.eventsStore!;
        if (!selectedEvent || !currentEvent || !currentEvent.state) return 0;
        let q = +(currentEvent.state as any)[`k${selectedEvent}`] / 100;

        if (selectedValue > betThreshold) {
            const k = (1 - q) / (betMax - betThreshold);
            const b = 1 - k * betMax;
            q = selectedValue * k + b;
        }

        return q
    }

    handleOpenEvent = (hash: string) => () => this.props.historyStore!.history.push(`/${hash}`);

    handleBet = async () => {
        const dappAddress = this.props.match ? (this.props.match!.params as any).string : undefined;
        const {selectedValue, selectedEvent} = this.state;
        if (!dappAddress || !selectedEvent) return;
        await this.props.dappStore!.bet(selectedValue, dappAddress, selectedEvent)
    }

    render() {
        const dappAddress = this.props.match ? (this.props.match!.params as any).string : undefined;
        const selectedDapp = dappAddress ? [dappAddress] : [];
        const {currentEvent} = this.props.eventsStore!;
        const {selectedValue, selectedEvent} = this.state;
        return <Layout style={{margin: '16px 0', padding: '24px 0', background: '#fff', height: '100%'}}>
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
            <Content style={{padding: '48px', minHeight: 280, display: 'flex', justifyContent: 'center'}}>

                {currentEvent && currentEvent.state ?
                    <div css={css`max-width: 500px`}>
                        <Row css={css`text-align: center; font-size: 24px`} gutter={16}>
                            <Col span={12}>Event 1 </Col>
                            <Col span={12}>Event 2 </Col>
                        </Row>
                        <br/>
                        <Row css={css`display: flex; justify-content: center`} gutter={16}>
                            <Radio.Group onChange={this.handleSelectEvent}>
                                <Radio.Button value={1} css={css`width: 200px;text-align: center`}>
                                    {currentEvent.state.k1 / 100}
                                </Radio.Button>
                                <Radio.Button value={2} css={css`width: 200px;text-align: center`}>
                                    {currentEvent.state.k2 / 100}
                                </Radio.Button>
                            </Radio.Group>
                        </Row>
                        <br/><br/>
                        {selectedEvent
                            ? <EventInfo
                                onBet={this.handleBet}
                                currentCoefficient={this.currentCoefficient}
                                selectedValue={selectedValue}
                                handleChangeSelectedValue={this.handleChangeSelectedValue}
                            />
                            : <Placeholder>Choose coefficient</Placeholder>
                        }
                    </div>
                    : <Placeholder>Choose event</Placeholder>
                }

            </Content>
        </Layout>

    }
}
