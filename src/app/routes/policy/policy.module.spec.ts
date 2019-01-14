import { PolicyModule } from './policy.module';

describe('PolicyModule', () => {
  let policyModule: PolicyModule;

  beforeEach(() => {
    policyModule = new PolicyModule();
  });

  it('should create an instance', () => {
    expect(policyModule).toBeTruthy();
  });
});
