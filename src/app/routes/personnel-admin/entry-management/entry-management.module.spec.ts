import { EntryManagementModule } from './entry-management.module';

describe('EntryManagementModule', () => {
  let entryManagementModule: EntryManagementModule;

  beforeEach(() => {
    entryManagementModule = new EntryManagementModule();
  });

  it('should create an instance', () => {
    expect(entryManagementModule).toBeTruthy();
  });
});
