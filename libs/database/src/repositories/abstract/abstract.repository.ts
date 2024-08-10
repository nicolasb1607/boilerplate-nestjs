import { DATABASE_PAGINATION_MAX_LIMIT } from '@app/database/constants/database.constants';
import { DatabaseException } from '@app/database/exceptions/database.exceptions';
import {
  FindPaginatedOptions,
  FindPaginatedResponse,
} from '@app/database/types/paginate.types';
import {
  AnyEntity,
  CreateOptions,
  EntityRepository,
  FilterQuery,
  FindOneOrFailOptions,
  Loaded,
  PopulatePath,
  RequiredEntityData,
} from '@mikro-orm/postgresql';
import { HttpException, Logger } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

export abstract class AbstractRepository<
  T extends object,
> extends EntityRepository<T> {
  private readonly logger = new Logger(AbstractRepository.name);

  public async flush() {
    try {
      await this.getEntityManager().flush();
    } catch (e) {
      this.logger.error('Error: flush = ' + e);
      throw new DatabaseException(e);
    }
  }

  public async persistAndFlush(entity: AnyEntity | AnyEntity[]) {
    try {
      await this.getEntityManager().persistAndFlush(entity);
    } catch (e) {
      this.logger.warn('persistAndFlush = ' + e);
      throw new DatabaseException(e);
    }
  }

  /*
    Create Methods
  */
  public async save(
    data: RequiredEntityData<T>,
    options?: CreateOptions<true>,
  ): Promise<T> {
    const response = await this.create(data, options);
    await this.persistAndFlush(response);
    return response;
  }

  public async findOrCreate<P extends string = never>(
    where: FilterQuery<T>,
    data: RequiredEntityData<T>,
    options?: FindOneOrFailOptions<T, P>,
  ): Promise<T> {
    try {
      return await this.findOneOrFail(where, options);
    } catch (e) {
      return this.create(data, options);
    }
  }

  public async findOrInsert<P extends string = never>(
    where: FilterQuery<T>,
    data: RequiredEntityData<T>,
    findOptions?: FindOneOrFailOptions<T, P>,
    createOptions?: CreateOptions<true>,
  ): Promise<T> {
    try {
      return await this.findOneOrFail(where, findOptions);
    } catch (e) {
      return await this.save(data, createOptions);
    }
  }

  /*
    Read Methods
  */

  public async findPaginated<
    Hint extends string = never,
    Fields extends string = PopulatePath.ALL,
    Excludes extends string = never,
  >(
    where: FilterQuery<T>,
    options?: FindPaginatedOptions<T, Hint, Fields, Excludes>,
  ): Promise<FindPaginatedResponse<Loaded<T, Hint, Fields, Excludes>>> {
    const limit = options?.limit || 100;
    const page = options?.page || 0;

    if (limit > DATABASE_PAGINATION_MAX_LIMIT) {
      throw new HttpException(
        `Maxmimum pagination limit is ${DATABASE_PAGINATION_MAX_LIMIT}`,
        HttpStatusCode.BadRequest,
      );
    }

    const offset = page * limit;

    const [items, totalItems] = await this.findAndCount(where, {
      ...options,
      offset,
    });

    return {
      items,
      meta: {
        itemCount: items.length,
        totalItems,
        itemsPerPage: Number(limit),
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page),
      },
    };
  }

  public async findAllPaginated<
    Hint extends string = never,
    Fields extends string = PopulatePath.ALL,
    Excludes extends string = never,
  >(
    options?: FindPaginatedOptions<T, Hint, Fields, Excludes>,
  ): Promise<FindPaginatedResponse<Loaded<T, Hint, Fields, Excludes>>> {
    return await this.findPaginated(null, options);
  }

  /*
    Update Methods
  */

  public async update(
    where: FilterQuery<T>,
    data: Partial<T>,
    options?: FindOneOrFailOptions<T, never>,
  ): Promise<T> {
    try {
      const entity = await this.findOneOrFail(where, options);
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      );
      Object.assign(entity, filteredData);
      await this.persistAndFlush(entity);
      return entity;
    } catch (e) {
      throw new DatabaseException(e);
    }
  }

  /*
    Delete Methods
  */
  public async delete(
    where: FilterQuery<T>,
    options?: FindOneOrFailOptions<T, never>,
  ): Promise<void> {
    try {
      const entity = await this.findOneOrFail(where, options);
      await this.getEntityManager().removeAndFlush(entity);
    } catch (e) {
      throw new DatabaseException(e);
    }
  }
}
