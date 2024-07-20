## Задачи

### Основные
- [X] ! Веб-сайт прогноз погоды
- [X] ! Удобный вывод прогноза погоды
- [X] ! Подключение стороннего API прогноза погоды

### Дополнительные

- [X] Тесты
- [X] Докер контейнер
- [X] Автодополнение при вводе города
- [X] Сохранение ранее просмотренного города
- [ ] Сохранение истории поиска пользователя
- [ ] API подсчета просмотренных городов

## Технологии

Веб-фреймворк: [FastAPI](https://github.com/tiangolo/fastapi)

## Использование

```bash
git clone https://github.com/cardisnotvalid/web-weather

cd web-weather

python3 -m pip install -r requirements.txt

uvicorn src.main:app --reload
```
