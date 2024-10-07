export const formatSeconds = (seconds: number): string => {
    let counter = 0
    let result = ''

    const SECONDS_IN_YEAR = 31_536_000 // assuming year has 365 days as we do in contracts
    const years = Math.floor(seconds / SECONDS_IN_YEAR)
    if (years > 0) {
        seconds -= years * SECONDS_IN_YEAR
        result += `${years}y `
        if (seconds === 0) {
            return result
        } else {
            counter++
        }
    }

    const SECONDS_IN_DAY = 86_400
    const days = Math.floor(seconds / (86_400))
    if (days > 0) {
        seconds -= days * SECONDS_IN_DAY
        result += `${days}d `
        if (seconds === 0) {
            return result
        } else {
            counter++
        }
    }

    const SECONDS_IN_HOUR = 3_600
    const hours = Math.floor((seconds % 86_400) / 3600)
    if (hours > 0) {
        seconds -= hours * SECONDS_IN_HOUR
        result += `${hours}h `
        if (seconds === 0) {
            return result
        } else {
            counter++
        }
    }

    const minutes = Math.floor((seconds % 3600) / 60)
    if (counter < 3 && minutes > 0) {
        result += `${minutes}m`
    }
    
    return result
}