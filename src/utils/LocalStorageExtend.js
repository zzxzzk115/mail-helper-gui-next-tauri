class LocalStorageExtend {
  constructor(){
    this.isClient = typeof window !== 'undefined';
  }

  getFromStorage(key, fallbackValue) {
    if (this.isClient) {
      let stored = window.localStorage.getItem(key);
      let result = stored ? JSON.parse(stored) : fallbackValue;
      return result;
    }
  }

  setToStorage(key, value) {
    if (this.isClient) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

export default new LocalStorageExtend();