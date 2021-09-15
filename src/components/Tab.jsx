import React from "react";
import styled from "styled-components";

const TabListItem = styled.div`
  display: inline-block;
  list-style: none;
  margin-bottom: -1px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  color: dodgerblue;
`;

const DeleteTabButton = styled.button`
  margin-left: 10px;
  cursor: pointer;
  color: dodgerblue;
  :focus {
    outline: none;
  }
`;

const Input = styled.input`
  color: dodgerblue;
  border: none;
  max-width: 100px;
  :focus {
    outline: none;
    border: none;
  }
`;

class Tab extends React.Component {

  onClick = () => {
    const { tab, onClick } = this.props;
    onClick(tab.id);
  };

  onDelete = () => {
    const { onDelete } = this.props;
    onDelete();
  };

  onUpdate = event => {
    const { onUpdate } = this.props;
    onUpdate(event.target.value);
  };

  render() {
    const {
      onClick,
      onDelete,
      onUpdate,
      props: {
        activeTab,
        tab,
      },
    } = this;
    
    let className = '';

    if (activeTab.id === tab.id) {
      className = 'tab-list-active';
    }

    return (
      <TabListItem
        className={className}
        onClick={onClick}
      >
        {
          (activeTab?.id === tab?.id && tab?.name !== "All") ? (
            <>
              <Input
                value={tab.name}
                onChange={onUpdate}
                autoFocus={true}
              />
              <DeleteTabButton onClick={() => onDelete()}>x</DeleteTabButton>
            </>
          ) : (
            <span>{tab.name}</span>
          )
        }
      </TabListItem>
    );
  }
}

export default Tab;