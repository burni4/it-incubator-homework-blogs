import {NextFunction, Request, Response} from "express";
import add from "date-fns/add";

type connectionType = {
    endpoint: string
    ip: string
    firstConnectionTime: Date
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
            firstConnectionTime: new Date(),
            connectionCount: 1
        }
        connectionTable.push(newConnection)
        return next()
    }

    if (curConnection.connectionCount >= 5 &&
        add(curConnection.firstConnectionTime, {seconds: 10}) > new Date()) {
        connectionTable.splice(connectionTable.indexOf(curConnection), 1)
        return res.status(429)
    }

    curConnection.connectionCount++
    next()
}




