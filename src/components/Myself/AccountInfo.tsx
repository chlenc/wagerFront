import React from 'react';
import copyToClipboard from 'copy-to-clipboard';
import styled from '@emotion/styled';
import { openNotification } from '@utils/notifiations';
import copyIcon from '@src/assets/icons/copy.svg';
import { Button } from 'antd';

interface IAccountInfoProps {
    onCopySeed: () => void
    handleLogout: () => void
    handleOlenHistory: () => void
    username: string
    address: string
}

const Root = styled.div`
  padding: 16px;
  width: 230px;
  line-height: 1;
`;

const InfoItem = styled.div`
    white-space: nowrap;
    overflow: hidden;
    padding: 16px 0;
    z-index: -1;
    display: flex;
  flex-direction: column;
`;

const InfoTitle = styled.div`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-weight: 500;
`;

const CopyBtn = styled.div`
cursor: pointer;
background: url("${copyIcon}") center no-repeat;
width: 14px;
height: 14px;
transition-duration: .5s;
:hover{
  transform: scale(1.2);
}
`;

const ButtonSet = styled.div`
display: flex;
justify-content: space-between;
`

export default class AccountInfo extends React.Component<IAccountInfoProps> {

    private handleCopy = (data: string) => {
        if (copyToClipboard(data)) {
            openNotification('Copied!', 'success');
        }
    };

    private getCopyButton = (data: string) => <CopyBtn onClick={() => this.handleCopy(data)}/>;

    render() {
        const {address, username, onCopySeed} = this.props;

        return <Root>
            <InfoItem>
                <InfoTitle>Address{this.getCopyButton(address)}</InfoTitle>
                {centerEllipsis(address)}
            </InfoItem>
            <InfoItem>
                <InfoTitle>Username{this.getCopyButton(username)}</InfoTitle>
                {centerEllipsis(username)}
            </InfoItem>
            <InfoItem>
                <InfoTitle>Seed <CopyBtn onClick={onCopySeed}/></InfoTitle>
                *********************
            </InfoItem>
            <ButtonSet>
            <Button size={'large'} type="primary" onClick={this.props.handleOlenHistory}>History</Button>
            <Button size={'large'} type="danger" onClick={this.props.handleLogout}>Logout</Button>
            </ButtonSet>
        </Root>;
    }
}



function centerEllipsis(str: string, symbols = 20) {
    if (str.length <= symbols) return str;
    return `${str.slice(0, symbols / 2)}...${str.slice(-symbols / 2)}`
}
