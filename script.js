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

    // 사운드 요소
    const bubblePopSound = document.getElementById('bubble-pop-sound');
    const pointEarnSound = document.getElementById('point-earn-sound');
    const bubbleCreateSound = document.getElementById('bubble-create-sound');

    let totalPoints = 0;
    let currentBubble = null;
    let tasks = [];

    // 색상 배열
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
    ];

    // 데이터 로드
    function loadData() {
        const savedData = localStorage.getItem('bubbleTaskData');
        if (savedData) {
            const data = JSON.parse(savedData);
            totalPoints = data.totalPoints || 0;
            tasks = data.tasks || [];
            totalPointsDisplay.textContent = totalPoints;
            
            // 저장된 태스크들 다시 생성
            tasks.forEach(task => {
                createBubble(task.name, task.points, task.color);
            });
        }
    }

    // 데이터 저장
    function saveData() {
        const data = {
            totalPoints,
            tasks
        };
        localStorage.setItem('bubbleTaskData', JSON.stringify(data));
    }

    // 초기화
    function resetAll() {
        if (confirm('모든 데이터를 초기화하시겠습니까?')) {
            totalPoints = 0;
            tasks = [];
            totalPointsDisplay.textContent = totalPoints;
            bubblesContainer.innerHTML = '';
            localStorage.removeItem('bubbleTaskData');
        }
    }

    // 태스크 추가
    addTaskButton.addEventListener('click', () => {
        const taskName = taskNameInput.value.trim();
        const points = parseInt(taskPointsInput.value);

        if (taskName && points > 0) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            createBubble(taskName, points, color);
            tasks.push({ name: taskName, points, color });
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
            currentBubble = bubble;
            modalTaskName.textContent = taskName;
            confirmModal.style.display = 'block';
        });
    }

    // 버블 터트리기
    confirmPopButton.addEventListener('click', () => {
        if (currentBubble) {
            const points = parseInt(currentBubble.querySelector('.bubble-content div:last-child').textContent);
            const taskName = currentBubble.querySelector('.bubble-content div:first-child').textContent;
            
            currentBubble.classList.add('pop-animation');
            bubblePopSound.play();
            
            setTimeout(() => {
                currentBubble.remove();
                totalPoints += points;
                totalPointsDisplay.textContent = totalPoints;
                pointEarnSound.play();
                confirmModal.style.display = 'none';
                currentBubble = null;

                // 완료된 태스크 제거
                tasks = tasks.filter(task => task.name !== taskName);
                saveData();
            }, 500);
        }
    });

    // 취소 버튼
    cancelPopButton.addEventListener('click', () => {
        confirmModal.style.display = 'none';
        currentBubble = null;
    });

    // 포인트 차감 모달 열기
    deductPointsButton.addEventListener('click', () => {
        pointsModal.style.display = 'block';
    });

    // 포인트 차감 확인
    confirmDeductButton.addEventListener('click', () => {
        const amount = parseInt(deductAmountInput.value);
        if (amount > 0 && amount <= totalPoints) {
            totalPoints -= amount;
            totalPointsDisplay.textContent = totalPoints;
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
            currentBubble = null;
        }
        if (e.target === pointsModal) {
            pointsModal.style.display = 'none';
        }
    });

    // 초기 데이터 로드
    loadData();
}); 