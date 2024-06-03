using c__components.Controllers;
using c__components.Filter;
using c__components.Helper;
using c__components.Repository;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options => {
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
});
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<DapperHelper>();
builder.Services.AddScoped<MD5Helper>();
builder.Services.AddScoped<TokenHelper>();
builder.Services.AddScoped<TokenAttribute>();
builder.Services.AddScoped<ConfigRepository>();
builder.Services.AddScoped<LogRepository>();
builder.Services.AddScoped<SelectRepository>();
builder.Services.AddScoped<TableRepository>();
builder.Services.AddScoped<AddRepository>();
builder.Services.AddScoped<UpdateRepository>();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    });
}

app.UseAuthorization();
app.MapControllers();
app.Run();
