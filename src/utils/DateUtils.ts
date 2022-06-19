import date from 'date-and-time'

export default class DateUtils {
    static #uptime = new Date()

    static checkTimeZone = () => {
        return date.format(new Date(), 'YYYY-MM-DD HH:mm:ss ddd, MMMM [GMT]Z')
    }
    static currentDate = () => date.format(new Date(), 'YYYYMMDD')
    static currentTime = () => date.format(new Date(), 'HHmmss')
    static currentFullTime = () => date.format(new Date(), 'YYYYMMDD HH:mm:ss')
    static format = format => date.format(new Date(), format)
    static now = () => new Date()
    static locale = () => date.locale()
    static uptime = () => date.format(this.#uptime, 'YYYY-MM-DD HH:mm:ss')
    static getUptime = () => this.#uptime
    static addMinutes = minutes => date.addMinutes(new Date(), minutes)
    static addHours = hours => date.addHours(new Date(), hours)
    static addDays = days => date.addDays(new Date(), days)
    static addMonths = months => date.addMonths(new Date(), months)
    static addYears = years => date.addYears(new Date(), years)
    static extractDate:(timestamp) => String = timestamp => date.format(new Date(timestamp), 'YYYYMMDD')
    static extractTime = timestamp => date.format(new Date(timestamp), 'HHmmss')
    static extractFullTime = timestamp => date.format(new Date(timestamp), 'YYYYMMDD HH:mm:ss')
    static diffSeconds = origin => Math.abs((new Date().getTime() - origin.getTime()) / 1000)
    static isAfterMinutesFrom = (date, minutes) => {
        const compare = date.addMinutes(new Date(), minutes)
        return date.isAfter(compare)
    }
}
