/** @jsx jsx */
import React from 'react';
import {jsx} from '@emotion/core';
import styled from '@emotion/styled';
import {inject, observer} from 'mobx-react';
import AccountStore from '@stores/AccountStore';
import {EventsStore, HistoryStore} from '@stores/index';
import {Button, Table, Tag} from 'antd';
import {Body} from '@components/Login';
import AccountInfo from '@components/Story/AccountInfo';

const Root = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100%;
background-color: #fff;
border-radius: 5px;
margin-top: 20px;
`;


interface IProps {
    eventsStore?: EventsStore
    accountStore?: AccountStore
}


@inject('accountStore', 'eventsStore')
@observer
export default class Story extends React.Component<IProps> {

    state = {
        story: []
    };

    constructor(props: IProps) {
        super(props);
        this.updateStory();
    }

    updateStory = async () => {
        const story = await this.props.eventsStore!.getHistory();
        this.setState({story})
    }

    render() {
        const {seed, username, address} = this.props.accountStore!;
        if (seed === null || username === null || address === null) return null;
        return (
            <Root>
                <Table columns={columns} dataSource={this.state.story}/>
            </Root>
        );
    }
}

const columns = [
    {
        title: 'Index',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: 'Selected',
        dataIndex: 'event',
        key: 'event',
    },
    {
        title: 'Coefficient',
        key: 'coefficient',
        dataIndex: 'coefficient',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text: any, record: any) => (<Button type="primary" disabled>Borrow</Button>),
    },
];


