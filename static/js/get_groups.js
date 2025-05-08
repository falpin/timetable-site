async function fetchData() {
    const currentUrl = window.location.href;
    const decodedUrl = decodeURIComponent(currentUrl);
    const complex = decodedUrl.split('/').pop();

    const main = document.querySelector('main');
    main.innerHTML = '';

    try {
        const response = await fetch('https://timetable.falpin.ru/api/get_groups');
        if (!response.ok) {
            throw new Error('Ошибка при запросе к API');
        }
        const data = await response.json();

    // Фильтруем данные по complex
        const data_complex = Object.entries(data)
        .filter(([key, value]) => value.complex === complex)
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    // Группируем данные по курсам
        const courses = {};
        for (const [groupName, groupData] of Object.entries(data_complex)) {
            const course = groupData.course;
            if (!courses[course]) {
                courses[course] = [];
            }
            courses[course].push({ groupName, url: groupData.url });
        }

    // Сортируем курсы по порядку (1 курс, 2 курс, ..., 5 курс)
        const sortedCourses = Object.entries(courses).sort((a, b) => {
            const courseNumberA = parseInt(a[0].match(/\d+/)[0], 10);
            const courseNumberB = parseInt(b[0].match(/\d+/)[0], 10);
            return courseNumberA - courseNumberB;
        });

    // Сортируем группы внутри каждого курса по первой цифре после названия группы
        for (const [course, groups] of sortedCourses) {
            groups.sort((a, b) => {
                const numberA = parseInt(a.groupName.match(/-(\d+)-/)[1], 10);
                const numberB = parseInt(b.groupName.match(/-(\d+)-/)[1], 10);
                return numberA - numberB;
            });
        }

        // Создаем блоки для каждого курса
        for (const [courseName, groups] of sortedCourses) {
            const courseBlock = document.createElement('div');
            courseBlock.className = 'container';

            // Заголовок курса
            const courseHeader = document.createElement('h2');
            courseHeader.className = 'course_name';
            courseHeader.textContent = courseName;
            courseBlock.appendChild(courseHeader);

            // Контейнер для групп
            const groupsContainer = document.createElement('div');
            groupsContainer.className = 'groups';

            // Добавляем ссылки на группы
            for (const group of groups) {
                const groupLink = document.createElement('a');
                groupLink.href = "/schedule/"+group.groupName;
                groupLink.textContent = group.groupName;
                groupsContainer.appendChild(groupLink);
            }

            courseBlock.appendChild(groupsContainer);
            main.appendChild(courseBlock);
            // container.appendChild(courseBlock);
        }


    } catch (error) {
        console.error('Ошибка:', error);
        document.querySelector('.api_text').textContent = 'Ошибка: ' + error.message;
    }
}

fetchData();