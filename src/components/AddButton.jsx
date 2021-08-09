import React from "react";
import styled from "styled-components";


// TODO: rename
const PaddedDiv = styled.h3`
padding: 2rem;
`;

// Takes a clickHandler function in props.
function AddButton(props) {
  return ( <PaddedDiv onClick={props.clickHandler}>+</PaddedDiv>);

}

export default AddButton;

