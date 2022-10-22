import basicAuth from 'express-basic-auth';
import {usersRepository} from "../repositories/registered-users-repository";

export const authorizationMiddleware = basicAuth({

        authorizer: (user, password, authorize) => {
            return authorize(null, usersRepository.checkUserAuthentication(user, password))
        },
        authorizeAsync: true,
})

