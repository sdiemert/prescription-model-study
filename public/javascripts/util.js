/**
 * Created by sdiemert on 2016-03-14.
 */

function getData(){

    $.get("/study/data", function(data, status){

        console.log(data);

        showViz(null,data);

    });

}
