import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, ValidationPipe } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { convertToAttendanceDateString } from 'src/helpers/attendance-date.helpers';
import { UpsertAttendanceDto } from './dto/upsert-attendance.dto';
import { Request } from 'express';
import { GetAttendanceDto } from './dto/get-attendance.dto';

@Controller({ version: '1', path: 'attendances' })
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post("/clockIn")
  async clockIn(@Req() req: Request) {
    const now = new Date()
    const upsertAttendanceDto = new UpsertAttendanceDto({
      staffId: req.user?.id + "", //coerce to string
      date: convertToAttendanceDateString(now),
      clockIn: now,
    })
    return await this.attendanceService.upsert(upsertAttendanceDto);
  }

  @Post("/clockOut")
  async clockOut(@Req() req: Request) {
    const now = new Date()
    const upsertAttendanceDto = new UpsertAttendanceDto({
      staffId: req.user?.id + "", //coerce to string
      date: convertToAttendanceDateString(now),
      clockOut: now,
    })
    return await this.attendanceService.upsert(upsertAttendanceDto);
  }

  @Get()
  async findAll(@Query(ValidationPipe) options: GetAttendanceDto) {
    const { attendances, count, meta } = await this.attendanceService.findAll(options);
    return { data: attendances, count, meta };
  }
}
