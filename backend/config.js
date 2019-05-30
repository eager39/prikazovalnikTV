

module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'dev':
            return {DBuser:"root",DBpass:"",database:"displaytv",maxtv:12};

        case 'prod':
            return {DBuser:"nodejsShared",DBpass:"PdUp3Fj0PA4jaN",database:"nodejsAcademiaPrikazovalnik",maxtv:12};

        default:
            return  {DBuser:"root",DBpass:"",database:"displaytv",maxtv:12};
    }
};