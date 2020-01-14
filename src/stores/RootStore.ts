import {AccountStore, DappStore, HistoryStore, EventsStore} from './index';

class RootStore {
    public eventsStore: EventsStore;
    public accountStore: AccountStore;
    public dappStore: DappStore;
    public historyStore: HistoryStore;


    constructor(initState?: any) {
        if (initState == null) initState = {};

        this.eventsStore = new EventsStore(this);
        this.accountStore = new AccountStore(this, initState.accountStore);
        this.dappStore = new DappStore(this);
        this.historyStore = new HistoryStore(this);
    }

    public serialize = () => ({
        accountStore: this.accountStore.serialize(),
    });
}

export {RootStore};
