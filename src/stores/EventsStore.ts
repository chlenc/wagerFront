import {SubStore} from './SubStore';
import {RootStore} from '@stores/index';
import {action, autorun, observable} from 'mobx';
import {getEvents} from '@src/api';
import {accountData} from '@waves/waves-transactions/dist/nodeInteraction';
import {NODE_URL} from '@src/constants';
import {base58Decode} from '@waves/ts-lib-crypto';
import {_hashChain} from '@waves/ts-lib-crypto/crypto/hashing';

interface IEvent {
    id: number
    dapp: string
    title: string
    owner: string
    state?: TDappState
}

export type TStoryItem = {
    e: number
    k1: number
    k2: number
    i: number
}
export type TDappState = {
    k1: number
    k2: number
    // event1amount: number
    // event2amount: number
    debtAmount1: number
    debtAmount2: number
    //
    // story: TStoryItem[]
}

class EventsStore extends SubStore {

    @observable events: IEvent[] | null = null;
    @observable currentEvent: IEvent | null = null;

    constructor(rootStore: RootStore) {
        super(rootStore);
        this.updateEvents();
        setInterval(async () => {
            await this.updateEvents();
            await this.updateDappState();
        }, 10000);
        autorun(async () => await this.updateDappState());
    }

    updateDappState = async () => {
        const pathname = this.rootStore.historyStore.currentPath;

        if (pathname.includes('login')) return;
        if (pathname.includes('story')) return;
        if (pathname.includes('register')) return;

        const currentEvent = pathname && isValidAddress(pathname) && this.events
            ? this.events.find(({dapp}) => dapp === pathname)
            : undefined;
        if (currentEvent) {
            const data = await accountData(pathname, NODE_URL);
            // state.k1 = data.q1_next;
            // state.k2 = data.q2_next;
            // state.event1amount = data[`${address}_event1amount`];
            // state.event2amount = data[`${address}_event2amount`];

            currentEvent.state = {
                k1: +data.q1_next.value,
                k2: +data.q2_next.value,
                debtAmount1: +data.debtAmount1.value,
                debtAmount2: +data.debtAmount2.value
            };
            this.currentEvent = currentEvent;
        } else {
            this.currentEvent = null;
        }
    };

    //todo remake this shit
    getHistory = async () => {
        const {address} = this.rootStore.accountStore;
        if (this.rootStore.accountStore.address) {
            const data = await accountData('3MvuSn7KBR39PoLQ9jDM117mDyzFuBJs3qy', NODE_URL);
            return Object.values(data)
                .filter(({key, value}) => key.includes('bettor') && value === address)
                .map(({key}, i) => {
                    const index = key.split('_')[0];
                    const event = data[`${index}_event`].value;
                    const coefficient = data[`${index}_qoef${event}`].value;
                    return {index, event, coefficient, key: i};
                });
        } else {
            this.currentEvent = null;
        }
        return []
    };

    @action updateEvents = async () => {
        const res = await getEvents();
        if (res.status === 200) {
            this.events = res.data.map(([id, dapp, title, owner]: any) => ({id, dapp, title, owner}));
        }
    };

}


function isValidAddress(address: string): boolean {

    try {
        const addressBytes = base58Decode(address);
        return (
            addressBytes.length === 26 &&
            addressBytes[0] === 1 &&
            addressBytes.slice(-4).toString() === _hashChain(addressBytes.slice(0, 22)).slice(0, 4).toString()
        );
    } catch (e) {
        // console.error('isValidAddress error:', e)
    }
    return false;
}

export default EventsStore;
