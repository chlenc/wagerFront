import {AccountStore, DappStore, HistoryStore} from './index';

class RootStore {
    public accountStore: AccountStore;
    public dappStore: DappStore;
    public historyStore: HistoryStore;


    constructor(initState?: any) {
        if (initState == null) initState = {};

        this.accountStore = new AccountStore(this, initState.accountStore);
        this.dappStore = new DappStore(this);
        this.historyStore = new HistoryStore(this);
    }

    public serialize = () => ({
        accountStore: this.accountStore.serialize(),
    });
}

export {RootStore};
