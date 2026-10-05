# DP MODULE Sales — GitHub Pages

Это статическая версия для запуска через GitHub Pages. Backend/Express/SQLite здесь НЕ нужны.

## Локальный запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## GitHub Pages

1. Создайте репозиторий на GitHub.
2. Загрузите содержимое этого архива в корень репозитория.
3. В Settings → Pages выберите GitHub Actions.
4. Workflow из `.github/workflows/deploy.yml` соберёт и опубликует сайт.

Данные КП и клиентов в этой версии сохраняются в LocalStorage браузера. Это подходит для прототипа/личного использования, но НЕ является общей CRM-базой для нескольких менеджеров. Для этого следующим этапом нужен backend (Supabase/Firebase/свой сервер).

Фотографии лежат локально в `public/assets`, поэтому сайт не зависит от dp-m.ru при отображении каталога.
