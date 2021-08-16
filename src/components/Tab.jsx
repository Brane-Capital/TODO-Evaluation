import React, { useState } from "react";
import styled from "styled-components";
import { KeyCode } from "../utils/constants";

const TabContainer = styled.button`
  padding: 1rem;
  cursor: pointer;
  :focus {
    outline: 0;
    border: 1px solid #d6d6d6;
  }
  button.delete {
    margin-left: 0.5rem;
    :focus {
      outline: 0;
    }
  }
`;
const Tab = ({ label, editable, onUpdate, onDelete, ...rest }) => {
  const [name, setTabName] = useState("");
  const [editing, setEditing] = useState(false);

  const onKeyDown = (event) => {
    if (event.which === KeyCode.Escape) {
      setEditing(false);
    } else if (event.which === KeyCode.Enter) {
      onUpdate(name);
      setEditing(false);
    }
  };
  return (
    <TabContainer
      {...rest}
      onDoubleClick={() => {
        setEditing(true);
        setTabName(label);
      }}
    >
      {editable && editing ? (
        <input
          autoFocus
          value={name}
          onBlur={() => {
            onUpdate(name);
            setEditing(false);
          }}
          onChange={(event) => setTabName(event.target.value)}
          onKeyDown={onKeyDown}
        />
      ) : (
        <>
          {label}
          {editable ? (
            <button className="delete" onClick={onDelete}>
              ×
            </button>
          ) : null}
        </>
      )}
    </TabContainer>
  );
};

export default Tab;
