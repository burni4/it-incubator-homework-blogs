export type registredUserType = { "login": string, "password": string }
export type registredUsersType = registredUserType[]

export const registredUsers: registredUsersType = [{login: "admin", password: "qwerty"}];