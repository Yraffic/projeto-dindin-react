export function setItem(key, token){
    return localStorage.setItem(key, token)
}

export function getItem(key){
    return  localStorage.getItem(key)
}

export function remove(key){
    return  localStorage.removeItem(key)
}
export function clear(){
    return localStorage.clear()
}


