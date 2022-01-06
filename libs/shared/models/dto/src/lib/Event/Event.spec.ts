import * as ClassValidator from 'class-validator';

import { CalendarDate, Event } from '@hubbl/shared/models/entities';

import * as Util from '../util';
import EventDTO from './Event';

jest.mock('@hubbl/shared/models/entities');

const propCompare = (want: Event | EventDTO, got: Event | EventDTO) => {
  expect(got.id).toBe(want.id);
  expect(got.name).toBe(want.name);
  expect(got.description).toBe(want.description);
  expect(got.capacity).toBe(want.capacity);
  expect(got.covidPassport).toBe(want.covidPassport);
  expect(got.maskRequired).toBe(want.maskRequired);
  expect(got.startTime).toBe(want.startTime);
  expect(got.endTime).toBe(want.endTime);
  expect(got.trainer).toBe(want.trainer);
  expect(got.calendar).toBe(want.calendar);
  expect(got.template).toBe(want.template);
  expect(got.date.year).toBe(want.date.year);
  expect(got.date.month).toBe(want.date.month);
  expect(got.date.day).toBe(want.date.day);
};

describe('Event', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJson', () => {
    it('should create a DTO if json is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        id: 1,
        name: 'Event',
        description: 'Description',
        capacity: 1000,
        covidPassport: true,
        maskRequired: true,
        startTime: '09:00:00',
        endTime: '10:00:00',
        trainer: 1,
        calendar: 1,
        template: 1,
        date: { day: 29, month: 6, year: 2000 } as CalendarDate
      };

      const result = await EventDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      propCompare(json as any, result);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.any(EventDTO), {
        validationError: { target: false },
        groups: ['any']
      });
    });

    it('should not create a DTO if json is not valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(Util, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await EventDTO.fromJson({ date: {} }, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create an EventDTO from a correct Event', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockResolvedValue();

      const event = new Event();
      const date = new CalendarDate();

      date.day = 29;
      date.month = 6;
      date.year = 2000;

      event.id = 1;
      event.name = 'Event';
      event.description = 'Description';
      event.capacity = 1000;
      event.covidPassport = true;
      event.maskRequired = true;
      event.startTime = '09:00:00';
      event.endTime = '10:00:00';
      event.trainer = 1;
      event.calendar = 1;
      event.template = 1;
      event.date = date;
      event.appointments = [];

      const result = await EventDTO.fromClass(event);

      expect(result).toBeDefined();
      propCompare(event, result);

      // Additional fields
      expect(result.appointments).toStrictEqual([]);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating a EventDTO from an incorrect Event', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(Util, 'validationParser').mockReturnValue({});

      expect.assertions(3);

      try {
        await EventDTO.fromClass({ date: {} } as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return a Event', () => {
      const dto = new EventDTO();

      dto.id = 1;
      dto.name = 'Event';
      dto.description = 'Description';
      dto.capacity = 1000;
      dto.covidPassport = true;
      dto.maskRequired = true;
      dto.startTime = '09:00:00';
      dto.endTime = '10:00:00';
      dto.trainer = 1;
      dto.calendar = 1;
      dto.template = 1;
      dto.date = { day: 29, month: 6, year: 2000 } as CalendarDate;

      const result = dto.toClass();

      propCompare(dto, result);
    });
  });
});
