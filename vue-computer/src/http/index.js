import http from "@/http/http.js"

export function DoLogin(data){
    return http.post('/api/User/DoLogin',data);
}

export function RefreshToken(){
    return http.post('/api/User/RefreshToken',{
        Name:GetToken()
    })
}

export function GetToken(){
    return GetUserInfo("token");
}

export function GetUserID(){
    return GetUserInfo("userId");
}

export function GetUserName(){
    return GetUserInfo("userName");
}

export function GetUserInfo(t){
    let tempUser = sessionStorage.getItem('token');
    if(!tempUser){
        return "";
    }
    tempUser = JSON.parse(tempUser);
    if(t){
        return tempUser[t];
    }
    return tempUser;
}

export function SetToken(token){
    sessionStorage.setItem('token',token);
}

export function GetTableList(){
    return http.post('/api/Table/GetTableList');
}

export function GetTableDetailBySql(data){
    return http.post('/api/Table/GetTableDetailBySql',data);
}

export async function SelectFormatFields(data){
    let result = await SelectList(data);
    if(result && result.length>0){
        for (let p of result){
            if(p.TableFormatFunction && typeof(p.TableFormatFunction) == "string"){
                p.TableFormatFunction=eval('('+p.TableFormatFunction+')');
            }
            if(p.SelectDataFunction && typeof(p.SelectDataFunction) == "string"){
                p.SelectDataFunction=eval('('+p.SelectDataFunction+')');
            }
            if(p.ButtonFunction && typeof(p.ButtonFunction) == "string"){
                p.ButtonFunction=eval('('+p.ButtonFunction+')');
            }
            if(p.ButtonVisibleStatus && typeof(p.ButtonVisibleStatus) == "string"){
                p.ButtonVisibleStatus=eval('('+p.ButtonVisibleStatus+')');
            }
        }
    }
    return result;
}

export function GetTableRemark(data){
    return http.post('/api/Table/GetTableRemark',data);
}

export function Add(data,entity){
    data.CreateUserName = GetUserName();
    let tempData = {
        Values:data,
        TableName:entity
    };
    return http.post('/api/Add/Add',tempData);
}

export function AddList(data,entity){
    let tempData=[];
    for(var i=0;i<data.length;i++){
        data[i].CreateUserName=GetUserName();
        tempData.push({
            Values:data[i],
            TableName:entity
        })
    }
    return http.post('/api/Add/AddList',tempData);
}

export function Update(data,entity){
    data.CreateUserName = GetUserName();
    data = {
        ID:data.ID,
        TableName:entity,
        Values:data
    };
    return http.post('/api/Update/Update',data);
}

export function UpdateList(data){
    for(var i=0;i<data.length;i++){
        data[i].createUserName=GetUserName();
        data[i]={
            ID:data[i].ID,
            TableName:data[i].TableName,
            Values:data[i]
        };
    }
    return http.post('/api/Update/UpdateList',data);
}

export function DoDelete(data){
    data.UserName = GetUserName();
    return http.post('/api/Delete/Delete',data);
}
export function DeleteList(data){
    return http.post('/api/Delete/DeleteList',data);
}

export function Select (data){
    return http.post('/api/Select/Select',data);
}

export function SelectList(data){
    return http.post('/api/Select/SelectList',data);
}

export function SelectListPages(data){
    return http.post('/api/Select/SelectListPages',data);
}

export function SelectConfigByID(codeno){
    return http.post('/api/Config/SelectConfigByID',{
        Name:codeno
    });
}