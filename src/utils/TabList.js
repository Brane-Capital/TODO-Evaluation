import _ from "lodash";

const storagekey = "tabs::data";

export default class TodoList {
  constructor() {
    this.load();
  }

  load() {
    const data = window.localStorage.getItem(storagekey);
    if (data != null) {
      this.items = JSON.parse(data);
    } else {
      this.items = [{
        id: 0,
        name: "All",
      }];
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

  add() {
    let name = "New Tab";
    let i = 0;
    let filter = this.items.filter(item => item.name === name);
    let isExist = false;
    if (filter.length > 0) {
      isExist = true;
    }

    while(isExist){
      i++;
      name = "New Tab " + i.toString();
      filter = this.items.filter(item => item.name === name);
      if (filter.length > 0) {
        isExist = true;
      } else {
        break;
      }
    }

    const item = {
      id: this.newId(),
      name,
      createdAt: Date.now(),
    };
    this.items.push(item);
    this.save();
  }

  delete(id) {
    this.items = this.items.filter(item => item.id != id);
    this.save();
  }

  rename(id, newName) {
    let item = _.find(this.items, it => it.id === id);
    if (item) {
      item.name = newName;
      this.save();
    }
  }

  filter() {
    return this.items;
  }

  get(id) {
    return this.items.filter(item => item.id === id);
  }
}
