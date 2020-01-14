import React from 'react';
import { Route, Router } from 'react-router-dom';
import Home from "@components/Home";
import Login from "@components/Login";
import styled from "@emotion/styled";
import bg from '@src/assets/icons/bg.jpeg'
import { HistoryStore } from "@stores/index";
import { inject, observer } from "mobx-react";
import Myself from "@components/Myself";
import NoMatch from "@components/NoMatch";
import Register from "@components/Register";

interface IProps {
    historyStore?: HistoryStore
}

const Root = styled.div`
background-image: url(${bg});
background-size: contain;
height: 100%;
`

@inject('historyStore')
@observer
class App extends React.Component<IProps> {


    componentDidMount(): void {
    }

    render() {
        return <Root>

            <Router history={this.props.historyStore!.history}>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/myself" component={Myself}/>
                <Route exact path="/register/:string" component={Register}/>
                <Route exact path={["/", "/:string"]} component={Home}/>

                <Route component={NoMatch}/>
                {/*<Route path="/:string" component={Page}/>*/}
            </Router>
        </Root>
    }
}


export default App;
