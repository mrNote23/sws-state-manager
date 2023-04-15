type TStoreHolder = {
  store: { [key: string]: StoreNode };
  storeNode: StoreNode | {};
};

export type TSubscriberItem = {
  varName: string;
  uuid: string;
};

class StoreNode {
  value: any = null;
  subscribers: { [key: string]: (val: any) => void };

  constructor(val = null) {
    this.value = val;
    this.subscribers = {};
  }

  set setter(val: any) {
    let a = this.value;
    let b = val;
    // не совсем верно, но для данного случая пойдет
    if (typeof val === 'object') {
      a = JSON.stringify(a);
      b = JSON.stringify(b);
    }
    if (a !== b) {
      this.processSubscribers(val);
    }
    this.value = val;
  }

  get getter(): any {
    return this.value;
  }

  unSubscribe(uuid: string): void {
    delete this.subscribers[uuid];
  }

  subscribe(cb: (value: any) => void): string {
    let uuid = '';
    while (this.subscribers[uuid] || uuid === '') {
      uuid = `${(~~(Math.random() * 1e8)).toString(16)}-${(~~(Math.random() * 1e8)).toString(16)}-${(~~(
        Math.random() * 1e8
      )).toString(16)}`;
    }

    this.subscribers[uuid] = cb;
    cb(this.value);
    return uuid;
  }

  processSubscribers = <T>(val: T): void => {
    for (const uuid in this.subscribers) {
      this.subscribers[uuid](val);
    }
  };
}

export class State {
  storeHolder: TStoreHolder;

  constructor() {
    this.storeHolder = {
      store: {},
      storeNode: StoreNode,
    };
  }

  // получение значения параметра
  public extract(varName: string): any {
    if (varName && this.storeHolder.store[varName]) {
      return this.storeHolder.store[varName].value;
    } else {
      return null;
    }
  }

  // установка значения параметра
  public dispatch<T>(varName: string, val: T): void {
    if (varName && this.storeHolder.store[varName]) {
      this.storeHolder.store[varName].setter = val;
    } else {
      throw new Error(`State.Dispatch: wrong variable '${varName}'`);
    }
  }

  // подписка на изменение параметра
  public subscribe(varName: string, cb: (val: any) => void): TSubscriberItem {
    if (varName && this.storeHolder.store[varName]) {
      return {
        varName: varName,
        uuid: this.storeHolder.store[varName].subscribe(cb),
      };
    } else {
      throw new Error(`State.Subscribe: wrong variable '${varName}'`);
    }
  }

  // отписка
  public unsubscribe(subs: TSubscriberItem): void {
    const { varName, uuid } = { ...subs };
    if (varName && this.storeHolder.store[varName]) {
      this.storeHolder.store[varName].unSubscribe(uuid);
    } else {
      throw new Error(`State.UnSubscribe: wrong variable '${varName}'`);
    }
  }

  // сохранение параметра
  public store(varName: string | null = null, val: any): boolean {
    if (!varName) {
      throw new Error(`State.Store: wrong variable '${varName}'`);
    } else {
      this.storeHolder.store[varName] = new StoreNode(val);
      return true;
    }
  }

  // сброс
  public clear(): void {
    this.storeHolder.store = {};
  }
}

export default State;
