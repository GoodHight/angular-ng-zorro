import { AttendanceRecordModule } from './attendance-record.module';

describe('AttendanceRecordModule', () => {
  let attendanceRecordModule: AttendanceRecordModule;

  beforeEach(() => {
    attendanceRecordModule = new AttendanceRecordModule();
  });

  it('should create an instance', () => {
    expect(attendanceRecordModule).toBeTruthy();
  });
});
