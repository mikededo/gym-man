import { DTOGroups, PersonDTOGroups } from '@gymman/shared/models/dto';
import { Gym } from '@gymman/shared/models/entities';

export type BaseFromJsonCallable<T> = (json: any, group: DTOGroups) => Promise<T>;

export type BasePersonFromJsonCallable<T> = (
  json: any,
  group: PersonDTOGroups
) => Promise<T>;

export type BaseFromClassCallable<J, T> = (entity: J) => Promise<T>;

export type BasePersonFromClassCallable<J, T> =
  | ((entity: J) => Promise<T>)
  | ((entity: J, gym: Gym) => Promise<T>);

export type ParsedToken = {
  id: number;
  email: string;
  exp: number;
}
