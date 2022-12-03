type messageType = {message: string | null, field: string | null}
type errorsMessagesType = { errorsMessages: messageType[]}

export const errorsMessages: errorsMessagesType = {errorsMessages:[]};

export const messageRepository = {
    getAllMessages(): errorsMessagesType{
        return errorsMessages;
    },
    addMessage(field:string, message:string): void{
        errorsMessages.errorsMessages.push({message: message, field: field});
    },
    clearErrorsMessages(): void{
        errorsMessages.errorsMessages = [];
    },
    convertErrorMessagesFromValidationResult(obj: any): errorsMessagesType{
        this.clearErrorsMessages();

        obj.errors.forEach((e:any)=>{
            this.addMessage(e.param, e.msg);
        })

        return errorsMessages;
    }
}
