
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
	FiledName varchar(100) not null,
	FiledText nvarchar(100) not null,
	FiledType varchar(50) not null,   -- string，date，select,custom
	
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
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'[select，string，date，datetime,month,year,number,textarea]' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdTable', @level2type=N'COLUMN',@level2name=N'FiledType'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'表配置', @level0type=N'SCHEMA', @level0name=N'dbo', @level1type=N'TABLE', @level1name=N'AkdTable';
go

--drop table AkdTableButton
create table  AkdTableButton
(
	ID int identity(1,1) primary key not null,
	TableName varchar(50) not null,
	ButtonType int not null,
	ButtonText nvarchar(100) not null, 
	ButtonVisibleStatus varchar(20) not null,
	ButtonFunction nvarchar(1000) not null,
	OrderNum int not null,
	CreateTime datetime not null default(getdate()),
	CreateUserName nvarchar(50) not null
)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'10：表格里面的按钮，20：表格外面的按钮，例如添加、导出等' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdTableButton', @level2type=N'COLUMN',@level2name=N'ButtonType'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'按钮显示的状态，用数组分割[]，默认空数组' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdTableButton', @level2type=N'COLUMN',@level2name=N'ButtonVisibleStatus'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'按钮', @level0type=N'SCHEMA', @level0name=N'dbo', @level1type=N'TABLE', @level1name=N'AkdTableButton';
CREATE INDEX idx_akdtablebutton_tablename ON AkdTableButton (TableName);
go

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


create table AkdLogMain
(
	ID int primary key identity(1,1) not null,
	TableName varchar(50) not null,
	LogType int not null,
	Remark nvarchar(100) not null,
	CreateTime datetime not null default(getdate()),
	CreateUserID int not null,
	CreateUserName nvarchar(50) not null
)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'表名' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdLogMain', @level2type=N'COLUMN',@level2name=N'TableName'

create table AkdLogDetail
(
	ID int primary key identity(1,1) not null,
	AkdLogMainID int not null,
	FiledName varchar(100) not null,
	FileText nvarchar(250),
	OldValue nvarchar(500),
	NewValue nvarchar(500)
)
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