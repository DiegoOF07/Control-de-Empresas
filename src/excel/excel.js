const excel= require('excel4node')

function crearExcel(empleados, empresa){
    var doc=new excel.Workbook();
    var hoja= doc.addWorksheet("Empleados");
    var estiloParrafo=doc.createStyle({
        font:{
            color: '#000000',
            size: 12,
            align: 'center'
        }
    })

    var estiloTitulo=doc.createStyle({
        font:{
            color: '#000000',
            size: 15,
            align: 'center'
        }
    })

    hoja.cell(1,1).string("Nombre").style(estiloTitulo);
    hoja.cell(1, 2).string("Puesto").style(estiloTitulo);
    hoja.cell(1, 3).string("Departamento").style(estiloTitulo);

    for(var i=0; i<=empleados.length-1; i++) {
        hoja.cell(i+2,1).string(empleados[i].nombre).style(estiloParrafo);
        hoja.cell(i+2,2).string(empleados[i].puesto).style(estiloParrafo);
        hoja.cell(i+2,3).string(empleados[i].departamento).style(estiloParrafo);
    }

    hoja.column(1).setWidth(25);
    hoja.column(2).setWidth(20);
    hoja.column(3).setWidth(20);

    doc.write(__dirname+'/'+empresa+'.xlsx');

}

module.exports ={
    crearExcel
}