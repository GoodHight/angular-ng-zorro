import { BlockchainModule } from './blockchain.module';

describe('BlockchainModule', () => {
  let blockchainModule: BlockchainModule;

  beforeEach(() => {
    blockchainModule = new BlockchainModule();
  });

  it('should create an instance', () => {
    expect(blockchainModule).toBeTruthy();
  });
});
