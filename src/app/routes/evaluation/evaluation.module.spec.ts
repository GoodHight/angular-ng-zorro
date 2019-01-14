import { EvaluationModule } from './evaluation.module';

describe('EvaluationModule', () => {
  let evaluationModule: EvaluationModule;

  beforeEach(() => {
    evaluationModule = new EvaluationModule();
  });

  it('should create an instance', () => {
    expect(evaluationModule).toBeTruthy();
  });
});
