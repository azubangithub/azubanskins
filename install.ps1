# Видалення старих залежностей
Write-Host "Видалення старих залежностей..."
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "client\node_modules") {
    Remove-Item -Recurse -Force "client\node_modules"
}

# Встановлення залежностей для сервера
Write-Host "Встановлення залежностей для сервера..."
npm install

# Встановлення залежностей для клієнта
Write-Host "Встановлення залежностей для клієнта..."
cd client
npm install
npm install -D tailwindcss@3.3.5 postcss@8.4.31 autoprefixer@10.4.16
npx tailwindcss init -p
cd ..

Write-Host "Встановлення завершено!" 