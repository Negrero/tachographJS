
/**
 * Created by Andres Carmona Gil on 26/08/2015.
 */
'use strict';
var fs=require('fs')
var FileTGD=require('../index')

fs.readFile('C:\\Users\\negrero\\workspace\\tachograph-structure\\a.TGD',
//fs.readFile('path/file.tgd',
    function (err, data) {
        if (err) {
            return console.log(err);
        }
        var f=new FileTGD(data);
        console.log(f)
        /*
         fileTGD(data,function(err,result){
         if (err){
         console.log(err)
         }else{
         console.log(result)
         }
         });
         */
        /*
        var fileTGD=new FileTGD()
        fileTGD.lib('./lib-java')
        fileTGD.parse(data,null,null,function(err,data){
            if(err){
                console.log(err)
            }else{
                console.log(data)
            }


        })
*/
    });