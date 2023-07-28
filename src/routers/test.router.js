import { Router } from 'express';
import { logger } from '../utils.js';

const testRouter = Router()

testRouter.get('/loggerTest', (req, res)=>{
    // PARA PROBAR TODOS LOS LOGS, CAMBIAR ENTRE "PROD" Y "DEV" EN EL .env

    logger.debug("debug test.")
    logger.http("http test.")
    logger.info("info test.")
    logger.warning("warning test.")
    logger.error("error test.")
    logger.fatal("fatal test.")

    res.send("Testing loggers.")
})

export default testRouter