import React from "react";
import styled from "styled-components";
import { KeyCode } from "./utils/constants";
import { getHashPath } from "./utils/pageAddress";
import Todos from "./utils/TodoList";
import GlobalStyle from "./GlobalStyle";
import TodoItem from "./TodoItem";
import Footer from "./Footer";
import { Row } from "./components/FlexboxGrid.jsx";
import TodoListTab from "./components/TodoListTab.jsx";
import UUID from "./utils/UUID.js"
import { LocalStoragePaths } from "./utils/constants.js";

const Page = styled.div`
  .info {
    margin: 65px auto 0;
    color: #bfbfbf;
    font-size: 10px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    text-align: center;
    p {
      line-height: 1;
    }
    a {
      color: inherit;
      text-decoration: none;
      font-weight: 400;
    }
    a:hover {
      text-decoration: underline;
    }
  }
`;

const Title = styled.h1`
  width: 100%;
  height: 130px;
  line-height: 130px;
  margin: 0;
  font-size: 100px;
  font-weight: 100;
  text-align: center;
  color: rgba(175, 47, 47, 0.15);
`;

const TodoApp = styled.section`
  background: #fff;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);

  label.indicator {
    position: absolute;
    top: 40px;
    left: -8px;
    font-size: 22px;
    color: #e6e6e6;
    padding: 10px 27px 10px 27px;
  }

  input::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
  input::-moz-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
  input::input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
`;

const Input = styled.input`
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  color: inherit;
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
`;

const TodoList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    border-bottom: 1px solid #ededed;
  }
  li:last-child {
    border-bottom: none;
  }
`;

const TodoListPanel = styled(Row)`

  div {
    height: 2rem;
  }

  h3 {
		margin: 0.3rem;
  }

  .active {
    border-style: outset
  }

  .add-button {
		position: relative;
  }

  .delete-button { 
    font-size: 1.2rem;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
  }
