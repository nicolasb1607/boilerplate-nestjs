import { ApiProperty } from '@nestjs/swagger';

export class Thumbnail {
  @ApiProperty()
  url: string;
  @ApiProperty()
  width: number;
  @ApiProperty()
  height: number;
}

export class GoogleImageResult {
  @ApiProperty()
  url: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  width: number;
  @ApiProperty()
  height: number;
  @ApiProperty()
  size: number;
  @ApiProperty({ type: Thumbnail })
  thumbnail: Thumbnail;
}
