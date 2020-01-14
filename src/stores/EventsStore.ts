import { SubStore } from './SubStore';
import { RootStore } from "@stores/index";
import { action, autorun, computed, observable } from "mobx";
import { getEvents } from "@src/api";

interface IEvent {
    id: number
    dapp: string
    title: string
    owner: string
}

class EventsStore extends SubStore {

    constructor(rootStore: RootStore) {
        super(rootStore);
        this.updateEvents();
        autorun(async () => await this.updateEvents(), {delay: 30000})
    }

    @observable events: IEvent[] | null = null;

    @action updateEvents = async () => {
        const res = await getEvents();
        if (res.status === 200) {
            this.events = res.data.map(([id, dapp, title, owner]: any) => ({id, dapp, title, owner}))

        }
    }

}

export default EventsStore;
