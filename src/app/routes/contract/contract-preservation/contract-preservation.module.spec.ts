import { ContractPreservationModule } from './contract-preservation.module';

describe('ContractPreservationModule', () => {
  let contractPreservationModule: ContractPreservationModule;

  beforeEach(() => {
    contractPreservationModule = new ContractPreservationModule();
  });

  it('should create an instance', () => {
    expect(contractPreservationModule).toBeTruthy();
  });
});
