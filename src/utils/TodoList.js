import _ from "lodash";
import { LocalStoragePaths } from "./constants.js";

export default class TodoList {
  // Initialized in the constructor because the props are needed.

  // Props: id string 
  constructor(id, name) {
    this.id = id;
    // TODO: move it to the load and save functions, or use a helper func.
    this.storagekey = LocalStoragePaths.ListDataPrefix + "::"+ id;


    this.name = name ? name : "New List";

    this.load();

    // Save the name.
    this.save();
  }


  getName() {
    return this.name;
  }

  setName(newName) {
    this.name = newName;
    this.save();
  }

  load() {
    const data = window.localStorage.getItem(this.storagekey);
    if (data != null) {
      const parsed = JSON.parse(data);
      this.name = parsed.name;
      this.items = parsed.items;
    } else {
      this.items = [];
    }
    this.maxId = _.isEmpty(this.items) ? 0 : _.maxBy(this.items, "id").id;
  }

  save() {
    window.localStorage.setItem(this.storagekey, JSON.stringify({
      name: this.name,
      items: this.items
    }));
  }

  newId() {
    this.maxId += 1;
    return this.maxId;
  }

  add(name) {
    const item = {
      id: this.newId(),
      // Needed to provide a 2-way binding.
      listId: this.id,
      name,
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

  toggle(todo) {
    let item = _.find(this.items, it => it.id == todo.id);
    if (item) {
      item.completed = !item.completed;
      if (item.completed) {
        item.completedAt = Date.now();
      }
      this.save();
    }
  }

  rename(id, newName) {
    let item = _.find(this.items, it => it.id == id);
    if (item) {
      item.name = newName;
      this.save();
    }
  }

  filter(status) {
    switch (status) {
      case "active":
        return this.items.filter(item => item.completed == false);
      case "completed":
        return this.items.filter(item => item.completed == true);
      case "all":
      default:
        return this.items;
    }
  }
}
