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

    // 사운드 요소
    const bubblePopSound = document.getElementById('bubble-pop-sound');
    const pointEarnSound = document.getElementById('point-earn-sound');
    const bubbleCreateSound = document.getElementById('bubble-create-sound');

    let totalPoints = 0;
    let currentBubble = null;

    // 색상 배열
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
    ];

    // 태스크 추가
    addTaskButton.addEventListener('click', () => {
        const taskName = taskNameInput.value.trim();
        const points = parseInt(taskPointsInput.value);

        if (taskName && points > 0) {
            createBubble(taskName, points);
            taskNameInput.value = '';
            taskPointsInput.value = '';
            bubbleCreateSound.play();
        }
    });

    // 버블 생성
    function createBubble(taskName, points) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        bubble.style.backgroundColor = randomColor;

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
            currentBubble.classList.add('pop-animation');
            bubblePopSound.play();
            
            setTimeout(() => {
                currentBubble.remove();
                totalPoints += points;
                totalPointsDisplay.textContent = totalPoints;
                pointEarnSound.play();
                confirmModal.style.display = 'none';
                currentBubble = null;
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
        }
    });

    // 포인트 차감 취소
    cancelDeductButton.addEventListener('click', () => {
        deductAmountInput.value = '';
        pointsModal.style.display = 'none';
    });

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
}); 