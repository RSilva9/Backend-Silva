import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import winston from 'winston'
import dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

const customWinstonConfig = {
    levels:{
        debug:0,
        http:1,
        info:2,
        warning:3,
        error:4,
        fatal:5
    }
}

const createLogger = env =>{
    if(env==='PROD'){
        return winston.createLogger({
            levels: customWinstonConfig.levels,
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                    level: 'info'
                }),
                new winston.transports.File({
                    filename: 'errors.log',
                    format: winston.format.simple(),
                    level: 'error'
                })
            ]
        })
    }else{
        return winston.createLogger({
            levels: customWinstonConfig.levels,
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                    level: 'debug'
                })
            ]
        })
    }
}

export const logger = createLogger(process.env.ENVIRONMENT)