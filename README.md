# Hansaitech 狠賽科技 — 官方網站

純靜態網站（HTML + CSS + JS），無框架、低維護成本、易部署。

---

## 專案結構

```
HansAiTechWeb/
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI：HTML lint、CSS lint、link check
│       └── deploy.yml      # CD：push main 自動部署 GitHub Pages
├── assets/
│   ├── icons/
│   │   └── hansaitech_icon.png   # 品牌 icon（favicon + header logo）
│   └── images/             # 未來圖片資源放這裡
├── css/
│   └── styles.css          # 全站設計系統（深色主題 + CSS 變數）
├── js/
│   └── script.js           # 共用互動行為
├── index.html              # 首頁        /
├── about.html              # 關於我們    /about
├── services.html           # 服務項目    /services
├── portfolio.html          # 成品展示    /portfolio
├── contact.html            # 聯絡我們    /contact
├── serve.mjs               # 本地開發伺服器（Node.js，port 5500）
├── start-local.ps1         # PowerShell 一鍵啟動腳本
├── package.json            # npm scripts + lint 工具
├── .htmlhintrc             # HTMLHint 規則
├── .stylelintrc.json       # Stylelint 規則
└── .gitignore
```

---

## 本地開發

### 啟動伺服器

```powershell
# 方式 A：PowerShell 一鍵啟動
.\start-local.ps1

# 方式 B：手動
node serve.mjs
```

開啟瀏覽器：[http://localhost:5500](http://localhost:5500)

### 頁面路由

| URL | 對應檔案 |
|-----|---------|
| `/` | `index.html` |
| `/about` | `about.html` |
| `/services` | `services.html` |
| `/portfolio` | `portfolio.html` |
| `/contact` | `contact.html` |

---

## Git Flow 開發流程

```
main          ← 穩定版本，只接受 release/* 合併
 └── develop  ← 整合分支，feature/* 合併到這裡
      └── feature/xxx  ← 每個功能一個分支
```

### 開始新功能

```bash
git checkout develop
git checkout -b feature/your-feature-name

# 開發 + 測試...

git add <files>
git commit -m "feat(scope): describe what this commit does"

# 測試通過後合併回 develop
git checkout develop
git merge --no-ff feature/your-feature-name
```

### 發佈新版本

```bash
git checkout -b release/x.x.x develop

# 最後確認、版本號更新...
git commit -m "chore(release): prepare release vx.x.x"

# 合併到 main 並 tag
git checkout main
git merge --no-ff release/x.x.x
git tag -a vx.x.x -m "vx.x.x — release description"

# 合併回 develop
git checkout develop
git merge --no-ff release/x.x.x
```

### Hotfix（緊急修復）

```bash
git checkout -b hotfix/issue-description main
# 修復...
git commit -m "fix(scope): describe the fix"

git checkout main
git merge --no-ff hotfix/issue-description
git tag -a vx.x.x -m "hotfix"

git checkout develop
git merge --no-ff hotfix/issue-description
```

### Commit Message 規範

```
<type>(<scope>): <description>

type:
  feat     新功能
  fix      錯誤修復
  chore    維護性工作（CI、設定、版本）
  style    CSS / 排版調整
  refactor 重構（不影響功能）
  docs     文件更新
  test     測試相關

scope: page / styles / js / cicd / structure / 等
```

**範例：**
```
feat(page): add About page with team and tech stack sections
fix(styles): correct mobile nav overlap on small screens
chore(release): prepare release v1.1.0
```

---

## CI/CD（GitHub Actions）

### CI — `ci.yml`

每次 push 或 PR 自動執行：

| Job | 工具 | 說明 |
|-----|------|------|
| lint-html | htmlhint | 驗證所有 `*.html` 結構 |
| lint-css | stylelint | 驗證 `css/**/*.css` 規則 |
| check-links | linkinator | 啟動本地伺服器並驗證內部連結 |

### CD — `deploy.yml`

push 到 `main` 自動部署到 **GitHub Pages**。

#### 本地手動執行 lint

```bash
npm install
npm run lint          # 執行 HTML + CSS lint
npm run lint:html     # 僅 HTML
npm run lint:css      # 僅 CSS
```

---

## 部署

### GitHub Pages（CI/CD 自動）

1. 將此 repo push 到 GitHub
2. Settings → Pages → Source 選 `GitHub Actions`
3. push 到 `main` 即自動部署

### Cloudflare Pages（建議正式環境）

**方式 A — 連接 Git 倉庫**
1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
2. 選擇此 repo
3. Build 設定：
   - Framework preset: `None`
   - Build command: 留空
   - Output directory: `/`
4. Deploy

**方式 B — 直接上傳**
1. Workers & Pages → Upload assets
2. 上傳整個專案資料夾

### 綁定正式網域 `hansaitech.com`

1. Cloudflare Pages 專案 → Custom domains → Set up a custom domain
2. 輸入 `hansaitech.com`，再新增 `www.hansaitech.com`
3. 確認 DNS（Cloudflare 會自動建立 CNAME）

---

## 上線前檢查清單

- [ ] `https://hansaitech.com` 可正常開啟
- [ ] `https://www.hansaitech.com` 導向主站
- [ ] 所有 5 個頁面路由正常（/about、/services、/portfolio、/contact）
- [ ] 手機版選單可展開/收合
- [ ] Brand icon 在 header、footer、favicon 都正常顯示
- [ ] 首頁數字動畫觸發
- [ ] Portfolio 篩選 tabs 可用
- [ ] FAQ accordion 可展開
- [ ] 聯絡表單驗證與成功訊息正常
- [ ] CI 全部 jobs 通過（GitHub Actions 綠燈）

---

## 版本紀錄

| 版本 | 日期 | 內容 |
|------|------|------|
| v1.0.0 | 2026-03-11 | 初版上線：5 頁多路由網站、深色設計系統、CI/CD Pipeline |
