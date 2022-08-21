import { NestFactory } from "@nestjs/core";
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from "typeorm-transactional-cls-hooked";
import { AppModule } from "./app.module";

initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();

async function bootstrap() {
    await NestFactory.createApplicationContext(AppModule);
}
bootstrap();
