export function addToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

export function updateLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function removeFromLocalStorage(key) {
    localStorage.removeItem(key)
}