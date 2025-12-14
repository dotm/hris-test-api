import { Injectable } from '@nestjs/common';
import { Attendance } from './entities/attendance.entity';
import { AttendanceDto } from './dto/attendance.dto';
import { UpsertAttendanceDto } from './dto/upsert-attendance.dto';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';

@Injectable()
export class AttendanceService {
  async findAll(
    options: GetAttendanceDto,
  ): Promise<{ attendances: AttendanceDto[]; count: number; meta: PageMetaDto }> {
    const [attendances, count] = await Attendance.findAndCount({
      take: options.pageSize,
      skip: options.page * options.pageSize,
      order: { date: 'DESC' },
    });
    const meta = new PageMetaDto({
      itemCount: count,
      pageOptionsDto: options,
    });
    const attendanceDto = attendances.map((attendance) => new AttendanceDto(attendance));
    return { attendances: attendanceDto, count, meta };
  }

  async findOne(options: { staffId: string, date: string }): Promise<AttendanceDto | null> {
    const attendance = await Attendance.findOne({
      where: {
        staffId: options.staffId,
        date: options.date,
      },
    });
    if (!attendance) return null;
    const attendanceDto = new AttendanceDto(attendance);
    return attendanceDto;
  }

  async upsert(options: UpsertAttendanceDto) {
    let attendance = await Attendance.findOne({
      where: {
        staffId: options.staffId,
        date: options.date,
      },
    });
    if (!attendance) {
      attendance = new Attendance()
      attendance.staffId = options.staffId
      attendance.date = options.date
    };

    if (options.clockIn) attendance.clockIn = new Date(options.clockIn);

    if (options.clockOut) attendance.clockOut = new Date(options.clockOut);

    await attendance.save()

    const updatedAttendance = await Attendance.findOne({
      where: {
        staffId: options.staffId,
        date: options.date,
      },
    });
    return new AttendanceDto(updatedAttendance);
  }
}
