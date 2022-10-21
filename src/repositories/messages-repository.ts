type messageType = {message: string, field: string}
type errorsMessagesType = { errorsMessages: messageType[]}

const errorsMessages: errorsMessagesType = {errorsMessages:[]};

export const messageRepository = {
    AddMessage(field:string, message:string): void{
        errorsMessages.errorsMessages.push({message: message, field: field});
    },
    ClearErrorsMessages(): void{
        errorsMessages.errorsMessages = [];
    }
}



