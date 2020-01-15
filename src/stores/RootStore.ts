import {AccountStore, DappStore, HistoryStore, EventsStore} from './index';

class RootStore {
    public historyStore: HistoryStore;
    public eventsStore: EventsStore;
    public accountStore: AccountStore;
    public dappStore: DappStore;


    constructor(initState?: any) {
        if (initState == null) initState = {};

        this.historyStore = new HistoryStore(this);
        this.eventsStore = new EventsStore(this);
        this.accountStore = new AccountStore(this, initState.accountStore);
        this.dappStore = new DappStore(this);
    }

    public serialize = () => ({
        accountStore: this.accountStore.serialize(),
    });
}

export {RootStore};
