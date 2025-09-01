// -- ./src/decorators/use-dto.decorator.ts
import { BaseEntity } from 'src/common/base/base.entity';
import { AbstractDto } from '../dto/abstract.dto';
import { Constructor } from 'src/types';

export function UseDto(
  dtoClass: Constructor<AbstractDto, [BaseEntity, unknown]>,
): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
