
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
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'�û���' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdUser', @level2type=N'COLUMN',@level2name=N'UserName'
insert into AkdUser(UserID,UserName,Password,CreateUserName) 
values('admin','ϵͳ����Ա','c4ca4238a0b923820dcc509a6f75849b','ϵͳ����Ա')

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
values('ϵͳ����',0,'',0,'ϵͳ����Ա')

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'�˵���' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'MenuName'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'���˵���' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'ParentID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'URL' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'URL'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'����' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'OrderNum'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'����ʱ��' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'CreateTime'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'������' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdMenu', @level2type=N'COLUMN',@level2name=N'CreateUserName'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'�˵�', @level0type=N'SCHEMA', @level0name=N'dbo', @level1type=N'TABLE', @level1name=N'AkdMenu';

insert into AkdMenu(MenuName,ParentID,URL,OrderNum,CreateUserName) 
values('�˵�����',1,'menu-manager',20,'ϵͳ����Ա')
insert into AkdMenu(MenuName,ParentID,URL,OrderNum,CreateUserName) 
values('������',1,'table-manager',30,'������')


drop table AkdTable
create table AkdTable
(
	ID int identity(1,1) primary key not null,
	FieldName varchar(100) not null,
	FieldText nvarchar(100) not null,
	FieldType varchar(50) not null,   -- string��date��select,custom
	
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
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'[select��string��date��datetime,month,year,number,textarea]' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdTable', @level2type=N'COLUMN',@level2name=N'FieldType'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'������', @level0type=N'SCHEMA', @level0name=N'dbo', @level1type=N'TABLE', @level1name=N'AkdTable';
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
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'10���������İ�ť��20���������İ�ť��������ӡ�������' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdTableButton', @level2type=N'COLUMN',@level2name=N'ButtonType'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'��ť����' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdTableButton', @level2type=N'COLUMN',@level2name=N'ButtonText'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'��ť��ʾ��״̬��������ָ�[]��Ĭ�Ͽ�����' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdTableButton', @level2type=N'COLUMN',@level2name=N'ButtonVisibleStatus'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'��ť', @level0type=N'SCHEMA', @level0name=N'dbo', @level1type=N'TABLE', @level1name=N'AkdTableButton';
CREATE INDEX idx_akdtablebutton_tablename ON AkdTableButton (TableName);
go

insert into AkdTable(FieldName,FieldText,FieldType,IsInSearch,SearchValue,IsInTable,InTableWidth,IsInEdit,IsRequest,RequestPrompt,TableFormatFunction,SelectDataFunction,OrderNum,TableName,CreateUserName)
select 'ID','ID','string',0,'',0,0,0,0,'','','',10,'AkdTableButton','ϵͳ����Ա'
union all
select 'TableName','������','string',0,'',0,100,0,0,'','','',90,'AkdTableButton','ϵͳ����Ա'
union all
select 'ButtonType','λ��','select',0,'',1,100,1,1,'��ѡ��ťλ��','','[{text:"����ڰ�ť",id:10},{text:"����ⰴť",id:20}]',80,'AkdTableButton','ϵͳ����Ա'
union all
select 'ButtonText','����','string',0,'',1,100,1,1,'�����밴ť����','','',70,'AkdTableButton','ϵͳ����Ա'
union all
select 'ButtonVisibleStatus','�ɼ�״̬','string',0,'',1,100,1,1,'������ɼ�״̬','','',60,'AkdTableButton','ϵͳ����Ա'
union all
select 'ButtonFunction','�¼�','textarea',0,'',1,100,1,1,'�����밴ť�¼�','','',50,'AkdTableButton','ϵͳ����Ա'
union all
select 'OrderNum','����','string',0,'',1,100,0,0,'','','',40,'AkdTableButton','ϵͳ����Ա'
union all
select 'CreateUserName','������','string',0,'',1,100,0,0,'','','',30,'AkdTableButton','ϵͳ����Ա'
union all
select 'CreateTime','����ʱ��','datetime',0,'',1,100,0,0,'','','',20,'AkdTableButton','ϵͳ����Ա'





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
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'����', @level0type=N'SCHEMA', @level0name=N'dbo', @level1type=N'TABLE', @level1name=N'AkdConfig';

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
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'����' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AkdLogMain', @level2type=N'COLUMN',@level2name=N'TableName'

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
