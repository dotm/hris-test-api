import { IsOptional, IsString } from 'class-validator';
import { Resource } from 'src/common/resource';
import { Attendance } from '../entities/attendance.entity';

export class UpsertAttendanceDto extends Resource {
  @IsString()
  staffId: string;

  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  clockIn: string;
  
  @IsOptional()
  @IsString()
  clockOut: string;

  constructor(partial: Partial<Attendance>) {
    super();
    Object.assign(this, partial);
  }
}
