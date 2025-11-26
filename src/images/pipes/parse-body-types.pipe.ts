import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseBodyTypesPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log('HELLO??')
        throw new Error("Method not implemented.");
    }
}