import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown) {
        const parsedValue = this.schema.safeParse(value);
        if (!parsedValue.success) {
            throw new BadRequestException({
                message: 'Validation failed',
                errors: parsedValue.error.errors,
            });
        }
        return parsedValue.data;
    }
}