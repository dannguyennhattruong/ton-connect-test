import { Injectable } from "@angular/core";
import { TonConnectUI } from "@tonconnect/ui";

@Injectable()
export class TonConntectService {
    public instance!: TonConnectUI;
    public currentTonWalletInfo: any;
    constructor() {
        if (!this.instance) {
            this.instance = new TonConnectUI({
                manifestUrl: 'https://asset.battlecity.io/Metadata/tonconnect-mainfest.json',
            });

            this.instance.uiOptions = {
                actionsConfiguration: {
                    twaReturnUrl: 'https://t.me/tonconnect_test_bot/tonconnecttestapp'
                },
                walletsListConfiguration: {
                }
            };
        }
    }

    async connected() {
        const connected = await this.instance.connectionRestored;
        if (connected) {
            this.currentTonWalletInfo = this.instance;
        }
        return connected;
    }

    async disconnect() {
        await this.instance.disconnect();
        this.currentTonWalletInfo = {};
    }

    async connect() {
        const restored = await this.instance.connectionRestored;
        if (restored) {
            this.currentTonWalletInfo = this.instance;
            return this.currentTonWalletInfo
        }
        await this.instance.openModal();

        return new Promise(resolve => {
            this.instance.onStatusChange(
                walletAndwalletInfo => {
                    // update state/reactive variables to show updates in the ui
                    this.currentTonWalletInfo = walletAndwalletInfo;
                    console.log(this.currentTonWalletInfo);

                    resolve(this.currentTonWalletInfo)
                }
            );
        })

    }

}