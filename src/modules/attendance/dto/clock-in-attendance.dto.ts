import { PartialType } from '@nestjs/swagger';
import { AttendanceDto } from './attendance.dto';

export class ClockInAttendanceDto extends PartialType(AttendanceDto) {}
