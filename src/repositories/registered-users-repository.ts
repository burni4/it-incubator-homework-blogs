export type registredUserType = { "login": string, "password": string }
export type registredUsersType = registredUserType[]

const registredUsers: registredUsersType = [{login: "admin", password: "qwerty"}];

export const usersRepository = {
    checkUserAuthentication(login: string, password: string): boolean {
        return registredUsers.some(u => ((u.login === login && u.password === password)))
    }
}