import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { IRequestValidator } from '../../../IRequestValidator';
import { UpdateRequest } from './UpdateRequest';

export class UpdateRequestValidation implements IRequestValidator<UpdateRequest> {
  validate(request: UpdateRequest): void {
    if (!request.sku) throw new BadRequestException(ExceptionCodeEnum.SKU_IS_REQUIRED);
    if (!request.name) throw new BadRequestException(ExceptionCodeEnum.NAME_IS_REQUIRED);
    if (!request.price || request.price < 0) throw new BadRequestException(ExceptionCodeEnum.PRICE_IS_REQUIRED);
    if (!request.brand) throw new BadRequestException(ExceptionCodeEnum.BRAND_IS_REQUIRED);
  }
}
