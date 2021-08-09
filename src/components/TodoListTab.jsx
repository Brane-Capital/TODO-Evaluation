import React from "react";
import { Row } from "./FlexboxGrid.jsx";
import { LocalStoragePaths } from "../utils/constants.js";

function DeleteButton(props) {
  if (props.isSelected && props.id !== LocalStoragePaths.DefaultListId ) {
    return (<h4 className="delete-button"
                onClick={props.deleteHandler}>x</h4>)
  } else {
    return null;
  }
}

function TodoListTab (props) {

  const { list, isSelected, deleteHandler } = props;
  const className = isSelected ? "active" : ""

  return (<Row className={className}>
            <h3 onClick={(e) => {
                  e.preventDefault();
                  props.switchToList();
                }}>{list.getName()}</h3>
            <DeleteButton isSelected={isSelected}
                          id={list.id}
                          deleteHandler={deleteHandler}/>
          </Row>)

}


export default TodoListTab;