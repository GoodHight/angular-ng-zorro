import { ContractModule } from './contract.module';

describe('ContractModule', () => {
  let contractModule: ContractModule;

  beforeEach(() => {
    contractModule = new ContractModule();
  });

  it('should create an instance', () => {
    expect(contractModule).toBeTruthy();
  });
});
