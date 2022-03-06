const pdf=require('pdfkit');
const fs = require('fs');

function crearPDF(empleados, empresa){
    var document = new pdf();
    document.pipe(fs.createWriteStream(__dirname+'/'+empresa+'.pdf'));
    document.font('Helvetica', 20).text("Listado de los Empleados que pertenecen a la empresa "+empresa,{
        align: 'center'
    })
    document.moveDown(1)

    document.font('Helvetica-Bold', 12).text("Informacion de los empleados",{
        align: 'center'
    })

    document.moveDown(1)

    for (var i=0; i<=empleados.length-1; i++){
        document.font('Helvetica', 12).text(i+1+"  |  "+empleados[i].nombre+"  |  "+empleados[i].puesto+"  |  "+empleados[i].departamento,{
            align: 'left',

        })
        document.moveDown(1)
    }
    
    document.end();
}

module.exports = {
    crearPDF
}