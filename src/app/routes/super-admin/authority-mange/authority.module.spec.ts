import { AuthorityModule } from './authority.module';

describe('AuthorityMangeModule', () => {
  let authorityMangeModule: AuthorityModule;

  beforeEach(() => {
    authorityMangeModule = new AuthorityModule();
  });

  it('should create an instance', () => {
    expect(authorityMangeModule).toBeTruthy();
  });
});
