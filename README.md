# DP MODULE Sales — авторизация и облачные КП

Эта версия добавляет доступ по аккаунту и общую облачную базу, чтобы менеджер мог открыть свои КП с другого компьютера после входа в тот же аккаунт.

## Как работает доступ

- Без авторизации каталог и CRM не открываются.
- Менеджер регистрируется по e-mail и паролю.
- Supabase Auth сохраняет сессию в браузере.
- КП и клиенты записываются в PostgreSQL Supabase.
- Каждая запись получает `user_id`.
- Row Level Security (RLS) разрешает менеджеру читать и изменять только свои записи.
- Другой менеджер, даже зная URL проекта, не получает чужие КП при нормальной конфигурации RLS.

## Важно про ключ

Для GitHub Pages в браузер можно передавать только **Supabase Publishable Key**. Secret / service_role key в сайт вставлять нельзя. Publishable key считается публичным и должен быть защищён RLS.

## Настройка Supabase — один раз

### 1. Создайте проект Supabase

В Dashboard создайте проект.

### 2. Создайте таблицы и RLS

Откройте **SQL Editor**, вставьте полностью файл:

`supabase-setup.sql`

Нажмите Run.

Скрипт создаёт:
- `public.quotes`
- `public.clients`
- RLS-политики для каждого пользователя
- необходимые grants для `authenticated`

### 3. Возьмите Project URL и Publishable Key

Supabase Dashboard → **Connect** или **Settings → API Keys**.

Нужны:
- Project URL
- Publishable Key (`sb_publishable_...`)

Не используйте Secret / service_role key.

### 4. Заполните конфиг

Откройте:

`public/supabase-config.js`

и вставьте:

```js
window.DP_SUPABASE_CONFIG = {
  url: 'https://ВАШ-ПРОЕКТ.supabase.co',
  publishableKey: 'sb_publishable_...'
};
```

Этот файл находится в `public`, поэтому GitHub Pages сможет прочитать настройки при загрузке сайта.

### 5. URL сайта

В Supabase Dashboard в **Authentication → URL Configuration** укажите URL GitHub Pages вашего репозитория как Site URL / Redirect URL.

Например:

`https://USERNAME.github.io/REPOSITORY/`

### 6. Регистрация

После первого деплоя откройте сайт → **Регистрация менеджера**.

Если в Supabase включено подтверждение e-mail, после регистрации подтвердите почту по ссылке и затем войдите.

Для закрытого внутреннего отдела можно позже отключить публичную регистрацию и перейти на приглашения менеджеров.

## GitHub Pages

В проекте есть единственный workflow:

`.github/workflows/deploy.yml`

Он собирает Vite-проект и публикует `dist`.

## Что теперь хранится в облаке

КП:
- номер КП;
- менеджер через `user_id`;
- клиент;
- проект;
- базовая цена;
- опции;
- ручные позиции;
- доставка;
- фундамент;
- монтаж;
- итог;
- заметки;
- дата.

Клиенты:
- ФИО;
- телефон;
- email;
- город;
- адрес;
- менеджер через `user_id`.

## Ограничение этой версии

Общий каталог и цены пока остаются статическими данными проекта. Облако используется для авторизации, КП и клиентов. Следующим этапом можно вынести в Supabase также цены, опции, версии прайса и права администратора.


## Supabase connection

The included `public/supabase-config.js` is already configured for the DP MODULE Supabase project. It contains the Project URL and Publishable Key supplied for this deployment. Do not replace them with a Secret / service_role key.

Run `supabase-setup.sql` once in Supabase SQL Editor before first use.
