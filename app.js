const examApp = (function() {
    const state = {
        mode: 'exam',
        questions: [],
        currentIndex: 0,
        selectedAnswer: null,
        showFeedback: false,
        isAnswerCorrect: null,
        wrongQuestions: [],
        correctCount: 0,
        wrongAnswerMap: {},
        examHistory: 0
    };

    const elements = {
        homePage: document.getElementById('home-page'),
        examPage: document.getElementById('exam-page'),
        resultPage: document.getElementById('result-page'),
        reviewPage: document.getElementById('review-page'),
        
        totalQuestions: document.getElementById('total-questions'),
        wrongCount: document.getElementById('wrong-count'),
        examCount: document.getElementById('exam-count'),
        
        startExamBtn: document.getElementById('start-exam-btn'),
        reviewBtn: document.getElementById('review-btn'),
        clearBtn: document.getElementById('clear-btn'),
        
        progressFill: document.getElementById('progress-fill'),
        currentNum: document.getElementById('current-num'),
        totalNum: document.getElementById('total-num'),
        examMode: document.getElementById('exam-mode'),
        exitExamBtn: document.getElementById('exit-exam-btn'),
        
        questionType: document.getElementById('question-type'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        feedbackSection: document.getElementById('feedback-section'),
        feedbackContent: document.getElementById('feedback-content'),
        nextBtn: document.getElementById('next-btn'),
        
        reviewProgressFill: document.getElementById('review-progress-fill'),
        reviewCurrentNum: document.getElementById('review-current-num'),
        reviewTotalNum: document.getElementById('review-total-num'),
        exitReviewBtn: document.getElementById('exit-review-btn'),
        
        reviewQuestionText: document.getElementById('review-question-text'),
        reviewOptionsContainer: document.getElementById('review-options-container'),
        reviewFeedbackSection: document.getElementById('review-feedback-section'),
        reviewFeedbackContent: document.getElementById('review-feedback-content'),
        reviewNextBtn: document.getElementById('review-next-btn'),
        
        resultTitle: document.getElementById('result-title'),
        resultSubtitle: document.getElementById('result-subtitle'),
        scoreValue: document.getElementById('score-value'),
        scoreProgress: document.getElementById('score-progress'),
        accuracyRate: document.getElementById('accuracy-rate'),
        correctCount: document.getElementById('correct-count'),
        wrongCountResult: document.getElementById('wrong-count-result'),
        wrongListSection: document.getElementById('wrong-list-section'),
        wrongCountDetail: document.getElementById('wrong-count-detail'),
        wrongList: document.getElementById('wrong-list'),
        backHomeBtn: document.getElementById('back-home-btn'),
        reviewWrongBtn: document.getElementById('review-wrong-btn'),
        
        confirmModal: document.getElementById('confirm-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalDesc: document.getElementById('modal-desc'),
        modalCancel: document.getElementById('modal-cancel'),
        modalConfirm: document.getElementById('modal-confirm')
    };

    let pendingAction = null;

    function init() {
        loadStorage();
        updateHomeStats();
        bindEvents();
    }

    function loadStorage() {
        try {
            const savedWrong = localStorage.getItem('drugAnalysis_wrongQuestions');
            if (savedWrong) {
                state.wrongQuestions = JSON.parse(savedWrong);
            }
            const savedHistory = localStorage.getItem('drugAnalysis_examHistory');
            if (savedHistory) {
                state.examHistory = parseInt(savedHistory);
            }
        } catch (e) {
            console.error('Load storage error:', e);
        }
    }

    function saveWrongQuestions() {
        try {
            localStorage.setItem('drugAnalysis_wrongQuestions', JSON.stringify(state.wrongQuestions));
        } catch (e) {
            console.error('Save storage error:', e);
        }
    }

    function saveExamHistory() {
        try {
            localStorage.setItem('drugAnalysis_examHistory', state.examHistory.toString());
        } catch (e) {
            console.error('Save history error:', e);
        }
    }

    function clearAllStorage() {
        localStorage.removeItem('drugAnalysis_wrongQuestions');
        localStorage.removeItem('drugAnalysis_examHistory');
        state.wrongQuestions = [];
        state.examHistory = 0;
    }

    function updateHomeStats() {
        elements.totalQuestions.textContent = questions.length;
        elements.wrongCount.textContent = state.wrongQuestions.length;
        elements.examCount.textContent = state.examHistory;
    }

    function showPage(pageName) {
        elements.homePage.classList.remove('active');
        elements.examPage.classList.remove('active');
        elements.resultPage.classList.remove('active');
        elements.reviewPage.classList.remove('active');

        switch (pageName) {
            case 'home':
                elements.homePage.classList.add('active');
                break;
            case 'exam':
                elements.examPage.classList.add('active');
                break;
            case 'result':
                elements.resultPage.classList.add('active');
                break;
            case 'review':
                elements.reviewPage.classList.add('active');
                break;
        }
    }

    function startExam() {
        state.mode = 'exam';
        state.questions = [...questions];
        state.currentIndex = 0;
        state.selectedAnswer = null;
        state.showFeedback = false;
        state.isAnswerCorrect = null;
        state.correctCount = 0;
        state.wrongAnswerMap = {};

        elements.examMode.textContent = '正式考试';
        elements.examMode.classList.remove('review-mode');
        
        updateExamProgress();
        renderQuestion();
        showPage('exam');
    }

    function startReview() {
        if (state.wrongQuestions.length === 0) {
            showConfirmModal(
                '没有错题',
                '恭喜！您目前没有待复习的错题。继续练习吧！',
                () => {},
                { hideCancel: true, confirmText: '知道了', isInfo: true }
            );
            return;
        }

        state.mode = 'review';
        state.questions = state.wrongQuestions.map(qId => 
            questions.find(q => q.id === qId)
        ).filter(Boolean);
        state.currentIndex = 0;
        state.selectedAnswer = null;
        state.showFeedback = false;
        state.isAnswerCorrect = null;
        state.correctCount = 0;
        state.wrongAnswerMap = {};
        
        updateReviewProgress();
        renderReviewQuestion();
        showPage('review');
    }

    function updateExamProgress() {
        const progress = ((state.currentIndex + 1) / state.questions.length) * 100;
        elements.progressFill.style.width = `${progress}%`;
        elements.currentNum.textContent = state.currentIndex + 1;
        elements.totalNum.textContent = state.questions.length;
    }

    function updateReviewProgress() {
        const progress = ((state.currentIndex + 1) / state.questions.length) * 100;
        elements.reviewProgressFill.style.width = `${progress}%`;
        elements.reviewCurrentNum.textContent = state.currentIndex + 1;
        elements.reviewTotalNum.textContent = state.questions.length;
    }

    function renderQuestion() {
        const question = state.questions[state.currentIndex];
        
        let typeLabel = '单选题';
        if (question.type === 'fill') typeLabel = '填空题';
        else if (question.type === 'truefalse') typeLabel = '判断题';
        
        elements.questionType.textContent = typeLabel;
        elements.questionText.textContent = question.question;
        
        renderOptions(question, elements.optionsContainer, false);
        
        elements.feedbackSection.style.display = 'none';
        elements.nextBtn.disabled = true;
        elements.nextBtn.textContent = state.currentIndex === state.questions.length - 1 ? '完成考试' : '下一题';
    }

    function renderReviewQuestion() {
        const question = state.questions[state.currentIndex];
        
        elements.reviewQuestionText.textContent = question.question;
        
        renderOptions(question, elements.reviewOptionsContainer, true);
        
        elements.reviewFeedbackSection.style.display = 'none';
        elements.reviewNextBtn.disabled = true;
        elements.reviewNextBtn.textContent = state.currentIndex === state.questions.length - 1 ? '完成复习' : '下一题';
    }

    function renderOptions(question, container, isReview) {
        container.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionLetter = option.charAt(0);
            const optionText = option.substring(3).trim();
            
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.dataset.answer = optionLetter;
            btn.innerHTML = `
                <span class="option-label">${optionLetter}</span>
                <span class="option-text">${optionText}</span>
            `;
            
            btn.addEventListener('click', () => {
                handleOptionSelect(optionLetter, isReview);
            });
            
            container.appendChild(btn);
        });
    }

    function handleOptionSelect(answer, isReview) {
        const container = isReview ? elements.reviewOptionsContainer : elements.optionsContainer;
        const question = state.questions[state.currentIndex];
        const buttons = container.querySelectorAll('.option-btn');
        
        buttons.forEach(btn => {
            btn.classList.remove('option-selected', 'option-wrong');
            if (state.showFeedback && btn.dataset.answer === question.answer) {
                btn.classList.add('option-correct');
            }
            if (btn.dataset.answer === answer) {
                btn.classList.add('option-selected');
            }
        });
        
        state.selectedAnswer = answer;
        
        const nextBtn = isReview ? elements.reviewNextBtn : elements.nextBtn;
        nextBtn.disabled = false;
    }

    function handleNext(isReview) {
        if (!state.selectedAnswer) return;

        const question = state.questions[state.currentIndex];
        const isCorrect = state.selectedAnswer === question.answer;

        if (!state.showFeedback) {
            if (isCorrect) {
                state.correctCount++;
                proceedToNext(isReview);
            } else {
                showWrongFeedback(question, isReview);
                state.showFeedback = true;
                state.isAnswerCorrect = false;
                
                if (state.mode === 'exam') {
                    if (!state.wrongQuestions.includes(question.id)) {
                        state.wrongQuestions.push(question.id);
                    }
                    state.wrongAnswerMap[question.id] = state.selectedAnswer;
                }
            }
        } else {
            if (isCorrect) {
                state.correctCount++;
                proceedToNext(isReview);
            } else {
                updateWrongFeedback(question, isReview);
            }
        }
    }

    function showWrongFeedback(question, isReview) {
        const container = isReview ? elements.reviewOptionsContainer : elements.optionsContainer;
        const buttons = container.querySelectorAll('.option-btn');
        
        buttons.forEach(btn => {
            const answer = btn.dataset.answer;
            btn.classList.remove('option-selected');
            if (answer === question.answer) {
                btn.classList.add('option-correct');
            } else if (answer === state.selectedAnswer) {
                btn.classList.add('option-wrong');
            }
        });

        const feedbackSection = isReview ? elements.reviewFeedbackSection : elements.feedbackSection;
        const feedbackContent = isReview ? elements.reviewFeedbackContent : elements.feedbackContent;
        
        showFeedbackMessage(feedbackSection, feedbackContent, false, question);
    }

    function updateWrongFeedback(question, isReview) {
        const container = isReview ? elements.reviewOptionsContainer : elements.optionsContainer;
        const buttons = container.querySelectorAll('.option-btn');
        
        buttons.forEach(btn => {
            const answer = btn.dataset.answer;
            btn.classList.remove('option-selected', 'option-wrong');
            if (answer === question.answer) {
                btn.classList.add('option-correct');
            } else if (answer === state.selectedAnswer) {
                btn.classList.add('option-wrong');
            }
        });
    }

    function showFeedbackMessage(section, content, isCorrect, question) {
        section.style.display = 'block';
        
        if (isCorrect) {
            content.className = 'feedback-content feedback-correct';
            content.innerHTML = `
                <svg class="feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span class="feedback-text">回答正确！</span>
            `;
        } else {
            content.className = 'feedback-content feedback-wrong';
            content.innerHTML = `
                <svg class="feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span class="feedback-text">回答错误！正确答案是 ${question.answer}。请重新选择正确答案后继续。</span>
            `;
        }
    }

    function proceedToNext(isReview) {
        state.currentIndex++;
        state.selectedAnswer = null;
        state.showFeedback = false;
        state.isAnswerCorrect = null;

        if (state.currentIndex >= state.questions.length) {
            finishExam(isReview);
        } else {
            if (isReview) {
                updateReviewProgress();
                renderReviewQuestion();
            } else {
                updateExamProgress();
                renderQuestion();
            }
        }
    }

    function finishExam(isReview) {
        const total = state.questions.length;
        const correct = state.correctCount;
        const wrong = total - correct;
        const score = Math.round((correct / total) * 100);
        const accuracy = Math.round((correct / total) * 100);

        if (!isReview) {
            state.examHistory++;
            saveExamHistory();
            saveWrongQuestions();
            
            elements.resultTitle.textContent = '考试完成！';
            elements.resultSubtitle.textContent = '您的考试成绩如下';
        } else {
            elements.resultTitle.textContent = '复习完成！';
            elements.resultSubtitle.textContent = '您的复习成绩如下';
        }

        elements.scoreValue.textContent = score;
        elements.accuracyRate.textContent = `${accuracy}%`;
        elements.correctCount.textContent = correct;
        elements.wrongCountResult.textContent = wrong;

        const circumference = 2 * Math.PI * 54;
        const offset = circumference * (1 - accuracy / 100);
        elements.scoreProgress.style.strokeDashoffset = offset;

        if (wrong > 0 && !isReview) {
            elements.wrongListSection.style.display = 'block';
            elements.wrongCountDetail.textContent = `${wrong} 题`;
            renderWrongList();
            elements.reviewWrongBtn.style.display = 'inline-flex';
        } else {
            elements.wrongListSection.style.display = 'none';
            elements.reviewWrongBtn.style.display = 'none';
        }

        updateHomeStats();
        showPage('result');
    }

    function renderWrongList() {
        elements.wrongList.innerHTML = '';
        
        Object.keys(state.wrongAnswerMap).forEach(qId => {
            const question = state.questions.find(q => q.id === parseInt(qId));
            if (!question) return;
            
            const wrongAnswer = state.wrongAnswerMap[qId];
            const wrongOption = question.options.find(o => o.startsWith(wrongAnswer));
            const correctOption = question.options.find(o => o.startsWith(question.answer));
            
            const item = document.createElement('div');
            item.className = 'wrong-item';
            item.innerHTML = `
                <div class="wrong-question">${question.question}</div>
                <div class="wrong-answer-info">
                    <span class="your-answer">您选：${wrongOption || wrongAnswer}</span>
                    <span class="correct-answer">正确：${correctOption || question.answer}</span>
                </div>
            `;
            elements.wrongList.appendChild(item);
        });
    }

    function showConfirmModal(title, desc, onConfirm, options = {}) {
        elements.modalTitle.textContent = title;
        elements.modalDesc.textContent = desc;
        elements.confirmModal.style.display = 'flex';
        
        if (options.hideCancel) {
            elements.modalCancel.style.display = 'none';
        } else {
            elements.modalCancel.style.display = 'inline-flex';
        }
        
        if (options.confirmText) {
            elements.modalConfirm.textContent = options.confirmText;
        } else {
            elements.modalConfirm.textContent = '确定';
        }
        
        if (options.isInfo) {
            elements.modalConfirm.className = 'btn btn-primary';
        } else {
            elements.modalConfirm.className = 'btn btn-danger';
        }
        
        pendingAction = onConfirm;
    }

    function hideConfirmModal() {
        elements.confirmModal.style.display = 'none';
        pendingAction = null;
    }

    function bindEvents() {
        elements.startExamBtn.addEventListener('click', startExam);
        
        elements.reviewBtn.addEventListener('click', startReview);
        
        elements.clearBtn.addEventListener('click', () => {
            showConfirmModal(
                '清除记录',
                '确定要清除所有考试记录和错题吗？此操作不可恢复。',
                () => {
                    clearAllStorage();
                    updateHomeStats();
                }
            );
        });

        elements.nextBtn.addEventListener('click', () => handleNext(false));
        
        elements.reviewNextBtn.addEventListener('click', () => handleNext(true));

        elements.exitExamBtn.addEventListener('click', () => {
            showConfirmModal(
                '退出考试',
                '当前考试进度将不会保存，确定要退出吗？',
                () => {
                    showPage('home');
                }
            );
        });
        
        elements.exitReviewBtn.addEventListener('click', () => {
            showConfirmModal(
                '退出复习',
                '当前复习进度将不会保存，确定要退出吗？',
                () => {
                    showPage('home');
                }
            );
        });

        elements.backHomeBtn.addEventListener('click', () => {
            showPage('home');
        });
        
        elements.reviewWrongBtn.addEventListener('click', () => {
            startReview();
        });

        elements.modalCancel.addEventListener('click', hideConfirmModal);
        
        elements.modalConfirm.addEventListener('click', () => {
            if (pendingAction) {
                pendingAction();
            }
            hideConfirmModal();
        });

        elements.confirmModal.querySelector('.modal-overlay').addEventListener('click', hideConfirmModal);
    }

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', function() {
    examApp.init();
});
