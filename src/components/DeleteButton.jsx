import React from "react";
import styled from "styled-components";


// TODO: rename
const PaddedDiv = styled.h4`
  font-size: 0.7;
  position: "relative";
  margin-top: 0.1rem;
`;

// Takes a clickHandler function in props.
function DeleteButton(props) {
  return ( <PaddedDiv onClick={props.clickHandler}>x</PaddedDiv>);

}

export default DeleteButton;
