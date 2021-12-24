import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import {
  ClientDTO,
  OwnerDTO,
  PersonDTOVariants,
  WorkerDTO
} from '@gymman/shared/models/dto';
import {
  Client,
  Gym,
  Owner,
  Trainer,
  Worker
} from '@gymman/shared/models/entities';

import { BaseService } from '../../services';
import BaseController from '../Base';
import {
  BasePersonFromClassCallable,
  BasePersonFromJsonCallable
} from './types';

type LoggableEntities = Owner | Worker | Trainer | Client;

type LoggableAliases = 'owner' | 'worker' | 'trainer' | 'client';

type LoggableDTOs =
  | OwnerDTO<Gym | number>
  | WorkerDTO<Gym | number>
  | ClientDTO<Gym | number>;

export const login = async (
  service: BaseService<LoggableEntities>,
  controller: BaseController,
  fromJson: BasePersonFromJsonCallable<LoggableDTOs>,
  fromClass: BasePersonFromClassCallable<LoggableEntities, LoggableDTOs>,
  req: Request,
  res: Response,
  alias: LoggableAliases
): Promise<any> => {
  try {
    // Get the entity
    const entityDTO = await fromJson(req.body, PersonDTOVariants.LOGIN);

    try {
      // Find the entity
      const entityFound = await service
        .createQueryBuilder({ alias })
        .leftJoinAndSelect(`${alias}.person`, 'person')
        .leftJoinAndSelect('person.gym', 'gym')
        .where('person.email = :email', { email: entityDTO.email })
        .getOne();

      if (!entityFound) {
        return controller.fail(res, 'Email not found');
      }

      if (!(await compare(entityDTO.password, entityFound.person.password))) {
        return controller.unauthorized(res, 'Passwords do not match');
      }

      // Create token
      const token = sign(
        { id: entityFound.person.id, email: entityFound.person.email },
        process.env.NX_JWT_TOKEN
      );

      res.setHeader('Set-Cookie', `__gym-man-refresh__=${token}; HttpOnly`);

      // Join with the entity data
      return controller.ok(res, {
        token,
        entity: await fromClass(entityFound, entityFound.person.gym as Gym)
      });
    } catch (_) {
      return controller.fail(
        res,
        'Internal server error. If the error persists, contact our team.'
      );
    }
  } catch (e) {
    return BaseController.jsonResponse(res, 400, e);
  }
};

/**
 * If the given email and password are corrects, will return the
 * logged owner and the token
 *
 * @param service The login service
 * @param controller Controller to send the responses
 * @param fromJson FromJson mapper of the owner dto
 * @param fromClass FromClass mapper of the owner dto
 * @param req Request of the http request
 * @param res Response of the http request
 */
export const ownerLogin = async (
  service: BaseService<Owner>,
  controller: BaseController,
  fromJson: BasePersonFromJsonCallable<OwnerDTO<Gym | number>>,
  fromClass: BasePersonFromClassCallable<Owner, OwnerDTO<Gym | number>>,
  req: Request,
  res: Response
): Promise<any> =>
  login(service, controller, fromJson, fromClass, req, res, 'owner');

/**
 * If the given email and password are corrects, will return the
 * logged worker and the token
 *
 * @param service The login service
 * @param controller Controller to send the responses
 * @param fromJson FromJson mapper of the worker dto
 * @param fromClass FromClass mapper of the worker dto
 * @param req Request of the http request
 * @param res Response of the http request
 */
export const workerLogin = async (
  service: BaseService<Worker>,
  controller: BaseController,
  fromJson: BasePersonFromJsonCallable<WorkerDTO<Gym | number>>,
  fromClass: BasePersonFromClassCallable<Worker, WorkerDTO<Gym | number>>,
  req: Request,
  res: Response
): Promise<any> =>
  login(service, controller, fromJson, fromClass, req, res, 'worker');

/**
 * If the given email and password are corrects, will return the
 * logged client and the token
 *
 * @param service The login service
 * @param controller Controller to send the responses
 * @param fromJson FromJson mapper of the client dto
 * @param fromClass FromClass mapper of the client dto
 * @param req Request of the http request
 * @param res Response of the http request
 */
export const clientLogin = async (
  service: BaseService<Client>,
  controller: BaseController,
  fromJson: BasePersonFromJsonCallable<ClientDTO<Gym | number>>,
  fromClass: BasePersonFromClassCallable<Client, ClientDTO<Gym | number>>,
  req: Request,
  res: Response
): Promise<any> =>
  login(service, controller, fromJson, fromClass, req, res, 'client');
