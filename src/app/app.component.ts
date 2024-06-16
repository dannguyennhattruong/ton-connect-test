import { Component, OnInit } from '@angular/core';
import { TonConntectService } from './services/ton-connect.service';
import TonWeb from 'tonweb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app-test';
  address = '';
  constructor(private tonConnectService: TonConntectService) {

  }

  ngOnInit(): void {
    this.checkConnection();
    this.tonConnectService.instance.onStatusChange(
      walletAndwalletInfo => {
        // update state/reactive variables to show updates in the ui
        // alert(JSON.stringify(walletAndwalletInfo || {}))
        this.address = (new TonWeb.Address(walletAndwalletInfo?.account?.address as string)).toString(true, true, true, false);
      }
    );
  }

  checkConnection() {
    this.tonConnectService.connected().then(r => {
      if (r) {
        this.address = (new TonWeb.Address(this.tonConnectService.currentTonWalletInfo?.account?.address)).toString(true, true, true, false);
      }
      else {
        this.address = '';
      }
    }).finally(() => {
      alert(this.address);
      if(!this.address) {
        location.reload()
      }
    })
  }

  async disconnect() {
    await this.tonConnectService.disconnect();
    this.checkConnection();
  }

  async connectWallet() {
    const walletInfor: any = await this.tonConnectService.connect();
    this.address = (new TonWeb.Address(walletInfor?.account?.address)).toString(true, true, true, false);
  }
}
