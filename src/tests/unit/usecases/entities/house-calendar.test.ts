import { HouseCalendarFactory } from '../../../../domain/entities/house-calendar-factory';

describe('is available', () => {
  const calendar = HouseCalendarFactory.create({
    entries: [
      {
        type: 'reservation',
        id: '1',
        startDate: new Date('2021-01-04'),
        endDate: new Date('2021-01-06'),
      },
    ],
  });

  test('available before the existing reservation', () => {
    expect(
      calendar.isAvailable(new Date('2021-01-01'), new Date('2021-01-03')),
    ).toBe(true);
  });

  test('unavailable when the start date is blocked', () => {
    expect(
      calendar.isAvailable(new Date('2021-01-04'), new Date('2021-01-07')),
    ).toBe(false);
  });

  test('unavailable when the end date is blocked', () => {
    expect(
      calendar.isAvailable(new Date('2021-01-03'), new Date('2021-01-06')),
    ).toBe(false);
  });

  test('unavailable when the dates wrap the reservation', () => {
    expect(
      calendar.isAvailable(new Date('2021-01-03'), new Date('2021-01-07')),
    ).toBe(false);
  });

  test('unavailable when the end date is inside the reservation', () => {
    expect(
      calendar.isAvailable(new Date('2021-01-01'), new Date('2021-01-05')),
    ).toBe(false);
  });

  test('unavailable when the start date is inside the reservation', () => {
    expect(
      calendar.isAvailable(new Date('2021-01-05'), new Date('2021-01-08')),
    ).toBe(false);
  });
});
