const mysql = require( 'mysql' );
class Database {
    constructor() {
        let config = {
            host: "localhost",
            user: "root",
            password: "",
            database: "database name"
          }
     this.connection = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( async( resolve, reject ) => {

            await this.connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

            await this.connection.beginTransaction();

            await this.connection.query( sql, args, ( err, rows ) => {
                if ( err ) reject( err );
                        resolve( rows );
            })

            await this.connection.commit();

                // this.connection.query( sql, args, ( err, rows ) => {
                //     if ( err ) reject( err );
                //             resolve( rows );
                // } );
        } );
    }


   
    

    countRows( sql, args ) {
        return new Promise( async( resolve, reject ) => {

            await this.connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

            await this.connection.beginTransaction();

            await this.connection.query( sql, args, ( err, rows ) => {
                if ( err ) {
                    reject( err )
                }else{
                    if(rows.length==0){
                        resolve(0); 
                    }else{
                        resolve( rows.length ); 
                    }
                    
                } 
            })

            await this.connection.commit();

        } );
    }
    selectSingleRow( sql, args ) {
        return new Promise( async( resolve, reject ) => {
            await this.connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

            await this.connection.beginTransaction();

            await this.connection.query( sql, args, ( err, rows ) => {
                if ( err ) { reject( err )}
                    else{
                        if(rows.length==0){
                            resolve({})
                        }else{
                            resolve( rows[0] )
                        }
                        
                    } 
            })

            await this.connection.commit();



        } );
    }
    select( sql, args ) {
        return new Promise( async( resolve, reject ) => {
            await this.connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

            await this.connection.beginTransaction();


            await this.connection.query( sql, args, ( err, rows ) => {
                if ( err )  reject( err )
                resolve( rows )
            })

            await this.connection.commit();

              
        } );
    }
    insert(tableName,insertObj){
        let n = 0;
        let questionPlaceHolders = " ";
        while(n<Object.keys(insertObj).length){
            questionPlaceHolders = questionPlaceHolders+'?'+','
            n++;
        }
        questionPlaceHolders =  questionPlaceHolders.replace(/,(\s+)?$/, '');
        let placeHolderKeysValuesPaire = []
        for (let [key,value] of Object.entries(insertObj)) {        
            let obj = {
                [key]:value
            }
            placeHolderKeysValuesPaire.push(obj)
        }    
        return new Promise(async(resolve,reject)=>{

            await this.connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

            await this.connection.beginTransaction();

            await this.connection.query( `INSERT INTO ${tableName} SET ${questionPlaceHolders}`,placeHolderKeysValuesPaire, ( error,result ) => {
                if(error) reject(error)
                resolve(result)
            })

            await this.connection.commit();


        })
    }
    
    update(tableName,updateObj,updateCond){
            let questionPlaceHolders =   " ";
            for (let [key,value] of Object.entries(updateObj)) {
                questionPlaceHolders = questionPlaceHolders+key+'='+'?, ';
            }
            questionPlaceHolders =  questionPlaceHolders.replace(/,(\s+)?$/, '');

            let updateObjValues = Object.values(updateObj);

            let condQuestionPlaceHolders =   " ";  
            for (let [key,value] of Object.entries(updateCond)) {
                condQuestionPlaceHolders = condQuestionPlaceHolders+key+'='+'? AND ';
            }
            condQuestionPlaceHolders =  condQuestionPlaceHolders.replace(/AND(\s+)?$/, '');

            let updateCondValues = Object.values(updateCond);
           let  questionPlaceHoldersValues = updateObjValues.concat(updateCondValues)

            return new Promise(async(resolve,reject)=>{
                await this.connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

                await this.connection.beginTransaction();

                await this.connection.query(`UPDATE ${tableName} SET ${questionPlaceHolders} WHERE ${condQuestionPlaceHolders} `,questionPlaceHoldersValues,(error,result,fields)=>{
                if(error) reject(error)
                resolve(result)
                })

                await this.connection.commit();

            })
    }

    delete(tableName,deleteCondsObj){
        let condQuePlaceHolders =   " ";  
        for (let [key,value] of Object.entries(deleteCondsObj)) {
            condQuePlaceHolders = condQuePlaceHolders+key+'='+'? AND ';
        }
        condQuePlaceHolders =  condQuePlaceHolders.replace(/AND(\s+)?$/, '');
        deleteCondsObj = Object.values(deleteCondsObj);
        return new Promise(async(resolve,reject)=>{

            await this.connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

            await this.connection.beginTransaction();


            await this.connection.query(`DELETE FROM ${tableName} WHERE ${condQuePlaceHolders} `,deleteCondsObj,(error,result)=>{
                    if(error) reject(error)
                    resolve(result)
               })

               await this.connection.commit();
        })
    }
    
    close() {
        return new Promise( async( resolve, reject ) => {
            await this.connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

            await this.connection.beginTransaction();

            await this.connection.end( err => {
                if ( err ) reject( err )
                           resolve();
            } );
            await this.connection.commit();

        } );
    }
}

module.exports = {
  Database
}