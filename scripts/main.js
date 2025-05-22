// BMI 계산 함수
function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
}

// BMI 카테고리 결정 함수
function getBMICategory(bmi) {
    if (bmi < 18.5) return '저체중';
    if (bmi < 23) return '정상';
    if (bmi < 25) return '과체중';
    return '비만';
}

// 폼 제출 처리
document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    
    const bmi = calculateBMI(weight, height);
    const category = getBMICategory(bmi);
    
    document.getElementById('bmiValue').textContent = bmi;
    document.getElementById('bmiCategory').textContent = `체중 상태: ${category}`;
    
    // 로컬 스토리지에 사용자 정보 저장
    localStorage.setItem('userInfo', JSON.stringify({
        height,
        weight,
        targetWeight: document.getElementById('targetWeight').value,
        targetMuscle: document.getElementById('targetMuscle').value
    }));
    
    generateMealPlan();
});

// 식단 생성 함수
function generateMealPlan() {
    const mealTimes = ['breakfast', 'lunch', 'dinner'];
    const mealSuggestions = {
        breakfast: [
            { name: '오트밀과 바나나', calories: 300 },
            { name: '계란 샌드위치', calories: 400 },
            { name: '그릭 요거트와 과일', calories: 250 }
        ],
        lunch: [
            { name: '닭가슴살 샐러드', calories: 350 },
            { name: '현미밥과 생선구이', calories: 450 },
            { name: '퀴노아 볼', calories: 400 }
        ],
        dinner: [
            { name: '두부 스테이크', calories: 300 },
            { name: '연어 스테이크', calories: 400 },
            { name: '닭가슴살 스테이크', calories: 350 }
        ]
    };

    mealTimes.forEach(mealTime => {
        const container = document.getElementById(mealTime);
        container.innerHTML = ''; // 기존 내용 초기화
        
        const meal = mealSuggestions[mealTime][Math.floor(Math.random() * 3)];
        const mealElement = document.createElement('div');
        mealElement.className = 'meal-item';
        mealElement.innerHTML = `
            <input type="checkbox" id="${mealTime}-check">
            <label for="${mealTime}-check">${meal.name} (${meal.calories}kcal)</label>
        `;
        container.appendChild(mealElement);
    });
}

// 페이지 로드 시 저장된 정보 불러오기
window.addEventListener('load', function() {
    const savedInfo = localStorage.getItem('userInfo');
    if (savedInfo) {
        const info = JSON.parse(savedInfo);
        document.getElementById('height').value = info.height;
        document.getElementById('weight').value = info.weight;
        document.getElementById('targetWeight').value = info.targetWeight;
        document.getElementById('targetMuscle').value = info.targetMuscle;
        
        const bmi = calculateBMI(info.weight, info.height);
        document.getElementById('bmiValue').textContent = bmi;
        document.getElementById('bmiCategory').textContent = `체중 상태: ${getBMICategory(bmi)}`;
        
        generateMealPlan();
    }
}); 