export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const isValidName = (name: string): boolean => {
    return !!(name && name.trim().length > 0)
}

export const validatePagination = (page: number, size: number) => {
    const validPage = Math.max(1, parseInt(page.toString()) || 1)
    const parsedSize = parseInt(size.toString())
    const validSize = Math.min(100, Math.max(1, isNaN(parsedSize) ? 10 : parsedSize))
    
    return { page: validPage, size: validSize }
}