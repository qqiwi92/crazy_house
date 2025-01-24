Start-Process -NoNewWindow -FilePath "py" -ArgumentList "api.py"

cd frontend
npm i
npm run dev
cd ..