`;

class App extends React.Component {
  state = {
    newTodo: "",
    filter: getHashPath() || "active",
    items: [],
    // The default list will contain all todos that were added from the
    // "All" tab. All itself is a virtual list that is created by
    // merging the todo items of all localStorage backed lists.
    currentList: "default"
  };

  // Map todo categories to the todo list models.
  // FIXME: Rename to lists, would be a more appropriate name.
  todos = new Map();


  // Use a set to prevent duplicates.
  // TODO: Extract the todolists/categories logic into its own class/component.
  static storagekeys = new Set();

  constructor(props) {
    super(props);

    // Setup class data bindings.
    this.createTodoList = this.createTodoList.bind(this);
    this.deleteTodoList = this.deleteTodoList.bind(this);
    this.renameTodoList = this.renameTodoList.bind(this);

    // Load list keys from the localstorage.
    App.loadListKeys();
    const ids = App.storagekeys;

    // Load lists from localStorage
    for (let id of ids) {
      this.todos.set(id, new Todos(id));

      App.addNewListToLocalStorage(id);
    }

    // Create default list if it wasn't loaded in.
    // This occurs on the first initialization of the application because
    // the default list does not yet exist.
    const defaultListId = LocalStoragePaths.DefaultListId
    if (!ids.has(defaultListId)) {
      this.todos.set(defaultListId, new Todos(defaultListId, "All"));
      App.addNewListToLocalStorage(defaultListId);
    }


  }

  static addNewListToLocalStorage(newListId) {
    App.storagekeys.add(newListId);
    // convert to an array before saving
    const storagekeysArray = Array.from(App.storagekeys);
    window.localStorage.setItem(LocalStoragePaths.ListIds,
                                JSON.stringify(storagekeysArray));
  }

  static loadListKeys() {
    const loaded = JSON.parse(
      window.localStorage.getItem(LocalStoragePaths.ListIds));

    if (loaded) {
      // convert from array back to set.
      App.storagekeys = new Set(loaded);
      return loaded;
    } else {
      App.storagekeys = new Set();
    }
  }

  static deleteListFromLocalStorage(id) {
    // Delete list data.
    const key = LocalStoragePaths.ListDataPrefix + "::"+ id;
    window.localStorage.removeItem(key)

    // Delete list from ids.
    App.storagekeys.delete(id);

    const storagekeysArray = Array.from(App.storagekeys);
    window.localStorage.setItem(LocalStoragePaths.ListIds,
                                JSON.stringify(storagekeysArray));
  }

  getDefaultTodoList() {
    return this.todos.get(LocalStoragePaths.DefaultListId);
  }

  getCurrentTodoList() {
    return this.todos.get(this.state.currentList);
  }

  createTodoList() {
    const defaultName = "New List";
    const userDefinedName = prompt("Enter a name for the list", defaultName);
    const name = userDefinedName ? userDefinedName : defaultName;

    // Generate a unique identifier.
    const newId = UUID();
    const newList = new Todos(newId, name);

    this.todos.set(newId, newList);
    App.addNewListToLocalStorage(newId);

    // switch to new list
    this.loadItems(undefined, newId);
  }

  deleteTodoList(id) {
    // Remove the list.
    this.todos.delete(id);
    App.deleteListFromLocalStorage(id);

    // If we removed the list we were currently viewing,
    // switch to watching the "All" list.
    if (this.state.currentList === id) {
      this.loadItems(undefined, LocalStoragePaths.DefaultListId);
    } else {
      // Otherwise, just update the items.
      this.loadItems();
    }
  }

  switchToList(listId) {
    // filter does not need to changed.
    this.loadItems(undefined, listId);
  }

  getTodoList(id) {
    return this.todos.get(id);
  }

  renameTodoList(id, name) {
    this.todos.get(id).setName(name);
    this.loadItems();
  }

  loadItems(filter, newCurrentList) {
    // TODO: Remove code duplication.

    const todoListsArray = [...this.todos.values()];

    // If provided, get the new filter and current list. 
    const currentList = newCurrentList ? newCurrentList : this.state.currentList;

    // If there is no filter, or the filter has not changed.
    if (filter == null || filter == this.state.filter) {

      // Show the "All" virtual list, by:
      // iterating over all lists and applying the filter
      // and collecting the resulting todo items.
      const items = todoListsArray.flatMap((todoList) => {
        if (currentList !== "default" && currentList !== todoList.id) {
          return;
        }

        return todoList.filter(this.state.filter);
      }).filter(item => item); // remove undefined

      this.setState({ items, currentList});

    } else {
      // Store the new filter and apply it on the list.

      // Show the "All" virtual list, by:
      // iterating over all lists and applying the filter
      // and collecting the resulting todo items.
      const items = todoListsArray.flatMap((todoList) => {
        if (currentList !== "default" && currentList !== todoList.id) {
          return;
        }

        return todoList.filter(filter);
      }).filter (item => item); // remove undefined

      this.setState({ filter, items, currentList});
    }
  }

  inputText = event => {
    this.setState({ newTodo: event.target.value });
  };

  newTodoKeyDown = event => {
    if (event.keyCode == KeyCode.Enter) {
      event.preventDefault();
      var title = this.state.newTodo.trim();
      if (title) {
        this.getCurrentTodoList().add(title);
        this.setState({ newTodo: "" });
        const filter =
          this.state.filter == "completed" ? "active" : this.state.filter;
        this.loadItems(filter);
      }
    }
  };


  toggle = todo => {
    return () => {
      this.getTodoList(todo.listId).toggle(todo);
      this.loadItems();
    };
  };

  update = todo => {
    return newName => {
      this.getTodoList(todo.listId).rename(todo.id, newName);
      this.loadItems();
    };
  };

  destroy = todo => {
    return () => {
      this.getTodoList(todo.listId).delete(todo);
      this.loadItems();
    };
  };

  hashchange = () => {
    this.loadItems(getHashPath());
  };

  componentDidMount() {
    this.loadItems();
    window.addEventListener("hashchange", this.hashchange);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.hashchange);
  }

  render() {
    const { newTodo, filter, items, currentList } = this.state;

    return (
      <Page>
        <GlobalStyle />
        <Title>todos</Title>
        <TodoApp >
          <TodoListPanel >
            {[...this.todos.values()].map((list) => {
              const isCurrentList = currentList === list.id;

              return <TodoListTab
                       key={list.id}
                       list={list}
                       isSelected={isCurrentList}
                       switchToList={() => this.switchToList(list.id)}
                       deleteHandler={() => {this.deleteTodoList(list.id)}}
                       setName={(name) => this.renameTodoList(list.id, name)}
                     />
              
            })}
            <h3 className="add-button"
                onClick={this.createTodoList}>+</h3>
          </TodoListPanel>
          <label className="indicator">❯</label>
          <Input
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={this.inputText}
            onKeyDown={this.newTodoKeyDown}
            autoFocus={true}
          />
          <TodoList>
            {items.map((todo, index) => (
              <TodoItem
                key={index}
                todo={todo}
                filter={filter}
                onToggle={this.toggle(todo)}
                onUpdate={this.update(todo)}
                onDestroy={this.destroy(todo)}
              />
            ))}
          </TodoList>
          <Footer filter={filter} itemCount={items.length} />
        </TodoApp>
        <footer className="info">
          <p>Double-click to edit a todo</p>
          <p>
            An adaptation of <a href="http://todomvc.com">TodoMVC</a>
          </p>
        </footer>
      </Page>
    );
  }
}

export default App;
