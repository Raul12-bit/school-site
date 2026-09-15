import bcrypt from 'bcryptjs'
import { db, one, run, slug, save } from './db.mjs'

export function seed() {
  if (one('SELECT id FROM school_information WHERE id=1')) return

  db.run(`INSERT INTO school_information(id,title_kk,title_ru,title_en,description_kk,description_ru,description_en,history_kk,history_ru,history_en,address,phone,email,working_hours,social_links) VALUES(1,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
    '№2 ОРТА МЕКТЕП', 'СРЕДНЯЯ ШКОЛА №2', 'SECONDARY SCHOOL №2',
    'ALATAU QALASY №2 орта мектебі — оқушының әлеуетін ашатын, қауіпсіз әрі қолдаушы білім беру ортасы.',
    'Средняя школа №2 ALATAU QALASY — безопасная и поддерживающая образовательная среда.',
    'ALATAU QALASY Secondary School No. 2 is a safe and supportive learning environment.',
    'Біздің мектеп білім мен тәрбиені үйлестіре отырып, әр баланың болашағына сеніммен қарайды.',
    'Наша школа объединяет качественное образование, воспитание и уважение к личности ребёнка.',
    'Our school combines quality education, care and respect for every child.',
    'Alatau Qalasy, №2 орта мектеп', '+7 (000) 000-00-00', 'info@alatauschool2.kz',
    'Дүйсенбі-Жұма: 08:00-18:00, Сенбі: 08:00-14:00',
    '{"instagram":"https://instagram.com/alatauschool2","facebook":"https://facebook.com/alatauschool2"}'
  ])

  const pwd = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'ChangeMe!2026', 12)
  db.run('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)', ['Local administrator', process.env.ADMIN_EMAIL || 'admin@alatauschool2.kz', pwd, 'ADMIN'])

  const newsRows = [
    ['Жаңа оқу жылы: жаңа мүмкіндіктер', 'Новый учебный год: новые возможности', 'A new school year: new opportunities', 'Оқу жылы оқушылар үшін жаңа бастамалармен басталды.', 'Учебный год начался с новых инициатив для учеников.', 'The year began with new initiatives for learners.', 'Мектеп ұжымы білімге құштар, белсенді әрі мейірімді орта қалыптастыруды жалғастырады.', 'Школьное сообщество продолжает создавать активную и доброжелательную среду.', 'Our community continues building an active, caring learning environment.', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85'],
    ['Білім күні мерекесі өтті', 'Прошёл праздник Дня знаний', 'Knowledge Day celebration', 'Бірінші қоңырау салтанаты мектебіміздің ауласында өтті.', 'Торжественная линейка прошла во дворе нашей школы.', 'The opening celebration was held in the school courtyard.', 'Оқушылар, ата-аналар мен ұстаздар жаңа оқу жылын жылы жүздесумен бастады.', 'Ученики, родители и учителя тепло встретили новый учебный год.', 'Students, parents and teachers warmly welcomed the new school year.', 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=85'],
    ['Спорттық жарыстар жеңімпаздары', 'Победители спортивных соревнований', 'Sports competition winners', 'Мектебіміздің спортшылары қалалық жарыста топ жарды.', 'Наши спортсмены заняли первые места на городских соревнованиях.', 'Our athletes won first places at city competitions.', 'Футбол мен волейболдан өткен жарыстарда оқушыларымыз үздік нәтиже көрсетті.', 'На соревнованиях по футболу и волейболу ученики показали лучшие результаты.', 'In football and volleyball competitions, our students showed the best results.', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85'],
    ['Ғылыми жобалар байқауы', 'Конкурс научных проектов', 'Science projects competition', 'Жыл сайынғы ғылыми жобалар көрмесі өз мәресіне жетті.', 'Ежегодная выставка научных проектов завершилась.', 'The annual science projects exhibition has concluded.', 'Жас ғалымдар өздерінің инновациялық идеяларын ұсынып, жүлделі орындарға ие болды.', 'Молодые ученые представили свои инновационные идеи и заняли призовые места.', 'Young scientists presented their innovative ideas and won prizes.', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=85'],
    ['Өнер фестивалі', 'Фестиваль искусств', 'Arts festival', 'Мектебімізде өнер фестивалі өтті.', 'В нашей школе прошел фестиваль искусств.', 'An arts festival was held in our school.', 'Оқушылар ән айтып, би билеп, өз өнерлерін ортаға салды.', 'Ученики пели, танцевали и демонстрировали свои таланты.', 'Students sang, danced, and showcased their talents.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85']
  ]
  for (const item of newsRows) db.run('INSERT INTO news(slug,title_kk,title_ru,title_en,excerpt_kk,excerpt_ru,excerpt_en,content_kk,content_ru,content_en,image_url,published,published_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,datetime(\'now\'))', [slug(item[0]), ...item, 1])

  const teacherRows = [
    ['Айгүл Сәрсенова','Учитель математики','Mathematics teacher','Математика','Математика','Mathematics'],
    ['Данияр Мұрат','Учитель казахского языка','Kazakh language teacher','Қазақ тілі','Казахский язык','Kazakh language'],
    ['Елена Смирнова','Учитель русского языка','Russian language teacher','Орыс тілі','Русский язык','Russian language'],
    ['Джон Смит','Учитель английского языка','English language teacher','Ағылшын тілі','Английский язык','English'],
    ['Бекзат Қасымов','Учитель истории','History teacher','Тарих','История','History'],
    ['Тимур Аманов','Учитель физики','Physics teacher','Физика','Физика','Physics'],
    ['Гүлнар Оспанова','Учитель биологии','Biology teacher','Биология','Биология','Biology'],
    ['Руслан Исаев','Учитель физкультуры','PE teacher','Дене шынықтыру','Физкультура','Physical Education']
  ]
  for (const item of teacherRows) {
    db.run('INSERT INTO teachers(slug,name_kk,name_ru,name_en,position_kk,position_ru,position_en,subject_kk,subject_ru,subject_en,bio_kk,bio_ru,bio_en,image_url) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [slug(item[0]),item[0],item[0],item[0],'Педагог',item[1],item[2],item[3],item[4],item[5],'Оқушылардың қызығушылығын оятып, жетістігіне қолдау көрсетеді.','Пробуждает интерес учеников и поддерживает их успехи.','Awakens students\' interest and supports their achievements.','https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80'])
  }

  const events = [
    ['Ата-аналар жиналысы','Родительское собрание','Parents meeting','Мектеп өміріндегі маңызды мәселелерді талқылаймыз.','Обсудим важные вопросы школьной жизни.','We will discuss important school matters.','2026-10-15','18:30','Акт залы','Актовый зал','Assembly hall','https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80'],
    ['Күзгі бал','Осенний бал','Autumn ball','Дәстүрлі күзгі бал кеші.','Традиционный осенний бал.','Traditional autumn ball.','2026-10-25','17:00','Спорт залы','Спортивный зал','Sports hall','https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80'],
    ['Мектепішілік олимпиада','Внутришкольная олимпиада','School olympiad','Пәндік олимпиаданың бірінші кезеңі.','Первый этап предметной олимпиады.','First stage of the subject olympiad.','2026-11-10','09:00','Сыныптар','Классы','Classrooms','https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80'],
    ['Жаңа жылдық ертеңгілік','Новогодний утренник','New Year celebration','Бастауыш сыныптарға арналған жаңа жылдық мереке.','Новогодний праздник для начальных классов.','New Year celebration for primary classes.','2026-12-25','10:00','Акт залы','Актовый зал','Assembly hall','https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=900&q=80']
  ]
  for (const e of events) {
    db.run('INSERT INTO events(slug,title_kk,title_ru,title_en,description_kk,description_ru,description_en,event_date,event_time,location_kk,location_ru,location_en,image_url,published) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,1)', [slug(e[0]),...e])
  }

  const schedules = [
    // 7A
    ['7A',1,1,'08:00','Алгебра','Алгебра','Algebra','Айгүл Сәрсенова','12'],
    ['7A',1,2,'08:55','Қазақ тілі','Казахский язык','Kazakh language','Данияр Мұрат','18'],
    ['7A',1,3,'09:50','Ағылшын тілі','Английский язык','English','Джон Смит','22'],
    ['7A',1,4,'10:45','Физика','Физика','Physics','Тимур Аманов','31'],
    ['7A',1,5,'11:40','Дене шынықтыру','Физкультура','PE','Руслан Исаев','Спортзал'],
    
    // 7B
    ['7B',1,1,'08:00','Қазақ тілі','Казахский язык','Kazakh language','Данияр Мұрат','18'],
    ['7B',1,2,'08:55','Алгебра','Алгебра','Algebra','Айгүл Сәрсенова','12'],
    ['7B',1,3,'09:50','Тарих','История','History','Бекзат Қасымов','15'],
    ['7B',1,4,'10:45','Ағылшын тілі','Английский язык','English','Джон Смит','22'],

    // 8A
    ['8A',1,1,'08:00','Физика','Физика','Physics','Тимур Аманов','31'],
    ['8A',1,2,'08:55','Биология','Биология','Biology','Гүлнар Оспанова','25'],
    ['8A',1,3,'09:50','Алгебра','Алгебра','Algebra','Айгүл Сәрсенова','12'],
    
    // 9A
    ['9A',1,1,'08:00','Тарих','История','History','Бекзат Қасымов','15'],
    ['9A',1,2,'08:55','Ағылшын тілі','Английский язык','English','Джон Смит','22'],
    ['9A',1,3,'09:50','Қазақ тілі','Казахский язык','Kazakh language','Данияр Мұрат','18']
  ]
  for (const row of schedules) {
    db.run('INSERT INTO schedule_entries(grade,weekday,lesson_number,time_start,subject_kk,subject_ru,subject_en,teacher,classroom) VALUES(?,?,?,?,?,?,?,?,?)',row)
  }

  const albums = [
    ['Мектеп өмірі','Школьная жизнь','School life','Біздің жарқын сәттеріміз.','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80'],
    ['Спорттық іс-шаралар','Спортивные мероприятия','Sports events','Спорттағы жетістіктер.','https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80'],
    ['Мерекелер','Праздники','Holidays','Мектептегі мерекелік іс-шаралар.','https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80']
  ]
  for (const a of albums) {
    db.run('INSERT INTO gallery_albums(slug,title_kk,title_ru,title_en,description_kk,cover_url) VALUES(?,?,?,?,?,?)',[slug(a[0]),...a])
  }

  const album1 = one('SELECT id FROM gallery_albums WHERE title_kk=?',['Мектеп өмірі']).id
  const album2 = one('SELECT id FROM gallery_albums WHERE title_kk=?',['Спорттық іс-шаралар']).id

  db.run('INSERT INTO gallery_items(album_id,title_kk,image_url) VALUES(?,?,?)',[album1,'Білім күні','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1100&q=85'])
  db.run('INSERT INTO gallery_items(album_id,title_kk,image_url) VALUES(?,?,?)',[album1,'Сабақ үстінде','https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1100&q=85'])
  db.run('INSERT INTO gallery_items(album_id,title_kk,image_url) VALUES(?,?,?)',[album2,'Футбол матчы','https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1100&q=85'])
  db.run('INSERT INTO gallery_items(album_id,title_kk,image_url) VALUES(?,?,?)',[album2,'Жарыс жеңімпаздары','https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1100&q=85'])

  save()
}
