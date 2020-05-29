import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DownloadDto {
  @Field()
  url: string;

  @Field()
  type: string;

  @Field((type) => Int, { nullable: true })
  progress?: number;

  @Field({ nullable: true })
  file?: string;
}
