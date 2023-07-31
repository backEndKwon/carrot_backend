import { Test, TestingModule } from '@nestjs/testing';
import { BizGateway } from './biz.gateway';

describe('BizGateway', () => {
  let gateway: BizGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BizGateway],
    }).compile();

    gateway = module.get<BizGateway>(BizGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
