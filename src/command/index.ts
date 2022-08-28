import { HoldCommand, HoldHandler } from "./hold.handler";
import { RegisterCommand, RegisterHandler } from "./register.handler";
import { SearchCommand, SearchHandler } from "./search.handler";

export { RegisterCommand, SearchCommand, HoldCommand };

export const CommandHandlers = [RegisterHandler, SearchHandler, HoldHandler];
