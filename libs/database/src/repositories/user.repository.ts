import { UserEntity } from "@app/database/entities/user.entity";
import { AbstractRepository } from "@app/database/repositories/abstract/abstract.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository extends AbstractRepository<UserEntity> {}