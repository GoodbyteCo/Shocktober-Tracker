export function getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
}

export function firstDayInMonthIndex(year: number, month: number) {
    return new Date(year, month - 1, 1).getDay()
}