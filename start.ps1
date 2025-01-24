Start-Process -NoNewWindow -FilePath "py" -ArgumentList "main.py"

cd frontend
npm i
npm run dev
