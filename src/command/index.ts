import { RegisterCommand, RegisterHandler } from "./register.handler";
import { SearchCommand, SearchHandler } from "./search.handler";

export { RegisterCommand, SearchCommand };

export const CommandHandlers = [RegisterHandler, SearchHandler];
