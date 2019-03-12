


module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'dev':
            return {DBuser:"root",DBpass:"",database:"video_image"};

        case 'prod':
            return {DBuser:"nodejsShared",DBpass:"PdUp3Fj0PA4jaN",database:"nodejsAcademiaPrikazovalnik"};

        default:
            return  {DBuser:"root",DBpass:"",database:"video_image"};
    }
};