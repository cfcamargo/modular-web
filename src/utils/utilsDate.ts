import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";

export enum FilterTypeEnum {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  CUSTOM = "custom",
}

export const getDateRange = (
  filterType: FilterTypeEnum,
  dateReference = new Date(),
) => {
  let start, end;

  switch (filterType) {
    case FilterTypeEnum.DAY:
      start = startOfDay(dateReference);
      end = endOfDay(dateReference);
      break;

    case FilterTypeEnum.WEEK:
      start = startOfWeek(dateReference, { weekStartsOn: 0 });
      end = endOfWeek(dateReference, { weekStartsOn: 0 });
      break;

    case FilterTypeEnum.MONTH:
      start = startOfMonth(dateReference);
      end = endOfMonth(dateReference);
      break;

    case FilterTypeEnum.YEAR:
      start = startOfYear(dateReference);
      end = endOfYear(dateReference);
      break;

    default:
      start = startOfDay(new Date());
      end = endOfDay(new Date());
  }

  return {
    startDate: start,
    endDate: end,
  };
};
