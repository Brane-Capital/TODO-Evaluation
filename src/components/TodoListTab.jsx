import React from "react";
import { Row } from "./FlexboxGrid.jsx";
import { LocalStoragePaths } from "../utils/constants.js";

// The delete button is only shown if we are on a non-default list
// that is active.
function DeleteButton(props) {
  if (props.isSelected && props.id !== LocalStoragePaths.DefaultListId ) {
    return (<h4 className="delete-button"
                onClick={props.deleteHandler}>x</h4>)
  } else {
    return null;
  }
}

// Renders a todo list as a tab.
// Has logic for determining whether to show the delete button, and what
// styling to add. These changes are only applied on the currently selected
// tab.
function TodoListTab (props) {

  const { list, isSelected, deleteHandler, setName } = props;
  const className = isSelected ? "active" : ""

  // Ask for a new name and set it.
  const rename = React.useCallback(() => {
    // TODO: Change the interface to a text input UI. Using prompt to save time.
    const newName = prompt("Enter a name for the list", list.name);
    if (newName) {
      setName(newName);
    }
  }, [list, setName])

  return (<Row className={className} onDoubleClick={rename}>
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