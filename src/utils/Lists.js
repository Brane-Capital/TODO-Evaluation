import _ from "lodash";
import TodoList from "./TodoList";

const storagekey = "todos::ids";

export default class List {
  constructor() {
    this.load();
  }

  load() {
    const data = window.localStorage.getItem(storagekey);
    if (data != null) {
      this.ids = JSON.parse(data);
      this.lists = this.ids.map(id => new TodoList(id));
      this.lists[0].selected = true;
    } else {
      this.ids = [0];
      let allList = new TodoList(0);
      allList.label = 'All';
      allList.selected = true;
      allList.editing = false;
      this.lists = [allList];
    }
    this.maxId = _.isEmpty(this.lists) ? 0 : _.maxBy(this.lists, "id").id;
  }

  save() {
    window.localStorage.setItem(storagekey, JSON.stringify(this.ids));
  }
  saveSelected() {
    this.getSelected().save();
  }

  remove(id) {
    this.lists.find(list => list.id == id).deleteList();
    this.ids = this.ids.filter(idItem => idItem !== id);
    this.lists = this.lists.filter(list => list.id !== id);
    this.save();
  }
  get(id) {
    return this.lists.find(list => list.id === id);
  }

  newId() {
    this.maxId += 1;
    return this.maxId;
  }

  toggle(todo) {
    this.getSelected().toggle(todo);
    this.saveSelected();
  }
  deleteToDo(todo) {
    this.getSelected().delete(todo);
    this.saveSelected();
  }
  addItem(title) {
    this.getSelected().add(title);
    this.saveSelected();
  }
  renameItem(itemId, newName) {
    this.getSelected().rename(itemId, newName);
    this.saveSelected();
  }
  getSelected() {
    return this.lists.find(list => list.selected === true);
  }

  add(newList) {
    this.ids.push(newList.id);
    this.lists.push(newList);
    newList.save();
    this.save();
  }

  getAll() {
    return this.lists;
  }
  select(listId) {
    this.getSelected().selected = false;
    this.lists.find(list => list.id === listId).selected = true;
    this.getSelected().save();
  }
}
