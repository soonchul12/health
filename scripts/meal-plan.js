// 식단 데이터베이스
const mealDatabase = {
    breakfast: [
        { name: '오트밀과 바나나', calories: 300, protein: 10 },
        { name: '계란 샌드위치', calories: 400, protein: 15 },
        { name: '그릭 요거트와 과일', calories: 250, protein: 12 },
        { name: '단백질 쉐이크', calories: 200, protein: 20 },
        { name: '통곡물 토스트와 아보카도', calories: 350, protein: 8 }
    ],
    lunch: [
        { name: '닭가슴살 샐러드', calories: 350, protein: 25 },
        { name: '현미밥과 생선구이', calories: 450, protein: 30 },
        { name: '퀴노아 볼', calories: 400, protein: 15 },
        { name: '고구마와 닭가슴살', calories: 380, protein: 28 },
        { name: '연어 포케 볼', calories: 420, protein: 22 }
    ],
    dinner: [
        { name: '두부 스테이크', calories: 300, protein: 20 },
        { name: '연어 스테이크', calories: 400, protein: 35 },
        { name: '닭가슴살 스테이크', calories: 350, protein: 40 },
        { name: '돼지고기 안심 구이', calories: 380, protein: 35 },
        { name: '콩고기 버거', calories: 320, protein: 15 }
    ]
};

// 페이지 로드 시 주간 식단 생성
window.addEventListener('load', function() {
    generateWeeklyMealPlan();
});

// 주간 식단 생성 함수
function generateWeeklyMealPlan() {
    const weekdays = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
    const weeklyPlanContainer = document.querySelector('.weekly-plan');
    
    weekdays.forEach(day => {
        const dayPlan = createDayPlan(day);
        weeklyPlanContainer.appendChild(dayPlan);
    });
}

// 일일 식단 생성 함수
function createDayPlan(day) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-plan';
    
    const meals = {
        breakfast: getRandomMeal('breakfast'),
        lunch: getRandomMeal('lunch'),
        dinner: getRandomMeal('dinner')
    };

    dayDiv.innerHTML = `
        <h3>${day}</h3>
        <div class="meal-time">
            <h4>아침</h4>
            <div class="meal-items">
                ${createMealItemHTML(meals.breakfast, 'breakfast')}
            </div>
        </div>
        <div class="meal-time">
            <h4>점심</h4>
            <div class="meal-items">
                ${createMealItemHTML(meals.lunch, 'lunch')}
            </div>
        </div>
        <div class="meal-time">
            <h4>저녁</h4>
            <div class="meal-items">
                ${createMealItemHTML(meals.dinner, 'dinner')}
            </div>
        </div>
    `;

    // 체크박스 이벤트 리스너 추가
    const checkboxes = dayDiv.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateTodayMeals();
        });
    });
    
    return dayDiv;
}

// 랜덤 식단 선택 함수
function getRandomMeal(mealType) {
    return mealDatabase[mealType][Math.floor(Math.random() * mealDatabase[mealType].length)];
}

// 식사 아이템 HTML 생성 함수
function createMealItemHTML(meal, mealType) {
    const today = new Date().toLocaleDateString();
    const savedMeals = JSON.parse(localStorage.getItem('todayMeals')) || [];
    const isCompleted = savedMeals.some(m => m.name === meal.name && m.completed);

    return `
        <div class="meal-item">
            <input type="checkbox" id="${mealType}-${Math.random()}" 
                   ${isCompleted ? 'checked' : ''}>
            <label>${meal.name} (${meal.calories}kcal, 단백질 ${meal.protein}g)</label>
        </div>
    `;
}

// 오늘의 식사 업데이트 함수
function updateTodayMeals() {
    const allMealItems = document.querySelectorAll('.meal-item');
    const todayMeals = [];

    allMealItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const label = item.querySelector('label');
        const mealText = label.textContent;
        const calories = parseInt(mealText.match(/\((\d+)kcal/)[1]);

        todayMeals.push({
            name: mealText.split(' (')[0],
            calories: calories,
            completed: checkbox.checked
        });
    });

    localStorage.setItem('todayMeals', JSON.stringify(todayMeals));
} 