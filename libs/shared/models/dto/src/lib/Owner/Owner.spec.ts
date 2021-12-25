import { compare, genSalt, hash } from 'bcrypt';
import * as ClassValidator from 'class-validator';

import { Gym, Owner, Person } from '@gymman/shared/models/entities';
import { AppTheme, Gender } from '@gymman/shared/types';

import { PersonDTOGroups } from '../Person';
import * as Util from '../util';
import OwnerDTO from './Owner';

describe('OwnerDTO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJSON', () => {
    const successFromJSON = async (
      variant: PersonDTOGroups,
      gym: Gym | number
    ) => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        email: 'test@user.com',
        password: 'testpwd00',
        firstName: 'Test',
        lastName: 'User',
        gym,
        gender: Gender.OTHER
      };

      const result = await OwnerDTO.fromJson<number>(json, variant);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(OwnerDTO);
      // Check fields
      expect(result.email).toBe('test@user.com');
      expect(result.password).toBe('testpwd00');
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('User');
      expect(result.gym).toBe(gym);
      expect(result.gender).toBe(Gender.OTHER);
      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.anything(), {
        validationError: { target: false },
        groups: [variant]
      });
    };

    const failFromJSON = async (variant: PersonDTOGroups) => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const vpSpy = jest.spyOn(Util, 'validationParser');

      expect.assertions(3);

      try {
        await OwnerDTO.fromJson({}, variant);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    };

    it('[login, number] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOGroups.LOGIN, 1);
    });

    it('[login, gym] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOGroups.LOGIN, new Gym());
    });

    it('[register, number] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOGroups.REGISTER, 1);
    });

    it('[register, gym] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOGroups.REGISTER, new Gym());
    });

    it('[register] should fail on creating an incorrect DTO', async () => {
      await failFromJSON(PersonDTOGroups.REGISTER);
    });

    it('[login] should fail on creating an incorrect DTO', async () => {
      await failFromJSON(PersonDTOGroups.LOGIN);
    });
  });

  describe('#fromClass', () => {
    it('should create an OwnerDTO<Gym> from a correct Owner', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const password = await hash('testpwd00', await genSalt(10));

      const owner = new Owner();
      const person = new Person();
      person.id = 1;
      person.email = 'test@user.com';
      person.password = password;
      person.firstName = 'Test';
      person.lastName = 'User';
      person.gender = Gender.OTHER;
      person.theme = AppTheme.LIGHT;

      owner.person = person;
      owner.gym = new Gym();

      const result = await OwnerDTO.fromClass(owner);

      expect(result.id).toBe(1);
      expect(result.email).toBe('test@user.com');
      expect(result.password).toBe(password);
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('User');
      expect(result.theme).toBe(AppTheme.LIGHT);
      expect(result.gender).toBe(Gender.OTHER);
      expect(result.gym).toBeInstanceOf(Gym);
      // Ensure validation has been called
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating an OwnerDTO<Gym> from an incorrect Owner', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const vpSpy = jest.spyOn(Util, 'validationParser');

      expect.assertions(3);

      try {
        await OwnerDTO.fromClass({ person: {} } as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return an owner', async () => {
      // Set up class
      const dto = new OwnerDTO();
      dto.email = 'test@user.com';
      dto.password = 'testpwd00';
      dto.firstName = 'Test';
      dto.lastName = 'User';
      dto.gym = 1;
      dto.gender = Gender.OTHER;

      const result = await dto.toClass();

      expect(result.person.email).toBe('test@user.com');
      expect(result.person.firstName).toBe('Test');
      expect(result.person.lastName).toBe('User');
      expect(result.person.gym).toBe(1);
      expect(result.person.gender).toBe(Gender.OTHER);
      // Password should be hashed
      expect(await compare('testpwd00', result.person.password)).toBeTruthy();
    });
  });
});
