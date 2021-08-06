import React from "react";
import styled from "styled-components";
import { KeyCode } from "./utils/constants";
import { getHashPath } from "./utils/pageAddress";
import Todos from "./utils/TodoList";
import Tabs from "./utils/Tabs";
import GlobalStyle from "./GlobalStyle";
import TodoItem from "./TodoItem";
import Footer from "./Footer";
import TabGroup from "./components/TabGroup";

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
    top: 58px;
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

class App extends React.Component {
  state = {
    newTodo: "",
    filter: getHashPath() || "active",
    items: [],
    selectedTabID: 0
  };

  todos = new Todos();
  tabs = new Tabs();

  loadItems(filter, id) {
    if (filter == null || filter == this.state.filter) {
      this.setState({ items: this.todos.filter(this.state.filter).filter((i) => (i.tabID === id || id === 0)), selectedTabID: id });
    } else {
      this.setState({ filter, items: this.todos.filter(filter).filter((i) => (i.tabID === id || id === 0)), selectedTabID: id });
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
        this.todos.add(title, this.state.selectedTabID);
        this.setState({ newTodo: "" });
        const filter = this.state.filter == "completed" ? "active" : this.state.filter;
        this.loadItems(filter, this.state.selectedTabID);
      }
    }
  };

  toggle = todo => {
    return () => {
      this.todos.toggle(todo);
      this.loadItems(null, this.state.selectedTabID);
    };
  };

  update = todo => {
    return newName => {
      this.todos.rename(todo.id, newName);
      this.loadItems(null, this.state.selectedTabID);
    };
  };

  destroy = todo => {
    return () => {
      this.todos.delete(todo);
      this.loadItems(null, this.state.selectedTabID);
    };
  };

  handleDestroyTab = (id) => {
    this.tabs.delete(id);

    this.state.items.forEach(i => {
      if (i.tabID === id) {
        this.todos.delete(i);
      }
    });
    
    this.loadItems(null, this.tabs.tabs[this.tabs.tabs.length - 1].id);
  }

  handleTabUpdate = (id) => {
    const filter = this.state.filter == "completed" ? "active" : this.state.filter;
    this.loadItems(filter, id);
  }

  handleTabAdd = () => {
    this.tabs.add();
    const filter = this.state.filter == "completed" ? "active" : this.state.filter;
    this.loadItems(filter, this.tabs.tabs[this.tabs.tabs.length - 1].id);
  }

  handleTabRename = (id, name) => {
    this.tabs.update(id, name.trim());
    this.setState({ tabs: this.tabs.tabs });
  }

  hashchange = () => {
    this.loadItems(getHashPath(), this.state.selectedTabID);
  };

  componentDidMount() {
    this.loadItems(null, 0);
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
          <TabGroup
            tabs={this.tabs.tabs}
            onDestroy={this.handleDestroyTab}
            selectedTabID={this.state.selectedTabID}
            handleChange={this.handleTabUpdate}
            handleTabAdd={this.handleTabAdd}
            handleTabRename={this.handleTabRename}
          />
          <div style={{borderTop: '1px solid #e6e6e6' }}>
            <label className="indicator">❯</label>
            <Input
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={this.inputText}
              onKeyDown={this.newTodoKeyDown}
              autoFocus={true}
            />
          </div>
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
