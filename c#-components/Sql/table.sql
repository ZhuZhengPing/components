
--drop table AkdUser
create table AkdUser
(
	ID int identity(1,1) primary key not null,
	UserID varchar(20) not null,
	UserName nvarchar(50) not null,
	[Password] varchar(100) not null,
	CreateTime datetime not null default(getdate()),
	CreateUserName nvarchar(50) not null
)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'用户名' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdUser', @level2type=N'COLUMN',@level2name=N'UserName'
insert into AkdUser(UserID,UserName,Password,CreateUserName) 
values('admin','系统管理员','c4ca4238a0b923820dcc509a6f75849b','系统管理员')

--drop table AkdMenu
create table AkdMenu
(
	ID int identity(1,1) primary key not null,
	MenuName nvarchar(250) not null,
	ParentID int not null,
	URL nvarchar(500) not null,
	OrderNum int not null,
	CreateTime datetime not null default(getdate()),
	CreateUserName nvarchar(50) not null
)
insert into AkdMenu(MenuName,ParentID,URL,OrderNum,CreateUserName) 
values('系统设置',0,'',0,'系统管理员')

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'菜单名' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'MenuName'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'父菜单名' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'ParentID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'URL' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'URL'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'排序' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'OrderNum'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'创建时间' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'CreateTime'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'创建人' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'CreateUserName'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'菜单', @level0type=N'SCHEMA', @level0name=N'dbo', @level1type=N'TABLE', @level1name=N'AkdMenu';

insert into AkdMenu(MenuName,ParentID,URL,OrderNum,CreateUserName) 
values('菜单管理',1,'menu-manager',20,'系统管理员')
insert into AkdMenu(MenuName,ParentID,URL,OrderNum,CreateUserName) 
values('表单管理',1,'table-manager',30,'表单管理')


drop table AkdTable
create table AkdTable
(
	ID int identity(1,1) primary key not null,
	FieldName varchar(100) not null,
	FieldText nvarchar(100) not null,
	FieldType varchar(50) not null,   -- string，date，select,custom
	
	IsInSearch int not null,
	SearchValue nvarchar(100),

	IsInTable bit not null,
	InTableWidth int not null,
	
	IsInEdit bit not null,

	IsRequest bit not null,
	RequestPrompt nvarchar(100),

	TableFormatFunction nvarchar(2500),
	SelectDataFunction nvarchar(2500),
	
	OrderNum int not null,
	TableName varchar(50) not null,
	CreateTime datetime not null default(getdate()),
	CreateUserName nvarchar(50) not null
)
CREATE INDEX idx_akdtable_tablename ON AkdTable (TableName);
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'[select，string，date，datetime,month,year,number,textarea]' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdTable', @level2type=N'COLUMN',@level2name=N'FieldType'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'表配置', @level0type=N'SCHEMA', @level0name=N'dbo', @level1type=N'TABLE', @level1name=N'AkdTable';
go



--drop table AkdTableButton
create table  AkdTableButton
(
	ID int identity(1,1) primary key not null,
	TableName varchar(50) not null,
	ButtonType int not null,
	ButtonText nvarchar(100) not null, 
	ButtonVisibleStatus varchar(100) not null,
	ButtonFunction nvarchar(1000) not null,
	OrderNum int not null,
	CreateTime datetime not null default(getdate()),
	CreateUserName nvarchar(50) not null
)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'10：表格里面的按钮，20：表格外面的按钮，例如添加、导出等' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdTableButton', @level2type=N'COLUMN',@level2name=N'ButtonType'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'按钮名称' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdTableButton', @level2type=N'COLUMN',@level2name=N'ButtonText'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'按钮显示的状态，用数组分割[]，默认空数组' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdTableButton', @level2type=N'COLUMN',@level2name=N'ButtonVisibleStatus'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'按钮', @level0type=N'SCHEMA', @level0name=N'dbo', @level1type=N'TABLE', @level1name=N'AkdTableButton';
CREATE INDEX idx_akdtablebutton_tablename ON AkdTableButton (TableName);
go

insert into AkdTable(FieldName,FieldText,FieldType,IsInSearch,SearchValue,IsInTable,InTableWidth,IsInEdit,IsRequest,RequestPrompt,TableFormatFunction,SelectDataFunction,OrderNum,TableName,CreateUserName)
select 'ID','ID','string',0,'',0,0,0,0,'','','',10,'AkdTableButton','系统管理员'
union all
select 'TableName','所属表','string',0,'',0,100,0,0,'','','',90,'AkdTableButton','系统管理员'
union all
select 'ButtonType','位置','select',0,'',1,100,1,1,'请选择按钮位置','','[{text:"表格内按钮",id:10},{text:"表格外按钮",id:20}]',80,'AkdTableButton','系统管理员'
union all
select 'ButtonText','名称','string',0,'',1,100,1,1,'请输入按钮名称','','',70,'AkdTableButton','系统管理员'
union all
select 'ButtonVisibleStatus','可见状态','string',0,'',1,100,1,1,'请输入可见状态','','',60,'AkdTableButton','系统管理员'
union all
select 'ButtonFunction','事件','textarea',0,'',1,100,1,1,'请输入按钮事件','','',50,'AkdTableButton','系统管理员'
union all
select 'OrderNum','排序','string',0,'',1,100,0,0,'','','',40,'AkdTableButton','系统管理员'
union all
select 'CreateUserName','创建人','string',0,'',1,100,0,0,'','','',30,'AkdTableButton','系统管理员'
union all
select 'CreateTime','创建时间','datetime',0,'',1,100,0,0,'','','',20,'AkdTableButton','系统管理员'





--drop table AkdConfig
create table AkdConfig
(
	ID int identity(1,1) primary key not null,
	ParentID int not null,
	CodeName nvarchar(100) not null,
	CodeValue varchar(20) not null,
	OrderNum int not null,
	CreateTime datetime not null default(getdate()),
	CreateUserName nvarchar(50) not null
)	
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'配置', @level0type=N'SCHEMA', @level0name=N'dbo', @level1type=N'TABLE', @level1name=N'AkdConfig';

-- drop table AkdLogMain
create table AkdLogMain
(
	ID int primary key identity(1,1) not null,
	TableName varchar(50) not null,
	LogType int not null,
	Remark nvarchar(100) not null,
	CreateTime datetime not null default(getdate()),
	CreateUserName nvarchar(50) not null
)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'表名' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdLogMain', @level2type=N'COLUMN',@level2name=N'TableName'

--drop table AkdLogDetail
create table AkdLogDetail
(
	ID int primary key identity(1,1) not null,
	AkdLogMainID int not null,
	FiledName varchar(100) not null,
	FileText nvarchar(250),
	OldValue nvarchar(500),
	NewValue nvarchar(500)
)

--drop table AkdLogRollBack
create table AkdLogRollBack
(
	ID int primary key identity(1,1) not null,
	AkdLogMainID int not null,
	RollBackSql nvarchar(max) not null,
	IsRollBack bit not null default(0)
)
GO

create view V_AkdMenu
AS
	SELECT * FROM AkdMenu WITH(NOLOCK)
GO

create view V_AkdTableButton
as
	select * from AkdTableButton with(nolock)
go
