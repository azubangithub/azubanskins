# Збірка React додатку
Write-Host "Початок збірки React додатку..."
cd client
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Помилка при збірці React додатку!"
    exit 1
}
cd ..
Write-Host "Збірка завершена успішно!" 