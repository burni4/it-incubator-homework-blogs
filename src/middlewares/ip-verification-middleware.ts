import {NextFunction, Request, Response} from "express";
import add from "date-fns/add";

type connectionType = {
    endpoint: string
    ip: string
    expireDate: Date
    connectionCount: number
}

const connectionTable: connectionType[] = []

export const ipVerification = async (req: Request, res: Response, next: NextFunction) => {
    const currentIp = req.ip
    const currentUrl: string = req.originalUrl
    let curConnection: connectionType | undefined

    curConnection = connectionTable.find((elem, index) => {
        if (elem.endpoint === currentUrl && elem.ip === currentIp) {
            return true
        }
    })

    if (!curConnection) {
        const newConnection: connectionType = {
            endpoint: currentUrl,
            ip: currentIp,
            expireDate: add(new Date, {seconds: 10}),
            connectionCount: 1
        }
        connectionTable.push(newConnection)
        return next()
    }

    curConnection.connectionCount++

    if (curConnection.expireDate > new Date()) {

        if(curConnection.connectionCount > 5){
            return res.sendStatus(429)
        }

    }else{
        connectionTable.splice(connectionTable.indexOf(curConnection), 1)
    }

    next()
}




