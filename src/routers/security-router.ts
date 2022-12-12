import {Request, Response, Router} from "express";

export const securityRouter = Router({})

securityRouter.get('/devices',

    async (req: Request, res: Response) => {

        res.status(200)
})

securityRouter.delete('/devices',

    async (req: Request, res: Response) => {

        res.status(200)
})

securityRouter.delete('/devices/:deviceId',

    async (req: Request, res: Response) => {

    res.status(200)

})
