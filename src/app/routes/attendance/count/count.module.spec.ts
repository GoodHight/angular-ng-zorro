import { CountModule } from './count.module';

describe('CountModule', () => {
  let countModule: CountModule;

  beforeEach(() => {
    countModule = new CountModule();
  });

  it('should create an instance', () => {
    expect(countModule).toBeTruthy();
  });
});
