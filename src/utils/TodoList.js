import _ from "lodash";
export default class TodoList {
  constructor(storagekey) {
    this.storagekey = storagekey;
    this.load();
  }

  load() {
    const data = window.localStorage.getItem(this.storagekey);
    if (data != null) {
      this.items = JSON.parse(data);
    } else {
      this.items = [];
    }
    this.maxId = _.isEmpty(this.items) ? 0 : _.maxBy(this.items, "id").id;
  }

  save() {
    window.localStorage.setItem(this.storagekey, JSON.stringify(this.items));
  }

  newId() {
    this.maxId += 1;
    return this.maxId;
  }
  add(name, tabId) {
    const item = {
      id: this.newId(),
      name,
      completed: false,
      createdAt: Date.now(),
      tabId,
    };
    this.items.unshift(item);
    this.save();
  }

  deleteTabItems(id) {
    this.items = this.items.filter((item) => item.id != id);
    this.save();
  }
  delete(todo) {
    this.items = this.items.filter((item) => item.id != todo.id);
    this.save();
  }
  deleteTab(tabId) {
    this.items = this.items.filter((item) => item.tabId != tabId);
    this.save();
  }

  toggle(todo) {
    let item = _.find(this.items, (it) => it.id == todo.id);
    if (item) {
      item.completed = !item.completed;
      if (item.completed) {
        item.completedAt = Date.now();
      }
      this.save();
    }
  }

  rename(id, newName) {
    let item = _.find(this.items, (it) => it.id == id);
    if (item) {
      item.name = newName;
      this.save();
    }
  }
  filter(status, tabId) {
    return this.items.filter((item) => {
      if (item.tabId !== tabId && tabId !== 0) {
        return false;
      }
      switch (status) {
        case "active":
          return item.completed == false;
        case "completed":
          return item.completed == true;
        case "all":
        default:
          return true;
      }
    });
  }
}
