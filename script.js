document.addEventListener('DOMContentLoaded', () => {
    const bubblesContainer = document.getElementById('bubbles-container');
    const taskNameInput = document.getElementById('task-name');
    const taskPointsInput = document.getElementById('task-points');
    const addTaskButton = document.getElementById('add-task');
    const totalPointsDisplay = document.getElementById('total-points');
    const confirmModal = document.getElementById('confirm-modal');
    const pointsModal = document.getElementById('points-modal');
    const modalTaskName = document.getElementById('modal-task-name');
    const confirmPopButton = document.getElementById('confirm-pop');
    const cancelPopButton = document.getElementById('cancel-pop');
    const deductPointsButton = document.getElementById('deduct-points');
    const confirmDeductButton = document.getElementById('confirm-deduct');
    const cancelDeductButton = document.getElementById('cancel-deduct');
    const deductAmountInput = document.getElementById('deduct-amount');
    const resetButton = document.getElementById('reset-all');
    const taskToggle = document.getElementById('task-toggle');
    const taskInputContainer = document.querySelector('.task-input-container');

    // 사운드 요소
    const bubblePopSound = document.getElementById('bubble-pop-sound');
    const pointEarnSound = document.getElementById('point-earn-sound');
    const bubbleCreateSound = document.getElementById('bubble-create-sound');

    // 색상 배열
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
    ];

    // 상태 관리
    let state = {
        totalPoints: 0,
        tasks: [],
        currentBubble: null,
        isTaskInputExpanded: false
    };

    // 태스크 입력 섹션 토글
    taskToggle.addEventListener('click', () => {
        state.isTaskInputExpanded = !state.isTaskInputExpanded;
        taskToggle.classList.toggle('collapsed');
        taskInputContainer.classList.toggle('expanded');
        
        if (state.isTaskInputExpanded) {
            taskNameInput.focus();
        }
    });

    // 데이터 로드
    function loadData() {
        try {
            const savedData = localStorage.getItem('bubbleTaskData');
            if (savedData) {
                const data = JSON.parse(savedData);
                state.totalPoints = data.totalPoints || 0;
                state.tasks = data.tasks || [];
                totalPointsDisplay.textContent = state.totalPoints;
                
                // 저장된 태스크들 다시 생성
                state.tasks.forEach(task => {
                    createBubble(task.name, task.points, task.color);
                });
                console.log('Data loaded successfully:', state);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    // 데이터 저장
    function saveData() {
        try {
            const data = {
                totalPoints: state.totalPoints,
                tasks: state.tasks
            };
            localStorage.setItem('bubbleTaskData', JSON.stringify(data));
            console.log('Data saved successfully:', data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // 초기화
    function resetAll() {
        if (confirm('모든 데이터를 초기화하시겠습니까?')) {
            state.totalPoints = 0;
            state.tasks = [];
            totalPointsDisplay.textContent = state.totalPoints;
            bubblesContainer.innerHTML = '';
            localStorage.removeItem('bubbleTaskData');
            console.log('Data reset successfully');
        }
    }

    // 태스크 추가
    addTaskButton.addEventListener('click', () => {
        const taskName = taskNameInput.value.trim();
        const points = parseInt(taskPointsInput.value);

        if (taskName && points > 0) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            createBubble(taskName, points, color);
            state.tasks.push({ name: taskName, points, color });
            taskNameInput.value = '';
            taskPointsInput.value = '';
            bubbleCreateSound.play();
            saveData();
        }
    });

    // 버블 생성
    function createBubble(taskName, points, color) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.backgroundColor = color;

        const content = document.createElement('div');
        content.className = 'bubble-content';
        content.innerHTML = `
            <div>${taskName}</div>
            <div>${points}점</div>
        `;

        bubble.appendChild(content);
        bubblesContainer.appendChild(bubble);

        // 버블 클릭 이벤트
        bubble.addEventListener('click', () => {
            state.currentBubble = bubble;
            modalTaskName.textContent = taskName;
            confirmModal.style.display = 'block';
        });
    }

    // 버블 터트리기
    confirmPopButton.addEventListener('click', () => {
        if (state.currentBubble) {
            const points = parseInt(state.currentBubble.querySelector('.bubble-content div:last-child').textContent);
            const taskName = state.currentBubble.querySelector('.bubble-content div:first-child').textContent;
            
            state.currentBubble.classList.add('pop-animation');
            bubblePopSound.play();
            
            setTimeout(() => {
                state.currentBubble.remove();
                state.totalPoints += points;
                totalPointsDisplay.textContent = state.totalPoints;
                pointEarnSound.play();
                confirmModal.style.display = 'none';
                state.currentBubble = null;

                // 완료된 태스크 제거
                state.tasks = state.tasks.filter(task => task.name !== taskName);
                saveData();
            }, 500);
        }
    });

    // 취소 버튼
    cancelPopButton.addEventListener('click', () => {
        confirmModal.style.display = 'none';
        state.currentBubble = null;
    });

    // 포인트 차감 모달 열기
    deductPointsButton.addEventListener('click', () => {
        pointsModal.style.display = 'block';
    });

    // 포인트 차감 확인
    confirmDeductButton.addEventListener('click', () => {
        const amount = parseInt(deductAmountInput.value);
        if (amount > 0 && amount <= state.totalPoints) {
            state.totalPoints -= amount;
            totalPointsDisplay.textContent = state.totalPoints;
            deductAmountInput.value = '';
            pointsModal.style.display = 'none';
            saveData();
        }
    });

    // 포인트 차감 취소
    cancelDeductButton.addEventListener('click', () => {
        deductAmountInput.value = '';
        pointsModal.style.display = 'none';
    });

    // 초기화 버튼
    resetButton.addEventListener('click', resetAll);

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            confirmModal.style.display = 'none';
            state.currentBubble = null;
        }
        if (e.target === pointsModal) {
            pointsModal.style.display = 'none';
        }
    });

    // 초기 데이터 로드
    loadData();

    // 디버깅을 위한 상태 로깅
    console.log('Initial state:', state);
}); 