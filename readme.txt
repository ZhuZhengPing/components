1. Status状态字段格式  [10:'暂存',20:'审核中',100:'已完成']
2. TableFormatFunction 有4个参数，和elementplus的表格format函数的参数一样，如果内容为数组，必须是 [text:'a',value:1]这种格式
    row:实体对象
    column:绑定到表格的字段，可以用column.property获得字段名
    cellValue:当前行对应的值
    index:下标
3. SelectDataFunction 有2个参数，如果内容为数组，必须是 [text:'a',value:1]这种格式
    field:当前搜索列的实体
    value:当前搜索的默认值
4. 必须要建表备注，用来记录日志
5. 不能建updateuserid等字段，直接删除数据
6. tableButtonEvent 有3个参数，_data:当前记录的实体对象 _fields:当前表的字段类型，entity:表名
    
    