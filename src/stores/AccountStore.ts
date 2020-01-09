import {SubStore} from './SubStore';
import {RootStore} from "@stores/index";
import {action, observable} from "mobx";
import {auth} from "@src/api";

class AccountStore extends SubStore {

    @observable access_token: string | null = null;
    @observable isLogin: boolean = false;
    @action setAccessToken = (token: string) => this.access_token = token;
    @action logout = () => {
        this.isLogin = false;
        this.access_token = null;
    };

    constructor(rootStore: RootStore, initState: any) {
        super(rootStore);
        if (!initState) return;
        if (initState.access_token) this.access_token = initState.access_token;
        if (this.access_token) {
            auth(this.access_token).then(res => {
                if (res.data === 'success') {
                    this.isLogin = true
                    if(this.rootStore.historyStore.currentPath === 'login'){
                        this.rootStore.historyStore.history.push('/')
                    }
                }
            })
        }
    }


    public serialize = () => ({
        access_token: this.access_token
    });


}

export default AccountStore;
