import dayjs from "dayjs";
import { DateFormatEnum } from "../enums/DateFormatEnum.enum";
export const isDateBefore = (
	date: string
) => {
	return dayjs().isBefore(dayjs(date));
};

export const formatDate = (
	date: string,
	format: DateFormatEnum
) => {
	return dayjs(date).format(
		format.toString()
	);
};
