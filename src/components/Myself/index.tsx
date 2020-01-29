/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { inject, observer } from 'mobx-react';
import AccountStore from '@stores/AccountStore';
import { EventsStore, HistoryStore } from '@stores/index';
import { Button, Table, Tag } from 'antd';
import { Body } from '@components/Login';
import AccountInfo from '@components/Myself/AccountInfo';

const Root = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100%;

`;


interface IProps {
    eventsStore?: EventsStore
    accountStore?: AccountStore
}


@inject('accountStore', 'eventsStore')
@observer
export default class Myself extends React.Component<IProps> {


    componentDidMount(): void {
    this.props.eventsStore!.getHistory()
    }

    render() {
        const {seed, username, address} = this.props.accountStore!;
        if (seed === null || username === null || address === null) return null;
        return (
            <Root>
                <Body>
                    <Table columns={columns} dataSource={data}/>
                </Body>
            </Root>
        );
    }
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <a>{text}</a>,
    },
    {
        title: 'Selected',
        dataIndex: 'selected',
        key: 'selected',
    },
    {
        title: 'coefficient',
        key: 'coefficient',
        dataIndex: 'coefficient',
        render: (tags: any) => (
            <span>
        {tags.map((tag: any) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
                color = 'volcano';
            }
            return (
                <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                </Tag>
            );
        })}
      </span>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (text: any, record: any) => (<Button type="primary">Borrow</Button>),
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        selected: 42,
        coefficient: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'John Brown',
        selected: 42,
        coefficient: ['nice', 'developer'],
    },
    {
        key: '3',
        name: 'John Brown',
        selected: 42,
        coefficient: ['nice', 'developer'],
    },
];


