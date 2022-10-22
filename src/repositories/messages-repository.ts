type messageType = {message: string, field: string}
type errorsMessagesType = { errorsMessages: messageType[]}

const errorsMessages: errorsMessagesType = {errorsMessages:[]};

export const messageRepository = {
    getAllMessages(): errorsMessagesType{
        return errorsMessages;
    },
    addMessage(field:string, message:string): void{
        errorsMessages.errorsMessages.push({message: message, field: field});
    },
    clearErrorsMessages(): void{
        errorsMessages.errorsMessages = [];
    }
}



