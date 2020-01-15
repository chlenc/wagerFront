import React from "react";
import styled from "@emotion/styled";
import logo from "@src/assets/icons/fav.png";
import { keyframes } from "@emotion/core";

const LogoIcon = styled.div`
background: url(${logo}) center no-repeat;
background-size: contain;
width: 40px;
height: 40px;

`;

export const bounce = keyframes`
  0%{ transform: scale(1)}
  75%{transform: scale(1.1)}
  100%{transform: scale(1)}
`;

const LogoRoot = styled.a`
animation: ${bounce} 5s ease infinite;
font-size: 32px;
color: white;
display: flex; 
align-items: center;
margin: -8px;
font-weight: 800;
outline: none;
:hover {
    color: white;
}


& > * {
  margin: 8px;
}
`;

const Logo: React.FunctionComponent = () => <LogoRoot href="/">
    <LogoIcon/>HotWager
</LogoRoot>

export default Logo
