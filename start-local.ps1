$project = 'G:\Project\HansAiTechWeb'
Start-Process powershell -ArgumentList @(
  '-NoExit',
  '-Command',
  "Set-Location '$project'; node serve.mjs"
)
Write-Output 'Local server window started. Open http://localhost:5500'
