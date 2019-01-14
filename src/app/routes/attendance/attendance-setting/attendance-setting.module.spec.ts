import { AttendanceSettingModule } from './attendance-setting.module';

describe('AttendanceSettingModule', () => {
  let attendanceSettingModule: AttendanceSettingModule;

  beforeEach(() => {
    attendanceSettingModule = new AttendanceSettingModule();
  });

  it('should create an instance', () => {
    expect(attendanceSettingModule).toBeTruthy();
  });
});
