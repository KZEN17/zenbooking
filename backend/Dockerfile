# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution file first (when building from repo root)
COPY backend/*.sln ./
COPY backend/global.json ./

# Copy project files
COPY backend/ApartmentManager.API/*.csproj ./ApartmentManager.API/
COPY backend/ApartmentManager.Core/*.csproj ./ApartmentManager.Core/
COPY backend/ApartmentManager.Infrastructure/*.csproj ./ApartmentManager.Infrastructure/
COPY backend/ApartmentManager.Shared/*.csproj ./ApartmentManager.Shared/

# Restore dependencies
RUN dotnet restore

# Copy all source code (from repo root)
COPY backend/. .

# Build the application
WORKDIR "/src/ApartmentManager.API"
RUN dotnet build "ApartmentManager.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "ApartmentManager.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published files
COPY --from=publish /app/publish .

# Expose port (Koyeb will set PORT environment variable)
ENV ASPNETCORE_URLS=http://+:8000
EXPOSE 8000

# Run the application and respect Koyeb's $PORT if provided
ENTRYPOINT ["sh", "-c", "dotnet ApartmentManager.API.dll --urls http://0.0.0.0:${PORT:-8000}"]
