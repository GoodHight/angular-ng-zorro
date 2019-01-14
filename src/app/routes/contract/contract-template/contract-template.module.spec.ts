import { ContractTemplateModule } from './contract-template.module';

describe('ContractTemplateModule', () => {
  let contractTemplateModule: ContractTemplateModule;

  beforeEach(() => {
    contractTemplateModule = new ContractTemplateModule();
  });

  it('should create an instance', () => {
    expect(contractTemplateModule).toBeTruthy();
  });
});
