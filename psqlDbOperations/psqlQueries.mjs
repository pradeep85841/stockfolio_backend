import { createRequire } from "module";
const require = createRequire(import.meta.url);

import pool from './psqlDBConnect.mjs';


export const getITCatalogue = (req, res)=>{
    console.log("in get it catalogue")
    pool.query(`SELECT * FROM itcatalogue`,(err,result)=>{
        if(err) throw err;
        console.log(result.rows)
        res.status(200).json(result.rows)
        
    })
}

export const getDividentCatalogue = (req, res)=>{
    pool.query(`SELECT * FROM dividentcatalogue`,(err,result)=>{
        if(err) throw err;
        res.status(200).json(result.rows)
    })
}

export const lowROEStocks = async()=>{  
    const roe = await pool.query(`SELECT stock FROM itcatalogue where roe=(SELECT MIN(roe) FROM itcatalogue)`)
    const response=[];
    for(let i=0;  i< roe.rows.length; i++){
        response[i] = JSON.parse(JSON.stringify(roe.rows[i].stock));
    }
    return response;
    }

export const lowESPStocks = async()=>{  
        const esp = await pool.query(`SELECT stock FROM itcatalogue where esp=(SELECT MIN(esp) FROM itcatalogue)`)
        const response=[];
        for(let i=0;  i< esp.rows.length; i++){
            response[i] = JSON.parse(JSON.stringify(esp.rows[i].stock));
        }
        return response;
        }

export const highPeStocks = async()=>{  
            const peRatio = await pool.query(`SELECT stock FROM itcatalogue where peratio=(SELECT Max(peratio) FROM itcatalogue)`)
            const response=[];
            for(let i=0;  i< peRatio.rows.length; i++){
                    response[i] = JSON.parse(JSON.stringify(peRatio.rows[i].stock));
                }
                return response;
            }

export const priceSum = async(table)=>{  
                const sum = await pool.query(`SELECT SUM("currentprice") FROM ${table}`)
                const response=[];
                for(let i=0;  i< sum.rows.length; i++){
                        response[i] = JSON.parse(JSON.stringify(sum.rows[i].sum));
                    }
                    return response;
                }

export const avgCagr = async(table)=>{  
                    const avg = await pool.query(`SELECT AVG("cagr") FROM ${table}`)
                    const response=[];
                    for(let i=0;  i< avg.rows.length; i++){
                            response[i] = JSON.parse(JSON.stringify(avg.rows[i].avg));
                        }
                        return response;
                    }

export const avgVolatality = async(table)=>{  
                        const avg = await pool.query(`SELECT AVG("volatality") FROM ${table}`)
                        const response=[];
                        for(let i=0;  i< avg.rows.length; i++){
                                response[i] = JSON.parse(JSON.stringify(avg.rows[i].avg));
                            }
                            return response;
                        }

export const getCagr = async(table)=>{  
                    const cagr = await pool.query(`SELECT "cagr" FROM ${table}`)
                    const response=[];
                    for(let i=0;  i< cagr.rows.length; i++){
                            response[i] = JSON.parse(JSON.stringify(cagr.rows[i].cagr));
                        }
                        return response;
                    }

export const getCurrentPrice = async(table)=>{  
                        const currentPrice = await pool.query(`SELECT "currentprice" FROM ${table}`)
                        const response=[];
                        for(let i=0;  i< currentPrice.rows.length; i++){
                                response[i] = JSON.parse(JSON.stringify(currentPrice.rows[i].currentprice));
                            }
                            return response;
                        }

export const tableExists = async(tableName)=>{  
                            const existing = await pool.query(`select exists(select * from pg_tables where schemaname='public' and tablename='${tableName}')`)
                            const response = JSON.parse(JSON.stringify(existing.rows[0].exists));
                            return response;
                            }
 
