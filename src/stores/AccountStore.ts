import { SubStore } from './SubStore';
import { RootStore } from "@stores/index";
import { action, observable } from "mobx";
import { auth, register, login } from "@src/api";
import { openNotification } from "@utils/notifiations";
import { address } from "@waves/ts-lib-crypto";
import { generateNewSeed } from "@waves/waves-transactions/dist/seedUtils";
import { balance } from "@waves/waves-transactions/dist/nodeInteraction";
import { CHAIN_ID, NODE_URL } from "@src/constants";
import { isValidAddress } from "@waves/waves-transactions/dist/validators";

class AccountStore extends SubStore {

    @observable access_token: string | null = null;
    @observable username: string | null = null;
    @observable address: string | null = null;
    @observable balance: number | null = null;
    @observable exp: number | null = null;
    @observable seed: string | null = null;
    @observable isLogin: boolean = false;

    //todo decode token
    //     get username and exp from token and encrypted seed
    //     set username, seed and exp to store
    //     get address from seen and set to store

    @action logout = () => {
        this.access_token = null;
        this.username = null;
        this.address = null;
        this.balance = null;
        this.exp = null;
        this.seed = null;
        this.isLogin = false;
    };

    @action login = async (username: string, password: string) => {
        try {
            const req = await login({username, password});
            await this.handleLoginResponse(req)
        } catch (e) {
            openNotification(e, 'error')
        }
    }


    @action register = async (hash: string, password: string) => {
        try {
            const req = await register(hash, password, generateNewSeed());
            await this.handleLoginResponse(req)
        } catch (e) {
            openNotification(e, 'error')
        }
    }

    @action handleLoginResponse(res: any) {
        if (res.status === 200) {
            if (res.data && res.data.access_token && res.data.seed) {
                const tokenData = decodeJWT(res.data.access_token);
                this.username = tokenData.user;
                this.exp = tokenData.exp;
                this.address = address(res.data.seed, CHAIN_ID);
                this.updateBalance();
                this.access_token = res.data.access_token;
                this.seed = res.data.seed;
                this.isLogin = true;
                this.rootStore.historyStore.history.push('/story')
            } else throw 'Something wrong!'
        } else {
            throw res.data || 'Something wrong!'
        }
    }

    constructor(rootStore: RootStore, initState: any) {
        super(rootStore);
        if (!initState) return;
        if (initState.access_token) this.access_token = initState.access_token;
        if (initState.username) this.username = initState.username;
        if (initState.address) {
            this.address = initState.address;
            this.updateBalance()
        }
        if (initState.exp) this.exp = initState.exp;
        if (initState.seed) this.seed = initState.seed;
        if (this.access_token) {
            auth(this.access_token).then(res => {
                if (res.data === 'success') {
                    this.isLogin = true;
                    if (this.rootStore.historyStore.currentPath === 'login') {
                        this.rootStore.historyStore.history.push('/')
                    }
                }
            })
        }
        setInterval(() => this.updateBalance(), 50000)
    }

    @action
    async updateBalance() {
        try {
            if (this.address && isValidAddress(this.address)) {
                this.balance = await balance(this.address, NODE_URL)
            }
        } catch (e) {
            console.error(e)
        }
    }

    public serialize = () => ({
        access_token: this.access_token,
        username: this.username,
        address: this.address,
        exp: this.exp,
        seed: this.seed,
    });
}


function decodeJWT(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buff = new Buffer(base64, 'base64');
    const payloadinit = buff.toString('ascii');
    return JSON.parse(payloadinit);
}

export default AccountStore;
