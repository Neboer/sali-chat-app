import Message from "./Message";
import ServerCommand from "./ServerCommand";

export function parseTransmission(passString: string, caseMessage?: (message?: Message) => void, caseServerCommand?: (command?: ServerCommand) => void) {
    if (passString.slice(0, 2) === 'sc' && caseServerCommand) {
        caseServerCommand(ServerCommand.parse(passString));
    }
    else if(caseMessage){
        caseMessage(Message.parse(passString))
    }
}