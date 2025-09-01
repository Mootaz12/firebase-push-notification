import { BaseEntity } from '../base/base.entity';

export class AbstractDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(entity: BaseEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      if (!entity) {
        return;
      }
      this.id = entity.id;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
    }
  }
}
