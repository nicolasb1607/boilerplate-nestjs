import { Test, TestingModule } from '@nestjs/testing';
import { PythonService } from './python.service';

describe('PythonService', () => {
  let service: PythonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PythonService],
    }).compile();

    service = module.get<PythonService>(PythonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
