import React from "react";
import styled from "styled-components";
import { KeyCode } from "./utils/constants";
import { getHashPath } from "./utils/pageAddress";
import Todos from "./utils/TodoList";
import GlobalStyle from "./GlobalStyle";
import TodoItem from "./TodoItem";
import Footer from "./Footer";
import Tab from "./components/Tab";

const tabKey = "tabs::data";
const todoKey = "todos::data";

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
    top: 65px;
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
const TabContainer = styled.div`
  cursor: pointer;
  color: #5ea4f3;
  border-bottom: 1px solid #d6d6d6;
`;

class App extends React.Component {
  state = {
    newTodo: "",
    filter: getHashPath() || "active",
    tabId: 0,
    tabs: [],
    items: [],
  };

  todos = new Todos(todoKey);
  tabs = new Todos(tabKey);

  loadItems(filter, tabId) {
    this.setState({
      items: this.todos.filter(filter, tabId),
    });
  }

  inputText = (event) => {
    this.setState({ newTodo: event.target.value });
  };
  newTodoKeyDown = (event) => {
    if (event.keyCode == KeyCode.Enter) {
      event.preventDefault();
      var title = this.state.newTodo.trim();
      if (title) {
        this.todos.add(title, this.state.tabId);
        this.setState({ newTodo: "" });
        this.loadItems(this.state.filter, this.state.tabId);
      }
    }
  };
  loadTabsHandler = () => {
    this.setState({
      tabs: this.tabs.items,
    });
  };
  selectTab = (tabId) => {
    this.setState({ tabId: tabId }, () =>
      this.loadItems(this.state.filter, this.state.tabId)
    );
  };
  newTabHandler = () => {
    const name = "New List";
    this.tabs.add(name);
    this.loadTabsHandler();
  };
  deleteTab = (id) => {
    if (id === this.state.tabId) {
      const prevTab = this.tabs.items[id - 1];
      this.selectTab(prevTab === undefined ? 0 : prevTab);
    }
    this.tabs.deleteTabItems(id);
    this.todos.deleteTab(id);
    this.loadTabsHandler();
  };
  renameTabHandler = (tabId, newName) => {
    this.tabs.rename(tabId, newName);
    this.loadTabsHandler();
  };

  toggle = (todo) => {
    return () => {
      this.todos.toggle(todo);
      this.loadItems(this.state.filter, this.state.tabId);
    };
  };

  update = (todo) => {
    return (newName) => {
      this.todos.rename(todo.id, newName);
      this.loadItems(this.state.filter, this.state.tabId);
    };
  };

  destroy = (todo) => {
    return () => {
      this.todos.delete(todo);
      this.loadItems(this.state.filter, this.state.tabId);
    };
  };

  hashchange = () => {
    const filter = getHashPath();
    this.setState(
      {
        filter: filter,
      },
      () => this.loadItems(filter, this.state.tabId)
    );
  };

  componentDidMount() {
    this.loadItems(this.state.filter, this.state.tabId);
    this.loadTabsHandler();
    window.addEventListener("hashchange", this.hashchange);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.hashchange);
  }

  render() {
    const { newTodo, filter, items } = this.state;
    return (
      <Page>
        <GlobalStyle />
        <Title>todos</Title>
        <TodoApp>
          <label className="indicator">❯</label>
          <TabContainer>
            <Tab
              label={"All"}
              isSelected={this.state.tabId === 0}
              onClick={() => this.selectTab(0)}
              editable={false}
            />
            {this.state.tabs.map(({ name, id }) => {
              return (
                <Tab
                  key={id}
                  label={name}
                  isSelected={this.state.tabId === id}
                  onClick={() => this.selectTab(id)}
                  editable={true}
                  onDelete={(e) => {
                    e.stopPropagation();
                    this.deleteTab(id);
                  }}
                  onUpdate={(name) => this.renameTabHandler(id, name)}
                />
              );
            })}
            <Tab label="+" onClick={this.newTabHandler} editable={false} />
          </TabContainer>
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
