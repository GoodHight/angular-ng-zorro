import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BlockchainRoutingModule } from './blockchain-routing.module';
import { IndexComponent } from './index/index.component';
import { WellComponent } from './well/well.component';
import { ElectronicComponent } from './electronic/electronic.component';
import { InfoComponent } from './info/info.component';
import { CertificateModule } from './certificate/certificate.module';
import { StorageModule } from './storage/storage.module';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    BlockchainRoutingModule,
    CertificateModule,
    StorageModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      IndexComponent,
      WellComponent,
      ElectronicComponent,
      InfoComponent,
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class BlockchainModule { }
