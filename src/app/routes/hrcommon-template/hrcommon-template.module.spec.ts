import { HrcommonTemplateModule } from './hrcommon-template.module';

describe('HrcommonTemplateModule', () => {
  let hrcommonTemplateModule: HrcommonTemplateModule;

  beforeEach(() => {
    hrcommonTemplateModule = new HrcommonTemplateModule();
  });

  it('should create an instance', () => {
    expect(hrcommonTemplateModule).toBeTruthy();
  });
});
