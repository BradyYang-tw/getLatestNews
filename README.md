# getLatestNews

輸入關鍵字，搜尋近 1、3、7 或 30 天內的新聞。這個目錄現在是純前端，新聞 API 位於獨立的 `brady_apigateway` 專案。

## 啟動

需要 Node.js 18 或更新版本：

```bash
cd getLatestNews
npm start
```

接著開啟 <http://localhost:3000>。前端預設透過正式 Gateway `https://apigateway.bradydaddy.com` 查詢新聞。

開發時可使用自動重啟模式：

```bash
npm run dev
```

## API 設定

後端網址設定在 `public/config.js`，目前為 `https://apigateway.bradydaddy.com`，新聞 API 完整網址是 `https://apigateway.bradydaddy.com/api/news`。

新聞內容與連結由後端透過 Google News RSS 聚合，版權歸原始發布者所有。
