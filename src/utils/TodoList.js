import _ from "lodash";

const storagekey = "todos::data";

export default class TodoList {
  constructor() {
    this.load();
  }

  load() {
    const data = window.localStorage.getItem(storagekey);
    if (data != null) {
      this.items = JSON.parse(data);
    } else {
      this.items = [];
    }
    this.maxId = _.isEmpty(this.items) ? 0 : _.maxBy(this.items, "id").id;
  }

  save() {
    window.localStorage.setItem(storagekey, JSON.stringify(this.items));
  }

  newId() {
    this.maxId += 1;
    return this.maxId;
  }

  add(name, tab_id) {
    const item = {
      id: this.newId(),
      name,
      tab: tab_id,
      completed: false,
      createdAt: Date.now(),
    };
    this.items.unshift(item);
    this.save();
  }

  delete(todo) {
    this.items = this.items.filter(item => item.id != todo.id);
    this.save();
  }

  deleteByTab(tab_id) {
    this.items = this.items.filter(item => item.tab !== tab_id);
    this.save();
  }

  toggle(todo, tab_id) {
    let item = _.find(this.items, it => it.id === todo.id && it.tab === tab_id);
    if (item) {
      item.completed = !item.completed;
      if (item.completed) {
        item.completedAt = Date.now();
      }
      this.save();
    }
  }

  rename(id, newName, tab_id) {
    let item = _.find(this.items, it => it.id === id && it.tab === tab_id);
    if (item) {
      item.name = newName;
      this.save();
    }
  }

  filter(status, tab_id) {
    switch (status) {
      case "active":
        return (tab_id !== 0) ? this.items.filter(item => item.completed === false && item.tab === tab_id) : this.items.filter(item => item.completed === false);
      case "completed":
        return (tab_id !== 0) ? this.items.filter(item => item.completed === true && item.tab === tab_id) : this.items.filter(item => item.completed === false);
      case "all":
      default:
        return (tab_id !== 0) ? this.items.filter(item => item.tab === tab_id) : this.items.filter(item => item.completed === false);
    }
  }
}
