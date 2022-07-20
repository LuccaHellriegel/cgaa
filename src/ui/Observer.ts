export interface subscribable {
  subscribe(type: string, observer: ObserverWrapper);
}

export class ObserverWrapper {
  constructor(subjects: subscribable[], type: string, private notifyFunc) {
    subjects.forEach((sub) => {
      sub.subscribe(type, this);
    });
  }

  notify() {
    this.notifyFunc();
  }
}

export interface notifyWithVal {
  notify(val: any);
}
