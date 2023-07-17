export const generateRegisterErrorInfo = (user)=>{
    return `
    One or more fields were wrongfully filled.
    List of requiered fields:
    * first_name: needs to be a String, recieved (${user.first_name})
    * last_name: needs to be a String, recieved (${user.last_name})
    * email: needs to be a String, recieved (${user.email})
    * age: needs to be a Number, recieved (${user.age})
    * password: needs to be a String, recieved (${user.password})
    `
}

export const generateLoginErrorInfo = (user)=>{
    return `
    Invalid user info. User does not exist.
    You entered:
    * email: (${user.email})
    * password: (${user.password})
    `
}

export const generateProductErrorInfo = (pid)=>{
    return `
    Product with id:(${pid}) does not exist.
    `
}

export const generateCartErrorInfo = (cid)=>{
    return `
    Cart with id:(${cid}) does not exist.
    `
}