import BaseService from './Base.service';

/**
 * Mock class to use for the generic service
 */
class Mock {}

describe('BaseService', () => {
  describe('#constructor', () => {
    it('should create the repository with the correct arguments', () => {
      const mockRepoAccessor = jest.fn();

      new BaseService(Mock, mockRepoAccessor);

      expect(mockRepoAccessor).toHaveBeenCalledTimes(1);
      expect(mockRepoAccessor).toHaveBeenCalledWith(Mock, 'postgres');
    });
  });

  describe('#save', () => {
    it('should save an owner', () => {
      const mockRepository = {
        save: jest.fn().mockImplementation(() =>
          Promise.resolve({
            id: 1,
            email: 'test@email.com',
            password: 'hashed-pwd'
          })
        )
      };
      const mockRepoAccessor = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new BaseService(Mock, mockRepoAccessor);
      service.save({ email: 'test@email.com', password: 'hashed-pwd' } as any);

      expect(mockRepository.save).toHaveBeenCalledWith({
        email: 'test@email.com',
        password: 'hashed-pwd'
      } as any);
    });
  });

  describe('#createQueryBuilder', () => {
    it('should return the created query builder', () => {
      const mockRepository = {
        createQueryBuilder: jest.fn().mockReturnValue({})
      };
      const mockRepoAccessor = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new BaseService(Mock, mockRepoAccessor);
      service.createQueryBuilder({
        alias: 'mock-alias',
        queryRunner: {} as any
      });

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'mock-alias',
        {}
      );
    });
  });
});
