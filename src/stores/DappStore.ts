import { SubStore } from './SubStore';
import { broadcast, IInvokeScriptParams, invokeScript, waitForTx } from "@waves/waves-transactions";
import { NODE_URL } from "@src/constants";
import { openNotification } from "@utils/notifiations";

class DappStore extends SubStore {

    bet = async (amount: number, dApp: string, value: 1 | 2) => await this.makeInvokeTx({
        dApp,
        feeAssetId: null,
        call: {function: 'bet', args: [{type: 'integer', value}]},
        payment: [{assetId: null, amount}],
        chainId: 'T'
    })


    withdraw = async (dApp: string) => await this.makeInvokeTx({
        dApp,
        feeAssetId: null,
        call: {function: 'withdraw', args: []},
        payment: [],
        chainId: 'T'
    })


    private makeInvokeTx = async (params: IInvokeScriptParams) => {
        try {
            if (!this.rootStore.accountStore.seed) throw 'login required';
            const tx = invokeScript(params, this.rootStore.accountStore.seed);
            openNotification(tx.id, 'success')
            await broadcast(tx, NODE_URL);
            await waitForTx(tx.id, {apiBase: NODE_URL});
            await this.rootStore.eventsStore.updateEvents();
            await this.rootStore.accountStore.updateBalance();
            return tx
        } catch (e) {
            openNotification(e.message, 'error')
        }
        return null
    }

}

export default DappStore;
