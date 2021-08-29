import React from "react";
import styled from "styled-components";
import { KeyCode } from "./utils/constants";
import { getHashPath } from "./utils/pageAddress";
import Todos from "./utils/TodoList";
import List from "./utils/Lists";
import GlobalStyle from "./GlobalStyle";
import TodoItem from "./TodoItem";
import Footer from "./Footer";

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
    top: 14px;
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

const Tabs = styled.div`
  display: flex;
  justify-content: start;
  background: #fff;
  position: relative;
  .selected {
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
    border-bottom: none;
    border-radius: 5px 5px 0px 0px;
  }
`
const Tab = styled.div`
  display: flex;
  justify-content: start;
  padding: 1rem;
  color: #0000EE;
  .delete {
    color: red;
    padding-left: 1rem;
  }
`
const TabEdit = styled.input`
  position: relative;
  margin: 0;
  width: 2rem;
  font-family: inherit;
  font-weight: inherit;
  color: black;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
`;

class App extends React.Component {
  lists = new List();
  state = {
    newTodo: "",
    filter: getHashPath() || "active",
    lists: this.lists,
  };

  loadItems(filter) {
    if (filter == null || filter == this.state.filter) {
      this.setState({ lists: this.lists });
    } else {
      this.setState({ filter, lists: this.lists });
    }
  }

  inputText = event => {
    this.setState({ newTodo: event.target.value });
  };

  removeList = id => {
    return () => {
      this.lists.remove(id);
      if (!this.lists.getSelected()) {
        this.lists.lists[0].selected = true;
      }
      this.setState({ lists: this.lists });
    };
  }

  newTodoKeyDown = event => {
    if (event.keyCode == KeyCode.Enter) {
      event.preventDefault();
      var title = this.state.newTodo.trim();
      if (title) {
        this.lists.addItem(title);
        this.setState({ newTodo: "" });
        const filter =
          this.state.filter == "completed" ? "active" : this.state.filter;
        this.loadItems(filter);
      }
    }
  };

  toggle = (todo) => {
    return () => {
      this.lists.toggle(todo);
      this.loadItems();
    };
  };

  update = todo => {
    return newName => {
      this.lists.renameItem(todo.id, newName);
      this.loadItems();
    };
  };

  enableEdit = id => {
    return () => {
      this.lists.get(id).editing = true;
      this.setState({ lists: this.lists });
    }
  }
  completeEdit = id => {
    return event => {
      if (event.keyCode == KeyCode.Enter) {
        event.preventDefault();
        this.lists.get(id).editing = false;
        this.setState({ lists: this.lists });
      }
    }
  }
  setListLabel = (id) => {
    return event => {
      this.lists.get(id).label = event.target.value;
      this.setState({ lists: this.lists });
    };
  };

  addEmptyList = () => {
    this.lists.getSelected().selected = false;
    this.lists.lists.forEach(list => {
      if (list.selected == true) {
        list.selected = false;
      }
    });
    const emptyList = new Todos(this.lists.newId());
    emptyList.selected = true;
    emptyList.editing = true;

    this.lists.add(emptyList);
    this.setState({ lists: this.lists });
  }

  destroy = todo => {
    return () => {
      this.lists.deleteToDo(todo);
      this.loadItems();
    };
  };

  select = listId => {
    return () => {
      this.lists.select(listId);
      this.setState({ lists: this.lists });
    }
  }
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
    const { newTodo, filter, lists } = this.state;
    return (
      <Page>
        <GlobalStyle />
        <Title>todos</Title>
        <Tabs>{
          lists.getAll().map(list => (
            <Tab key={list.id} className={list.selected ? 'selected' : ''}>
              <div hidden={list.editing} onClick={this.select(list.id)}>
                <span onDoubleClick={this.enableEdit(list.id, true)}>{list.label}</span>
              </div>
              <TabEdit hidden={!list.editing} placeholder={list.label} onChange={this.setListLabel(list.id)} onKeyDown={this.completeEdit(list.id)} />
              <span className="delete" hidden={!list.selected || list.id === 0 || list.editing} onClick={this.removeList(list.id)}>x</span>
            </Tab>
          ))}
          <Tab key="-1" onClick={this.addEmptyList}>+</Tab>
        </Tabs>
        <TodoApp>
          <label className="indicator">❯</label>
          <Input
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={this.inputText}
            onKeyDown={this.newTodoKeyDown}
            autoFocus={true}
          />
          <TodoList>
            {lists.getSelected().filter(filter).map((todo, index) => (
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
          <Footer filter={filter} itemCount={lists.getSelected().filter(filter).length} />
        </TodoApp>
        <footer className="info">
          <p>Double-click to edit a todo</p>
          <p>
            An adaptation of <a href="http://todomvc.com">TodoMVC</a>
          </p>
        </footer>
      </Page >
    );
  }
}

export default App;