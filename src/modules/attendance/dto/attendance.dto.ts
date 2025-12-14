import { IsString } from 'class-validator';
import { Resource } from 'src/common/resource';
import { Attendance } from '../entities/attendance.entity';

export class AttendanceDto extends Resource {
  @IsString()
  staffId: string;

  @IsString()
  date: string;

  @IsString()
  clockIn: string;

  @IsString()
  clockOut: string;

  constructor(partial: Partial<Attendance>) {
    super();
    Object.assign(this, partial);
  }
}
