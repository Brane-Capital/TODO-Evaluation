import _ from "lodash";

const STORAGE_KEY = "todos::tabs";

export default class TabList {
	constructor() {
		this.load();
	}

	// @Harsh - Make it work...Running out of time now
	// generateUUID() {
	// 	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
	// 		const r = (Math.random() * 16) | 0;
	// 		const v = c == 'x' ? r : (r & 0x3) | 0x8;
	// 		return v.toString(16);
	// 	});
	// }

	load() {
		this.tabs = [{ name: 'All', id: 0 }];

		const tabs = window.localStorage.getItem(STORAGE_KEY);

		if (tabs) {
			let tabsData = [];
			
			try {
				tabsData = JSON.parse(tabs)
			} catch (error) { }
			
			this.tabs = tabsData;
		}

		this.maxId = _.isEmpty(this.tabs) ? 0 : _.maxBy(this.tabs, "id").id;
	}

	newId() {
		this.maxId += 1;
		return this.maxId;
	}

	save() {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tabs));
	}

	add() {
		const item = { name: 'New List' };
		item.id = this.newId();
		this.tabs.push(item);
		this.save();
	}

	delete(id) {
		this.tabs = this.tabs.filter(i => i.id !== id);
		this.save();
	}

	update(id, name) {
		const selectedTab = this.tabs.find((t) => t.id === id);

		if (selectedTab) {
			selectedTab.name = name;
			this.save();
		}
	}

	rename(id, name) {
		let tab = this.tabs.find(t => t.id === id);

		if (tab) {
			tab.name = name;
			this.save();
		}
	}
}