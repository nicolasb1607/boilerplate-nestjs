import { FindOptions, PopulatePath } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

export class FindPaginatedResponseMeta {
  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}

export class FindPaginatedResponse<T> {
  @ApiProperty()
  meta: FindPaginatedResponseMeta;

  @ApiProperty()
  items: T[];
}

export interface FindPaginatedOptions<
  Entity,
  Hint extends string = never,
  Fields extends string = PopulatePath.ALL,
  Excludes extends string = never,
> extends FindOptions<Entity, Hint, Fields, Excludes> {
  page?: number;
}
