import { Column, Entity, Index } from 'typeorm';
import { BaseEntityWithUUID } from '../../../common/base.entity';

@Entity()
@Index('uq_attendance_staff_date', ['staffId', 'date'], { unique: true })
export class Attendance extends BaseEntityWithUUID {
  @Column()
  staffId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'timestamp', nullable: true })
  clockIn: Date;

  @Column({ type: 'timestamp', nullable: true })
  clockOut: Date;
}
