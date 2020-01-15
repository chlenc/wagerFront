/** @jsx jsx */

import React from "react";
import { Button, Row, Slider } from "antd";
import { css, jsx } from "@emotion/core";
import { inject, observer } from "mobx-react";
import AccountStore from "@stores/AccountStore";


interface IProps {
    handleChangeSelectedValue: (n: any) => void,
    onBet: () => void,
    selectedValue: number
    currentCoefficient: number
    accountStore?: AccountStore


}
@inject('accountStore')
@observer
export default class EventInfo extends React.Component<IProps>{



    render(){
        const {handleChangeSelectedValue, selectedValue, currentCoefficient, onBet} = this.props;
        return<div>
            <Row>
                <Slider onChange={handleChangeSelectedValue} defaultValue={10} min={1} max={99}/>
            </Row>
            <Row>
                You bet: <b>{selectedValue}</b><br/>
                with coefficient: <b>{currentCoefficient.toFixed(2)}</b><br/>
                Your winning: <b>{(+selectedValue * currentCoefficient).toFixed(2)}</b>
            </Row>
            <br/><br/>
            <Row css={css`text-align: center; font-size: 24px`} gutter={16}>
                <Button
                    disabled={!this.props.accountStore!.isLogin}
                    css={css`width: 200px`}
                    type="primary"
                    size={"large"}
                    onClick={onBet}
                >
                    Bet
                </Button>
            </Row>
        </div>

    }

}
