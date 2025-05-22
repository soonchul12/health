// 날짜 표시 함수
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
    };
    const dateStr = now.toLocaleDateString('ko-KR', options);
    document.getElementById('currentDate').textContent = dateStr;
}

// 칼로리 계산 함수
function calculateDailyCalories(weight, height, targetWeight) {
    // 기초 대사량 계산 (해리스-베네딕트 공식)
    const bmr = 10 * weight + 6.25 * height - 5 * 25 + 5; // 나이는 25로 가정
    
    // 목표에 따른 칼로리 조정
    if (weight > targetWeight) {
        return Math.round(bmr * 0.85); // 감량 목표: 15% 감소
    } else if (weight < targetWeight) {
        return Math.round(bmr * 1.15); // 증량 목표: 15% 증가
    }
    return Math.round(bmr);
}

// 게이지 업데이트 함수
function updateCalorieGauge(currentCal, targetCal) {
    const percentage = (currentCal / targetCal) * 100;
    const gauge = document.getElementById('calorieGauge');
    gauge.style.width = `${Math.min(percentage, 100)}%`;
    
    document.getElementById('currentCalories').textContent = currentCal;
    document.getElementById('targetCalories').textContent = targetCal;
}

// 식사 체크리스트 생성 함수
function createMealCheckList() {
    const mealList = document.getElementById('mealCheckList');
    const meals = JSON.parse(localStorage.getItem('todayMeals')) || [];
    
    mealList.innerHTML = '';
    let totalCalories = 0;

    meals.forEach((meal, index) => {
        const div = document.createElement('div');
        div.className = 'meal-check-item';
        div.innerHTML = `
            <input type="checkbox" id="meal-${index}" 
                   ${meal.completed ? 'checked' : ''} 
                   onchange="updateMealStatus(${index})">
            <label for="meal-${index}">${meal.name}</label>
            <span class="meal-calories">${meal.calories} kcal</span>
        `;
        mealList.appendChild(div);
        
        if (meal.completed) {
            totalCalories += meal.calories;
        }
    });

    return totalCalories;
}

// 식사 상태 업데이트 함수
function updateMealStatus(index) {
    const meals = JSON.parse(localStorage.getItem('todayMeals')) || [];
    meals[index].completed = !meals[index].completed;
    localStorage.setItem('todayMeals', JSON.stringify(meals));
    
    // 게이지 업데이트
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    const targetCalories = calculateDailyCalories(
        userInfo.weight, 
        userInfo.height, 
        userInfo.targetWeight
    );
    const currentCalories = createMealCheckList();
    updateCalorieGauge(currentCalories, targetCalories);
}

// 페이지 로드 시 실행
window.addEventListener('load', function() {
    updateCurrentDate();
    
    // 사용자 정보 가져오기
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    
    if (userInfo.height && userInfo.weight && userInfo.targetWeight) {
        const targetCalories = calculateDailyCalories(
            userInfo.weight, 
            userInfo.height, 
            userInfo.targetWeight
        );
        const currentCalories = createMealCheckList();
        updateCalorieGauge(currentCalories, targetCalories);
    } else {
        // 사용자 정보가 없는 경우
        document.querySelector('.calorie-section').innerHTML = `
            <div class="alert">
                <p>먼저 <a href="profile.html">내 정보</a>를 입력해주세요.</p>
            </div>
        `;
    }
}); 