async function postData() {
    const currentUrl = window.location.href;
    const decodedUrl = decodeURIComponent(currentUrl);
    const group = decodedUrl.split('/').pop();
    try {
        const dataToSend = {
            group: group
        };
        const response = await fetch('https://timetable.falpin.ru/api/get_schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });
        if (!response.ok) {
            throw new Error('Ошибка при запросе к API');
        }
        
        const result = await response.json();
        displaySchedule(result.schedule);

    } catch (error) {
        document.querySelector('.api_text').textContent = 'Ошибка: ' + error.message;
    }
}

function displaySchedule(schedule) {
    const main = document.querySelector('main');
    main.innerHTML = ''; // Очищаем main перед вставкой новых данных
    const section = document.createElement('section');
    main.appendChild(section);

    for (const date in schedule) {
        const daySchedule = schedule[date];
        const dayBlock = document.createElement('div');
        dayBlock.classList.add('container');
        
        const dateHeader = document.createElement('h4');
        dateHeader.textContent = date;
        dayBlock.appendChild(dateHeader);

        for (const lessonNumber in daySchedule) {
            const lesson = daySchedule[lessonNumber];
            const lessonBlock = document.createElement('div');
            lessonBlock.classList.add('lesson-block');

            const lessonNum = document.createElement('p');
            lessonNum.classList.add('lesson-number');
            lessonNum.textContent = `${lessonNumber}`;
            lessonBlock.appendChild(lessonNum);

            const lessonData = document.createElement('div');
            lessonData.classList.add('lesson-data');
            lessonBlock.appendChild(lessonData);

            // Создаем subject-block
            const subjectBlock = document.createElement('div');
            subjectBlock.classList.add('subject-block');
            lessonData.appendChild(subjectBlock);

            // Добавляем lesson-time в subject-block
            const lessonTime = document.createElement('p');
            lessonTime.classList.add('lesson-time');
            lessonTime.textContent = `${lesson.time_start} - ${lesson.time_finish}`;
            subjectBlock.appendChild(lessonTime);

            for (const lessonName in lesson.lessons) {
                const lessonInfo = lesson.lessons[lessonName];

                // Добавляем lesson-name в subject-block
                const lessonNameElement = document.createElement('p');
                lessonNameElement.classList.add('lesson-name');
                lessonNameElement.textContent = lessonName;
                subjectBlock.appendChild(lessonNameElement);

                for (const teacher in lessonInfo) {
                    const room = lessonInfo[teacher];

                    // Создаем отдельный teachers-block для каждого учителя
                    const teachersBlock = document.createElement('div');
                    teachersBlock.classList.add('teachers-block');
                    lessonData.appendChild(teachersBlock);

                    // Добавляем lesson-teacher и lesson-room в этот teachers-block
                    const teacherElement = document.createElement('p');
                    teacherElement.classList.add('lesson-teacher');
                    teacherElement.textContent = `${teacher}`;
                    teachersBlock.appendChild(teacherElement);

                    const teacherRoom = document.createElement('p');
                    teacherRoom.textContent = `${room}`;
                    teacherRoom.classList.add('lesson-room');
                    teachersBlock.appendChild(teacherRoom);
                }
            }

            dayBlock.appendChild(lessonBlock);
        }

        section.appendChild(dayBlock);
        main.appendChild(section);
    }
}

// Вызов функции
postData();