# Hansaitech 官網快速啟動指南

這份專案是純靜態網站（HTML + CSS + JS），優點是：
- 本地測試最簡單
- 上 Cloudflare Pages 最快
- 維護成本低

## 1) 先放你的商標圖

請把你的 Logo 圖檔放到：

`G:\Project\HansAiTechWeb\assets\hansaitech-logo.png`

建議尺寸：寬 600px 以上、透明背景 PNG。

## 2) 本地測試（先確認畫面）

### 推薦：一鍵啟動

```powershell
cd G:\Project\HansAiTechWeb
.\start-local.ps1
```

執行後會開一個新的 PowerShell 視窗跑伺服器，打開：

[http://localhost:5500](http://localhost:5500)

### 手動啟動

```powershell
cd G:\Project\HansAiTechWeb
node serve.mjs
```

注意：這個視窗要保持開著，關掉就會停止服務。

## 3) 上 Cloudflare Pages（最輕鬆）

### 方式 A：直接上傳（最快）
1. 到 Cloudflare Dashboard -> `Workers & Pages` -> `Create` -> `Pages` -> `Upload assets`。
2. 上傳整個 `G:\Project\HansAiTechWeb` 內的網站檔案（`index.html`, `styles.css`, `script.js`, `assets/`）。
3. 發布後會得到一個 `*.pages.dev` 網址。

### 方式 B：連 Git 倉庫（建議長期使用）
1. 把這個專案 push 到 GitHub。
2. Cloudflare Pages 選 `Connect to Git`。
3. Build 設定：
   - Framework preset: `None`
   - Build command: 留空
   - Build output directory: `/`
4. Deploy。

## 4) 綁定你的正式網域 hansaitech.com

你已在 Cloudflare 管理網域時，通常可直接在 Pages 專案內：
1. `Custom domains` -> `Set up a custom domain`
2. 輸入 `hansaitech.com`
3. 再新增 `www.hansaitech.com`
4. 依提示確認 DNS（Cloudflare 通常會自動幫你建立 CNAME）。

## 5) 上線後檢查清單

- `https://hansaitech.com` 可開啟
- `https://www.hansaitech.com` 會導向主站
- 手機版選單可正常展開
- Logo 顯示正常
- 聯絡 email 連結可點

## 專案檔案說明

- `index.html`: 主頁內容
- `styles.css`: 視覺與 RWD
- `script.js`: 手機選單、年份
- `serve.mjs`: 本地測試伺服器（Node 免安裝套件）
- `start-local.ps1`: 一鍵在新視窗啟動本地伺服器
- `assets/hansaitech-logo.png`: 品牌 Logo

---
如果你要，我下一步可以直接幫你做「第二頁：服務詳情頁 + 聯絡表單（可串 Cloudflare Forms/Email）」讓這個官網變成可收詢問單版本。
