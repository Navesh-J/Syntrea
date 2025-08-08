// import { PrismaClient } from "../generated/prisma";
import { PrismaClient } from "../../src/generated/prisma";

const prismaClient = new PrismaClient({
    log:["query"]
})

export default prismaClient;