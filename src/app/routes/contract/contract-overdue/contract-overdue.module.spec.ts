import { ContractOverdueModule } from './contract-overdue.module';

describe('ContractOverdueModule', () => {
  let contractOverdueModule: ContractOverdueModule;

  beforeEach(() => {
    contractOverdueModule = new ContractOverdueModule();
  });

  it('should create an instance', () => {
    expect(contractOverdueModule).toBeTruthy();
  });
});
