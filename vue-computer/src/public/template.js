import { SelectList } from "../http";

export async function TableFormatFunction (row,column,cellValue){
    await SelectDataFunction(row,column,cellValue);
    if(window[column+'ColumnArray'] && window[column+'ColumnArray']){
        let tempRow = window[column+'ColumnArray'].find(p=>p.ID==cellValue);
        if(tempRow){
            for(let j in tempRow){
                if(j.indexOf("Name")>=0){
                    return tempRow.Name; 
                }
            }
        }
    }
    return "";
}

export async function SelectDataFunction(field,entity,value){
    if(typeof(window[field.FiledName+'ColumnArray'])=="undefined"){
        window[field.FiledName+'ColumnArray']=[];
        let tempArray=await SelectList({
            TableName:entity
        });
        if(tempArray && tempArray.length){
            for(let i=0; i<tempArray.length; i++){
                let tempObject = {};
                tempObject.id=tempArray[i].ID;

                // 这里只取最前面的一个名字
                for(let j in tempArray[i]){
                    if(j.indexOf("Name")>=0){
                        tempObject[j] = tempArray[i][j];
                        window[field.FiledName+'ColumnArray'].push(tempObject);
                        break;
                    }
                }
            }
            return window[field.FiledName+'ColumnArray'];
        }
    }
}
