window.examApp = (function() {
    const isLocal = window.location.hostname === 'localhost' 
        || window.location.hostname === '127.0.0.1'
        || window.location.protocol === 'file:';
    // 本地开发使用 localhost:3001，Vercel 部署时使用相对路径 /api
    const API_BASE_URL = isLocal ? 'http://localhost:3001/api' : '/api';
    
    const questionData = {
        yaowu: window.questions || [],
        linchuang: window.questions_linchuang || [],
        sixiang: window.questions_sixiangdaode || []
    };

    const TOKEN_KEY = 'examApp_token';
    
    const state = {
        currentUser: null,
        token: null,
        currentSubject: 'yaowu',
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
        loginPage: document.getElementById('login-page'),
        homePage: document.getElementById('home-page'),
        subjectDetailPage: document.getElementById('subject-detail-page'),
        examPage: document.getElementById('exam-page'),
        resultPage: document.getElementById('result-page'),
        reviewPage: document.getElementById('review-page'),
        
        userInfo: document.getElementById('user-info'),
        userName: document.getElementById('user-name'),
        logoutBtn: document.getElementById('logout-btn'),
        
        loginForm: document.getElementById('login-form'),
        registerForm: document.getElementById('register-form'),
        loginUsername: document.getElementById('login-username'),
        loginPassword: document.getElementById('login-password'),
        registerUsername: document.getElementById('register-username'),
        registerPassword: document.getElementById('register-password'),
        registerConfirmPassword: document.getElementById('register-confirm-password'),
        loginError: document.getElementById('login-error'),
        registerError: document.getElementById('register-error'),
        loginSubmitBtn: document.getElementById('login-submit-btn'),
        registerSubmitBtn: document.getElementById('register-submit-btn'),
        goToRegister: document.getElementById('go-to-register'),
        goToLogin: document.getElementById('go-to-login'),
        
        headerSubtitle: document.getElementById('header-subtitle'),
        headerSubject: document.getElementById('header-subject'),
        
        yaowuCount: document.getElementById('yaowu-count'),
        linchuangCount: document.getElementById('linchuang-count'),
        sixiangCount: document.getElementById('sixiang-count'),
        yaowuWrong: document.getElementById('yaowu-wrong'),
        yaowuExam: document.getElementById('yaowu-exam'),
        linchuangWrong: document.getElementById('linchuang-wrong'),
        linchuangExam: document.getElementById('linchuang-exam'),
        sixiangWrong: document.getElementById('sixiang-wrong'),
        sixiangExam: document.getElementById('sixiang-exam'),
        
        subjectCards: document.querySelectorAll('.subject-card'),
        
        detailSubjectName: document.getElementById('detail-subject-name'),
        detailQuestionCount: document.getElementById('detail-question-count'),
        detailWrongCount: document.getElementById('detail-wrong-count'),
        detailExamCount: document.getElementById('detail-exam-count'),
        detailSubjectIcon: document.getElementById('detail-subject-icon'),
        backFromDetailBtn: document.getElementById('back-home-btn'),
        detailExamBtn: document.getElementById('detail-exam-btn'),
        detailReviewBtn: document.getElementById('detail-review-btn'),
        detailClearBtn: document.getElementById('detail-clear-btn'),
        
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
        encouragementMessage: document.getElementById('encouragement-message'),
        scoreValue: document.getElementById('score-value'),
        scoreProgress: document.getElementById('score-progress'),
        accuracyRate: document.getElementById('accuracy-rate'),
        resultCorrectCount: document.getElementById('result-correct-count'),
        wrongCountResult: document.getElementById('wrong-count-result'),
        wrongListSection: document.getElementById('wrong-list-section'),
        wrongCountDetail: document.getElementById('wrong-count-detail'),
        wrongList: document.getElementById('wrong-list'),
        backHomeBtn: document.getElementById('back-home-btn'),
        resultBackHomeBtn: document.getElementById('result-back-home-btn'),
        reviewWrongBtn: document.getElementById('review-wrong-btn'),
        
        reviewCorrectCount: document.getElementById('review-correct-count'),
        reviewWrongCount: document.getElementById('review-wrong-count'),
        reviewAnswerCardBtn: document.getElementById('review-answer-card-btn'),
        reviewAnswerCardModal: document.getElementById('review-answer-card-modal'),
        reviewAnswerCardOverlay: document.getElementById('review-answer-card-overlay'),
        reviewCloseAnswerCard: document.getElementById('review-close-answer-card'),
        reviewAnswerGrid: document.getElementById('review-answer-grid'),
        
        confirmModal: document.getElementById('confirm-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalDesc: document.getElementById('modal-desc'),
        modalCancel: document.getElementById('modal-cancel'),
        modalConfirm: document.getElementById('modal-confirm'),
        
        examCorrectCount: document.getElementById('correct-count'),
        examWrongCount: document.getElementById('wrong-count'),
        answerCardBtn: document.getElementById('answer-card-btn'),
        correctCountBtn: document.getElementById('correct-count-btn'),
        wrongCountBtn: document.getElementById('wrong-count-btn'),
        answerCardModal: document.getElementById('answer-card-modal'),
        closeAnswerCardBtn: document.getElementById('close-answer-card-btn'),
        answerGrid: document.getElementById('answer-grid')
    };

    let pendingAction = null;

    const subjectIcons = {
        yaowu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>`,
        linchuang: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>`,
        sixiang: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
        </svg>`
    };

    async function init() {
        bindEvents();
        
        const isLoggedIn = await checkCurrentUser();
        if (isLoggedIn) {
            await loadAllSubjectsFromServer();
            loadAllSubjectStats();
            loadStorage();
            updateHomeStats();
            updateUserDisplay();
            updateHeaderDisplay();
            showPage('home');
        } else {
            showLoginForm();
            updateUserDisplay();
            showPage('login');
        }
    }

    function updateHeaderDisplay(pageName) {
        if (!elements.headerSubtitle || !elements.headerSubject) return;
        
        if (pageName === 'exam' || pageName === 'review') {
            elements.headerSubtitle.style.display = 'none';
            elements.headerSubject.style.display = 'inline-block';
            const mode = state.mode === 'review' ? '错题重做' : '正式考试';
            elements.headerSubject.textContent = `${subjectNames[state.currentSubject]} - ${mode}`;
        } else {
            elements.headerSubtitle.style.display = 'inline-block';
            elements.headerSubject.style.display = 'none';
        }
    }

    const CURRENT_USER_KEY = 'examApp_currentUser';
    
    function getUserStorageKey(suffix) {
        if (!state.currentUser) return null;
        return `examApp_user_${state.currentUser}_${suffix}`;
    }
    
    async function apiRequest(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (state.token) {
            headers['Authorization'] = `Bearer ${state.token}`;
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        return response.json();
    }
    
    async function registerUser(username, password) {
        try {
            const result = await apiRequest('/register', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            return result;
        } catch (e) {
            return { success: false, message: '网络错误，请检查后端服务是否启动' };
        }
    }
    
    async function loginUser(username, password) {
        try {
            const result = await apiRequest('/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            
            if (result.success) {
                state.currentUser = result.username;
                state.token = result.token;
                localStorage.setItem(CURRENT_USER_KEY, result.username);
                localStorage.setItem(TOKEN_KEY, result.token);
            }
            
            return result;
        } catch (e) {
            return { success: false, message: '网络错误，请检查后端服务是否启动' };
        }
    }
    
    function logoutUser() {
        state.currentUser = null;
        state.token = null;
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
    }
    
    async function checkCurrentUser() {
        const savedUser = localStorage.getItem(CURRENT_USER_KEY);
        const savedToken = localStorage.getItem(TOKEN_KEY);
        
        if (savedUser && savedToken) {
            state.currentUser = savedUser;
            state.token = savedToken;
            
            try {
                const result = await apiRequest('/user/info');
                if (result.success) {
                    return true;
                }
            } catch (e) {
                console.log('Token校验失败，使用本地缓存');
                return true;
            }
        }
        
        return false;
    }
    
    async function syncSubjectData(subject) {
        if (!state.token) return;
        
        const data = {
            subject,
            wrongQuestions: state.wrongQuestions,
            examHistory: state.examHistory
        };
        
        try {
            await apiRequest('/sync/subject', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        } catch (e) {
            console.log('数据同步失败:', e);
        }
    }
    
    async function loadSubjectDataFromServer(subject) {
        if (!state.token) return null;
        
        try {
            const result = await apiRequest(`/sync/subject/${subject}`);
            if (result.success && result.data) {
                const wrongQuestions = result.data.wrongQuestions || [];
                const examHistory = result.data.examHistory || 0;
                
                localStorage.setItem(
                    getStorageKeyForSubject(subject, 'wrongQuestions'),
                    JSON.stringify(wrongQuestions)
                );
                localStorage.setItem(
                    getStorageKeyForSubject(subject, 'examHistory'),
                    examHistory.toString()
                );
                
                if (state.currentSubject === subject) {
                    state.wrongQuestions = wrongQuestions;
                    state.examHistory = examHistory;
                }
                
                return { wrongQuestions, examHistory };
            }
        } catch (e) {
            console.log('从服务器加载数据失败:', e);
        }
        return null;
    }
    
    async function loadAllSubjectsFromServer() {
        if (!state.token) return;
        
        for (const subject in questionData) {
            await loadSubjectDataFromServer(subject);
        }
    }
    
    function updateUserDisplay() {
        if (elements.userInfo && elements.userName) {
            if (state.currentUser) {
                elements.userInfo.style.display = 'flex';
                elements.userName.textContent = state.currentUser;
            } else {
                elements.userInfo.style.display = 'none';
            }
        }
    }
    
    function showLoginForm() {
        if (elements.loginForm) elements.loginForm.style.display = 'block';
        if (elements.registerForm) elements.registerForm.style.display = 'none';
        if (elements.loginError) elements.loginError.style.display = 'none';
        if (elements.registerError) elements.registerError.style.display = 'none';
    }
    
    function showRegisterForm() {
        if (elements.loginForm) elements.loginForm.style.display = 'none';
        if (elements.registerForm) elements.registerForm.style.display = 'block';
        if (elements.loginError) elements.loginError.style.display = 'none';
        if (elements.registerError) elements.registerError.style.display = 'none';
    }
    
    async function handleLogin() {
        const username = elements.loginUsername ? elements.loginUsername.value.trim() : '';
        const password = elements.loginPassword ? elements.loginPassword.value : '';
        
        if (!username) {
            elements.loginError.textContent = '请输入账号';
            elements.loginError.style.display = 'block';
            return;
        }
        if (!password) {
            elements.loginError.textContent = '请输入密码';
            elements.loginError.style.display = 'block';
            return;
        }
        
        elements.loginSubmitBtn.disabled = true;
        elements.loginSubmitBtn.textContent = '登录中...';
        
        const result = await loginUser(username, password);
        if (result.success) {
            await loadAllSubjectsFromServer();
            loadAllSubjectStats();
            loadStorage();
            updateHomeStats();
            updateUserDisplay();
            showPage('home');
        } else {
            elements.loginError.textContent = result.message;
            elements.loginError.style.display = 'block';
        }
        
        elements.loginSubmitBtn.disabled = false;
        elements.loginSubmitBtn.textContent = '登录';
    }
    
    async function handleRegister() {
        const username = elements.registerUsername ? elements.registerUsername.value.trim() : '';
        const password = elements.registerPassword ? elements.registerPassword.value : '';
        const confirmPassword = elements.registerConfirmPassword ? elements.registerConfirmPassword.value : '';
        
        if (!username) {
            elements.registerError.textContent = '请输入账号';
            elements.registerError.style.display = 'block';
            return;
        }
        if (username.length < 3) {
            elements.registerError.textContent = '账号至少需要3个字符';
            elements.registerError.style.display = 'block';
            return;
        }
        if (!password) {
            elements.registerError.textContent = '请输入密码';
            elements.registerError.style.display = 'block';
            return;
        }
        if (password.length < 6) {
            elements.registerError.textContent = '密码至少需要6个字符';
            elements.registerError.style.display = 'block';
            return;
        }
        if (password !== confirmPassword) {
            elements.registerError.textContent = '两次输入的密码不一致';
            elements.registerError.style.display = 'block';
            return;
        }
        
        elements.registerSubmitBtn.disabled = true;
        elements.registerSubmitBtn.textContent = '注册中...';
        
        const result = await registerUser(username, password);
        if (result.success) {
            loadAllSubjectStats();
            loadStorage();
            updateHomeStats();
            updateUserDisplay();
            showPage('home');
        } else {
            elements.registerError.textContent = result.message;
            elements.registerError.style.display = 'block';
        }
        
        elements.registerSubmitBtn.disabled = false;
        elements.registerSubmitBtn.textContent = '注册';
    }
    
    function handleLogout() {
        logoutUser();
        updateUserDisplay();
        showLoginForm();
        if (elements.loginUsername) elements.loginUsername.value = '';
        if (elements.loginPassword) elements.loginPassword.value = '';
        if (elements.registerUsername) elements.registerUsername.value = '';
        if (elements.registerPassword) elements.registerPassword.value = '';
        if (elements.registerConfirmPassword) elements.registerConfirmPassword.value = '';
        showPage('login');
    }
    
    const subjectNames = {
        yaowu: '药物分析',
        linchuang: '临床医学概论',
        sixiang: '思想道德与法治'
    };

    function getStorageKeyForSubject(subject, suffix) {
        if (state.currentUser) {
            return `examApp_user_${state.currentUser}_${subject}_${suffix}`;
        }
        return `examApp_${subject}_${suffix}`;
    }

    function getStorageKey(suffix) {
        if (state.currentUser) {
            return `examApp_user_${state.currentUser}_${state.currentSubject}_${suffix}`;
        }
        return `examApp_${state.currentSubject}_${suffix}`;
    }

    function loadAllSubjectStats() {
        state.allSubjectStats = {};
        for (const subject in questionData) {
            try {
                const savedWrong = localStorage.getItem(getStorageKeyForSubject(subject, 'wrongQuestions'));
                const savedHistory = localStorage.getItem(getStorageKeyForSubject(subject, 'examHistory'));
                state.allSubjectStats[subject] = {
                    wrongCount: savedWrong ? JSON.parse(savedWrong).length : 0,
                    examCount: savedHistory ? parseInt(savedHistory) : 0
                };
            } catch (e) {
                state.allSubjectStats[subject] = { wrongCount: 0, examCount: 0 };
            }
        }
    }

    function updateSubjectDetail() {
        const subject = state.currentSubject;
        if (elements.detailSubjectName) {
            elements.detailSubjectName.textContent = subjectNames[subject] || subject;
        }
        if (elements.detailQuestionCount) {
            elements.detailQuestionCount.textContent = questionData[subject].length;
        }
        if (elements.detailSubjectIcon && subjectIcons[subject]) {
            const iconContainer = elements.detailSubjectIcon.parentElement;
            if (iconContainer) {
                iconContainer.innerHTML = subjectIcons[subject].replace('<svg', '<svg id="detail-subject-icon"');
                elements.detailSubjectIcon = document.getElementById('detail-subject-icon');
            }
        }
        if (state.allSubjectStats && state.allSubjectStats[subject]) {
            if (elements.detailWrongCount) {
                elements.detailWrongCount.textContent = state.allSubjectStats[subject].wrongCount;
            }
            if (elements.detailExamCount) {
                elements.detailExamCount.textContent = state.allSubjectStats[subject].examCount;
            }
        }
    }

    function loadStorage() {
        try {
            const savedWrong = localStorage.getItem(getStorageKey('wrongQuestions'));
            if (savedWrong) {
                state.wrongQuestions = JSON.parse(savedWrong);
            }
            const savedHistory = localStorage.getItem(getStorageKey('examHistory'));
            if (savedHistory) {
                state.examHistory = parseInt(savedHistory);
            }
        } catch (e) {
            console.error('Load storage error:', e);
        }
    }

    function saveWrongQuestions() {
        try {
            localStorage.setItem(getStorageKey('wrongQuestions'), JSON.stringify(state.wrongQuestions));
            loadAllSubjectStats();
            updateHomeStats();
        } catch (e) {
            console.error('Save storage error:', e);
        }
    }

    function saveExamHistory() {
        try {
            localStorage.setItem(getStorageKey('examHistory'), state.examHistory.toString());
            loadAllSubjectStats();
            updateHomeStats();
        } catch (e) {
            console.error('Save history error:', e);
        }
    }

    function clearAllStorage() {
        localStorage.removeItem(getStorageKey('wrongQuestions'));
        localStorage.removeItem(getStorageKey('examHistory'));
        localStorage.removeItem(getStorageKey('lastScore'));
        localStorage.removeItem(getStorageKey('lastReviewScore'));
        state.wrongQuestions = [];
        state.examHistory = 0;
        loadAllSubjectStats();
        updateHomeStats();
    }

    function updateHomeStats() {
        if (elements.yaowuCount) {
            elements.yaowuCount.textContent = questionData.yaowu.length;
        }
        if (elements.linchuangCount) {
            elements.linchuangCount.textContent = questionData.linchuang.length;
        }
        if (elements.sixiangCount) {
            elements.sixiangCount.textContent = questionData.sixiang.length;
        }
        if (state.allSubjectStats) {
            if (elements.yaowuWrong && state.allSubjectStats.yaowu) {
                elements.yaowuWrong.textContent = state.allSubjectStats.yaowu.wrongCount;
            }
            if (elements.yaowuExam && state.allSubjectStats.yaowu) {
                elements.yaowuExam.textContent = state.allSubjectStats.yaowu.examCount;
            }
            if (elements.linchuangWrong && state.allSubjectStats.linchuang) {
                elements.linchuangWrong.textContent = state.allSubjectStats.linchuang.wrongCount;
            }
            if (elements.linchuangExam && state.allSubjectStats.linchuang) {
                elements.linchuangExam.textContent = state.allSubjectStats.linchuang.examCount;
            }
            if (elements.sixiangWrong && state.allSubjectStats.sixiang) {
                elements.sixiangWrong.textContent = state.allSubjectStats.sixiang.wrongCount;
            }
            if (elements.sixiangExam && state.allSubjectStats.sixiang) {
                elements.sixiangExam.textContent = state.allSubjectStats.sixiang.examCount;
            }
        }
    }

    function showPage(pageName) {
        if (elements.loginPage) elements.loginPage.classList.remove('active');
        elements.homePage.classList.remove('active');
        elements.subjectDetailPage.classList.remove('active');
        elements.examPage.classList.remove('active');
        elements.resultPage.classList.remove('active');
        elements.reviewPage.classList.remove('active');

        switch (pageName) {
            case 'login':
                if (elements.loginPage) elements.loginPage.classList.add('active');
                break;
            case 'home':
                elements.homePage.classList.add('active');
                break;
            case 'subjectDetail':
                elements.subjectDetailPage.classList.add('active');
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
        
        updateHeaderDisplay(pageName);
    }

    async function selectSubject(subject) {
        state.currentSubject = subject;
        await loadSubjectDataFromServer(subject);
        loadStorage();
        loadAllSubjectStats();
        updateSubjectDetail();
        showPage('subjectDetail');
    }

    function startExamFromDetail() {
        state.mode = 'exam';
        startExam();
    }

    function startReviewFromDetail() {
        state.mode = 'review';
        startReview();
    }

    function startExam() {
        state.mode = 'exam';
        state.questions = [...questionData[state.currentSubject]];
        state.currentIndex = 0;
        state.selectedAnswer = null;
        state.showFeedback = false;
        state.isAnswerCorrect = null;
        state.correctCount = 0;
        state.wrongQuestions = [];
        state.wrongAnswerMap = {};
        state.answerRecord = {};

        elements.examMode.textContent = '正式考试';
        elements.examMode.classList.remove('review-mode');
        
        updateExamProgress();
        renderQuestion();
        showPage('exam');
    }

    function startReview() {
        const subjectWrong = localStorage.getItem(getStorageKey('wrongQuestions'));
        state.wrongQuestions = subjectWrong ? JSON.parse(subjectWrong) : [];
        
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
            questionData[state.currentSubject].find(q => q.id === qId)
        ).filter(Boolean);
        state.currentIndex = 0;
        state.selectedAnswer = null;
        state.showFeedback = false;
        state.isAnswerCorrect = null;
        state.correctCount = 0;
        state.wrongAnswerMap = {};
        state.answerRecord = {};
        state.reviewWrongList = [];
        
        updateReviewProgress();
        updateReviewStats();
        renderReviewAnswerCard();
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

    function updateReviewStats() {
        if (!elements.reviewCorrectCount || !elements.reviewWrongCount) return;
        
        const wrongCount = Object.keys(state.wrongAnswerMap).length;
        const correctCount = Object.keys(state.answerRecord).length - wrongCount;
        
        elements.reviewCorrectCount.textContent = correctCount;
        elements.reviewWrongCount.textContent = wrongCount;
    }

    function renderQuestion() {
        const question = state.questions[state.currentIndex];
        
        let typeLabel = '单选题';
        if (question.type === 'multiple') typeLabel = '多选题';
        else if (question.type === 'fill') typeLabel = '填空题';
        else if (question.type === 'truefalse') typeLabel = '判断题';
        
        elements.questionType.textContent = typeLabel;
        elements.questionText.textContent = question.question;
        
        // 显示题目图片（如果有）
        const existingImage = elements.questionText.parentElement.querySelector('.question-image');
        if (existingImage) {
            existingImage.remove();
        }
        if (question.image) {
            const img = document.createElement('img');
            img.src = question.image;
            img.className = 'question-image';
            img.alt = '题目图片';
            elements.questionText.parentElement.insertBefore(img, elements.questionText.nextSibling);
        }
        
        renderOptions(question, elements.optionsContainer, false);
        
        const answerRecord = state.answerRecord[question.id];
        if (answerRecord) {
            state.selectedAnswer = answerRecord.answer;
            state.showFeedback = true;
            state.isAnswerCorrect = answerRecord.isCorrect;
            
            showWrongFeedback(question, false);
            
            if (answerRecord.isCorrect) {
                elements.feedbackSection.style.display = 'block';
                elements.feedbackContent.innerHTML = `
                    <svg class="feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span class="feedback-text">回答正确！</span>
                `;
                elements.feedbackContent.className = 'feedback-content feedback-correct';
            }
            
            elements.nextBtn.disabled = false;
            elements.nextBtn.textContent = state.currentIndex === state.questions.length - 1 ? '完成考试' : '下一题';
            
            const buttons = elements.optionsContainer.querySelectorAll('.option-btn');
            buttons.forEach(btn => {
                btn.style.pointerEvents = 'none';
            });
        } else {
            state.selectedAnswer = null;
            state.showFeedback = false;
            state.isAnswerCorrect = null;
            
            elements.feedbackSection.style.display = 'none';
            elements.nextBtn.disabled = true;
            elements.nextBtn.textContent = state.currentIndex === state.questions.length - 1 ? '完成考试' : '下一题';
        }
    }

    function renderReviewQuestion() {
        const question = state.questions[state.currentIndex];
        
        elements.reviewQuestionText.textContent = question.question;
        
        // 显示题目图片（如果有）
        const existingImage = elements.reviewQuestionText.parentElement.querySelector('.question-image');
        if (existingImage) {
            existingImage.remove();
        }
        if (question.image) {
            const img = document.createElement('img');
            img.src = question.image;
            img.className = 'question-image';
            img.alt = '题目图片';
            elements.reviewQuestionText.parentElement.insertBefore(img, elements.reviewQuestionText.nextSibling);
        }
        
        renderOptions(question, elements.reviewOptionsContainer, true);
        
        const answerRecord = state.answerRecord[question.id];
        if (answerRecord) {
            state.selectedAnswer = answerRecord.answer;
            state.showFeedback = true;
            state.isAnswerCorrect = answerRecord.isCorrect;
            
            showWrongFeedback(question, true);
            
            if (answerRecord.isCorrect) {
                elements.reviewFeedbackSection.style.display = 'block';
                elements.reviewFeedbackContent.innerHTML = `
                    <svg class="feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span class="feedback-text">回答正确！</span>
                `;
                elements.reviewFeedbackContent.className = 'feedback-content feedback-correct';
            }
            
            elements.reviewNextBtn.disabled = false;
            elements.reviewNextBtn.textContent = state.currentIndex === state.questions.length - 1 ? '完成复习' : '下一题';
            
            const buttons = elements.reviewOptionsContainer.querySelectorAll('.option-btn');
            buttons.forEach(btn => {
                btn.style.pointerEvents = 'none';
            });
        } else {
            elements.reviewFeedbackSection.style.display = 'none';
            elements.reviewNextBtn.disabled = true;
            elements.reviewNextBtn.textContent = state.currentIndex === state.questions.length - 1 ? '完成复习' : '下一题';
        }
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
        const isMultiple = question.type === 'multiple';
        
        if (state.answerRecord[question.id]) {
            return;
        }
        
        if (isMultiple) {
            if (!Array.isArray(state.selectedAnswer)) {
                state.selectedAnswer = [];
            }
            
            const answerIndex = state.selectedAnswer.indexOf(answer);
            if (answerIndex > -1) {
                state.selectedAnswer.splice(answerIndex, 1);
            } else {
                state.selectedAnswer.push(answer);
            }
            state.selectedAnswer.sort();
            
            buttons.forEach(btn => {
                btn.classList.remove('option-selected', 'option-wrong');
                if (state.showFeedback) {
                    if (question.answer.includes(btn.dataset.answer)) {
                        btn.classList.add('option-correct');
                    }
                }
                if (state.selectedAnswer.includes(btn.dataset.answer)) {
                    btn.classList.add('option-selected');
                }
            });
            
            const nextBtn = isReview ? elements.reviewNextBtn : elements.nextBtn;
            nextBtn.disabled = state.selectedAnswer.length === 0;
        } else {
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
    }

    function handleNext(isReview) {
        if (!state.selectedAnswer || (Array.isArray(state.selectedAnswer) && state.selectedAnswer.length === 0)) return;

        const question = state.questions[state.currentIndex];
        const isMultiple = question.type === 'multiple';
        
        let isCorrect;
        let userAnswer;
        
        if (isMultiple) {
            const userAnswerStr = state.selectedAnswer.sort().join('');
            const correctAnswerStr = question.answer.split('').sort().join('');
            isCorrect = userAnswerStr === correctAnswerStr;
            userAnswer = userAnswerStr;
        } else {
            isCorrect = state.selectedAnswer === question.answer;
            userAnswer = state.selectedAnswer;
        }

        if (!state.answerRecord[question.id]) {
            if (isCorrect) {
                if (state.mode === 'exam') {
                    state.correctCount++;
                }
            } else {
                // 无论是考试还是错题重做模式，都记录错题到 wrongAnswerMap
                state.wrongAnswerMap[question.id] = userAnswer;
                
                if (state.mode === 'exam') {
                    if (!state.wrongQuestions.includes(question.id)) {
                        state.wrongQuestions.push(question.id);
                    }
                }
            }
            
            state.answerRecord[question.id] = {
                answer: userAnswer,
                isCorrect: isCorrect
            };
            
            if (state.mode === 'exam') {
                updateExamStats();
            } else {
                updateReviewStats();
            }
            
            if (state.mode === 'exam') {
                renderAnswerCard();
            } else {
                renderReviewAnswerCard();
            }
        }

        if (!state.showFeedback) {
            showWrongFeedback(question, isReview);
            state.showFeedback = true;
            state.isAnswerCorrect = isCorrect;
            
            if (isCorrect) {
                const feedbackSection = isReview ? elements.reviewFeedbackSection : elements.feedbackSection;
                const feedbackContent = isReview ? elements.reviewFeedbackContent : elements.feedbackContent;
                feedbackSection.style.display = 'block';
                feedbackContent.innerHTML = `
                    <svg class="feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span class="feedback-text">回答正确！</span>
                `;
                feedbackContent.className = 'feedback-content feedback-correct';
            }
            
            const nextBtn = isReview ? elements.reviewNextBtn : elements.nextBtn;
            if (state.currentIndex === state.questions.length - 1) {
                nextBtn.innerHTML = `
                    ${isReview ? '完成复习' : '完成考试'}
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                `;
            }
            
            const container = isReview ? elements.reviewOptionsContainer : elements.optionsContainer;
            const buttons = container.querySelectorAll('.option-btn');
            buttons.forEach(btn => {
                btn.style.pointerEvents = 'none';
            });
        } else {
            proceedToNext(isReview);
        }
    }

    function showWrongFeedback(question, isReview) {
        const container = isReview ? elements.reviewOptionsContainer : elements.optionsContainer;
        const buttons = container.querySelectorAll('.option-btn');
        const isMultiple = question.type === 'multiple';
        
        if (isMultiple) {
            const correctAnswers = question.answer.split('');
            const userAnswers = Array.isArray(state.selectedAnswer) ? state.selectedAnswer : [];
            
            buttons.forEach(btn => {
                const answer = btn.dataset.answer;
                btn.classList.remove('option-selected');
                if (correctAnswers.includes(answer)) {
                    btn.classList.add('option-correct');
                }
                if (userAnswers.includes(answer) && !correctAnswers.includes(answer)) {
                    btn.classList.add('option-wrong');
                }
            });
        } else {
            buttons.forEach(btn => {
                const answer = btn.dataset.answer;
                btn.classList.remove('option-selected');
                if (answer === question.answer) {
                    btn.classList.add('option-correct');
                } else if (answer === state.selectedAnswer) {
                    btn.classList.add('option-wrong');
                }
            });
        }

        const feedbackSection = isReview ? elements.reviewFeedbackSection : elements.feedbackSection;
        const feedbackContent = isReview ? elements.reviewFeedbackContent : elements.feedbackContent;
        
        showFeedbackMessage(feedbackSection, feedbackContent, false, question);
    }

    function updateWrongFeedback(question, isReview) {
        const container = isReview ? elements.reviewOptionsContainer : elements.optionsContainer;
        const buttons = container.querySelectorAll('.option-btn');
        const isMultiple = question.type === 'multiple';
        
        if (isMultiple) {
            const correctAnswers = question.answer.split('');
            const userAnswers = Array.isArray(state.selectedAnswer) ? state.selectedAnswer : [];
            
            buttons.forEach(btn => {
                const answer = btn.dataset.answer;
                btn.classList.remove('option-selected', 'option-wrong');
                if (correctAnswers.includes(answer)) {
                    btn.classList.add('option-correct');
                }
                if (userAnswers.includes(answer) && !correctAnswers.includes(answer)) {
                    btn.classList.add('option-wrong');
                }
            });
        } else {
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
                <span class="feedback-text">回答错误！正确答案是 ${question.answer}。</span>
            `;
        }
    }

    function createConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;
        
        const colors = ['#165DFF', '#00B42A', '#F53F3F', '#FF7D00', '#9B59B6', '#00C8C8', '#F7BA1E', '#722ED1'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = Math.random() * 2 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            confetti.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                background: ${color};
                border-radius: ${borderRadius};
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;
            
            container.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, (delay + duration) * 1000);
        }
    }

    function showSadFace() {
        const container = document.getElementById('sad-face-container');
        if (!container) return;
        
        container.style.display = 'flex';
        
        setTimeout(() => {
            container.style.display = 'none';
        }, 2500);
    }

    function getLastScore(isReview = false) {
        try {
            const keySuffix = isReview ? 'lastReviewScore' : 'lastScore';
            const saved = localStorage.getItem(getStorageKey(keySuffix));
            return saved ? parseInt(saved) : null;
        } catch (e) {
            return null;
        }
    }

    function saveLastScore(score, isReview = false) {
        try {
            const keySuffix = isReview ? 'lastReviewScore' : 'lastScore';
            localStorage.setItem(getStorageKey(keySuffix), score.toString());
        } catch (e) {
            console.error('Save score error:', e);
        }
    }

    function getEncouragementMessage(score, lastScore, isReview) {
        const improvement = lastScore !== null ? score - lastScore : null;
        
        if (isReview) {
            if (score === 100) {
                return '🎉 太棒了！错题全部做对了，你已经完全掌握了这些知识！';
            } else if (score >= 80) {
                return '💪 很好！大部分错题已经掌握了，继续加油！';
            } else if (score >= 60) {
                return '📚 有进步！但还有一些知识需要巩固，再接再厉！';
            } else {
                return '🔄 还需要多练习，错题是进步的好机会，再试一次！';
            }
        }
        
        if (score === 100) {
            if (improvement === null) {
                return '🎊 满分！你真是学霸，太棒了！';
            } else if (improvement > 0) {
                return '🏆 满分！比上次进步了 ' + improvement + ' 分，完美！';
            } else {
                return '🌟 满分！保持得很好，继续加油！';
            }
        } else if (score >= 90) {
            if (improvement === null) {
                return '👏 非常优秀！差一点就满分了！';
            } else if (improvement > 0) {
                return '✨ 非常优秀！比上次进步了 ' + improvement + ' 分，继续保持！';
            } else if (improvement === 0) {
                return '💯 稳定发挥！继续保持这个水平！';
            } else {
                return '📈 虽然这次稍微下降，但依然优秀，加油回到满分！';
            }
        } else if (score >= 80) {
            if (improvement === null) {
                return '👍 表现不错！再努力一点就能更优秀了！';
            } else if (improvement > 0) {
                return '🚀 进步明显！比上次进步了 ' + improvement + ' 分，继续加油！';
            } else if (improvement === 0) {
                return '😊 保持稳定，再努力一点就能突破！';
            } else {
                return '💪 别灰心，这次 ' + Math.abs(improvement) + ' 分的差距，下次一定能追回来！';
            }
        } else if (score >= 60) {
            if (improvement === null) {
                return '📚 及格了，但还有很大提升空间，多复习错题！';
            } else if (improvement > 0) {
                return '📖 有进步！比上次进步了 ' + improvement + ' 分，继续努力！';
            } else if (improvement === 0) {
                return '🔄 还在及格线，需要更努力，加油！';
            } else {
                return '⚠️ 这次有所下降，多复习错题，下次一定会更好！';
            }
        } else {
            if (improvement === null) {
                return '💡 还需要多努力，建议先复习错题再重新考试！';
            } else if (improvement > 0) {
                return '🌱 有进步！比上次进步了 ' + improvement + ' 分，继续加油！';
            } else {
                return '🌻 别气馁！错题是进步的阶梯，先复习错题再试试！';
            }
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
        let correct, wrong;
        
        wrong = Object.keys(state.wrongAnswerMap).length;
        correct = total - wrong;
        
        if (isReview) {
            const wrongAnswerList = Object.keys(state.wrongAnswerMap);
            state.wrongQuestions = wrongAnswerList.map(id => parseInt(id));
            saveWrongQuestions();
        } else {
            saveWrongQuestions();
            state.examHistory++;
            saveExamHistory();
            
            if (elements.resultTitle) elements.resultTitle.textContent = '考试完成！';
            if (elements.resultSubtitle) elements.resultSubtitle.textContent = '您的考试成绩如下';
        }

        if (isReview) {
            if (elements.resultTitle) elements.resultTitle.textContent = '复习完成！';
            if (elements.resultSubtitle) elements.resultSubtitle.textContent = '您的复习成绩如下';
        }

        const score = Math.round((correct / total) * 100);
        const accuracy = Math.round((correct / total) * 100);
        const lastScore = getLastScore(isReview);

        if (elements.scoreValue) elements.scoreValue.textContent = score;
        if (elements.accuracyRate) elements.accuracyRate.textContent = `${accuracy}%`;
        if (elements.resultCorrectCount) elements.resultCorrectCount.textContent = correct;
        if (elements.wrongCountResult) elements.wrongCountResult.textContent = wrong;

        const circumference = 2 * Math.PI * 54;
        const offset = circumference * (1 - accuracy / 100);
        if (elements.scoreProgress) elements.scoreProgress.style.strokeDashoffset = offset;

        if (wrong > 0 && !isReview) {
            if (elements.wrongListSection) elements.wrongListSection.style.display = 'block';
            if (elements.wrongCountDetail) elements.wrongCountDetail.textContent = `${wrong} 题`;
            renderWrongList();
            if (elements.reviewWrongBtn) elements.reviewWrongBtn.style.display = 'inline-flex';
        } else {
            if (elements.wrongListSection) elements.wrongListSection.style.display = 'none';
            if (elements.reviewWrongBtn) elements.reviewWrongBtn.style.display = 'none';
        }

        if (elements.encouragementMessage) {
            const message = getEncouragementMessage(score, lastScore, isReview);
            elements.encouragementMessage.textContent = message;
            elements.encouragementMessage.style.display = 'inline-block';
        }

        saveLastScore(score, isReview);

        updateHomeStats();
        showPage('result');
        
        if (score < 60 || score === 0 || (lastScore !== null && score < lastScore)) {
            showSadFace();
        } else {
            createConfetti();
        }
        
        syncSubjectData(state.currentSubject);
    }

    function updateExamStats() {
        const wrongCount = Object.keys(state.wrongAnswerMap).length;
        const correctCount = state.correctCount;
        
        if (elements.examCorrectCount) {
            elements.examCorrectCount.textContent = correctCount;
        }
        if (elements.examWrongCount) {
            elements.examWrongCount.textContent = wrongCount;
        }
    }

    function showAnswerCard() {
        renderAnswerCard();
        if (elements.answerCardModal) {
            elements.answerCardModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function hideAnswerCard() {
        if (elements.answerCardModal) {
            elements.answerCardModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    function showReviewAnswerCard() {
        if (elements.reviewAnswerCardModal) {
            elements.reviewAnswerCardModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            renderReviewAnswerCard();
        }
    }

    function hideReviewAnswerCard() {
        if (elements.reviewAnswerCardModal) {
            elements.reviewAnswerCardModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    function renderAnswerCard() {
        if (!elements.answerGrid) return;
        
        elements.answerGrid.innerHTML = '';
        
        state.questions.forEach((question, index) => {
            const item = document.createElement('button');
            item.className = 'answer-grid-item';
            item.textContent = index + 1;
            
            const isCurrent = index === state.currentIndex;
            const answerRecord = state.answerRecord[question.id];
            const isCorrect = answerRecord && answerRecord.isCorrect;
            const isWrong = answerRecord && !answerRecord.isCorrect;
            
            if (isCurrent) {
                item.classList.add('current');
            }
            
            if (isWrong) {
                item.classList.add('wrong');
            } else if (isCorrect) {
                item.classList.add('correct');
            } else {
                item.classList.add('pending');
            }
            
            item.addEventListener('click', () => {
                state.currentIndex = index;
                updateExamProgress();
                renderQuestion();
                hideAnswerCard();
            });
            
            elements.answerGrid.appendChild(item);
        });
    }

    function renderReviewAnswerCard() {
        if (!elements.reviewAnswerGrid) return;
        
        elements.reviewAnswerGrid.innerHTML = '';
        
        state.questions.forEach((question, index) => {
            const item = document.createElement('button');
            item.className = 'answer-grid-item';
            item.textContent = index + 1;
            
            const isCurrent = index === state.currentIndex;
            const answerRecord = state.answerRecord[question.id];
            const isCorrect = answerRecord && answerRecord.isCorrect;
            const isWrong = answerRecord && !answerRecord.isCorrect;
            
            if (isCurrent) {
                item.classList.add('current');
            }
            
            if (isWrong) {
                item.classList.add('wrong');
            } else if (isCorrect) {
                item.classList.add('correct');
            } else {
                item.classList.add('pending');
            }
            
            item.addEventListener('click', () => {
                state.currentIndex = index;
                updateReviewProgress();
                renderReviewQuestion();
                hideReviewAnswerCard();
            });
            
            elements.reviewAnswerGrid.appendChild(item);
        });
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
        if (elements.loginSubmitBtn) {
            elements.loginSubmitBtn.addEventListener('click', handleLogin);
        }
        
        if (elements.registerSubmitBtn) {
            elements.registerSubmitBtn.addEventListener('click', handleRegister);
        }
        
        const passwordToggles = document.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.dataset.target;
                const input = document.getElementById(targetId);
                const eyeOpen = toggle.querySelector('.eye-open');
                const eyeClosed = toggle.querySelector('.eye-closed');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    eyeOpen.style.display = 'none';
                    eyeClosed.style.display = 'inline';
                } else {
                    input.type = 'password';
                    eyeOpen.style.display = 'inline';
                    eyeClosed.style.display = 'none';
                }
            });
        });
        
        if (elements.goToRegister) {
            elements.goToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                showRegisterForm();
            });
        }
        
        if (elements.goToLogin) {
            elements.goToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                showLoginForm();
            });
        }
        
        if (elements.logoutBtn) {
            elements.logoutBtn.addEventListener('click', handleLogout);
        }
        
        if (elements.loginPassword) {
            elements.loginPassword.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleLogin();
                }
            });
        }
        
        if (elements.registerConfirmPassword) {
            elements.registerConfirmPassword.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleRegister();
                }
            });
        }
        
        elements.subjectCards.forEach(card => {
            card.addEventListener('click', () => {
                const subject = card.dataset.subject;
                selectSubject(subject);
            });
        });

        if (elements.backFromDetailBtn) {
            elements.backFromDetailBtn.addEventListener('click', () => {
                loadAllSubjectStats();
                updateHomeStats();
                showPage('home');
            });
        }

        if (elements.detailExamBtn) {
            elements.detailExamBtn.addEventListener('click', startExamFromDetail);
        }

        if (elements.detailReviewBtn) {
            elements.detailReviewBtn.addEventListener('click', startReviewFromDetail);
        }

        if (elements.detailClearBtn) {
            elements.detailClearBtn.addEventListener('click', () => {
                showConfirmModal(
                    '清除记录',
                    '确定要清除当前科目的所有考试记录和错题吗？此操作不可恢复。',
                    () => {
                        clearAllStorage();
                        loadAllSubjectStats();
                        updateHomeStats();
                        updateSubjectDetail();
                    }
                );
            });
        }

        elements.nextBtn.addEventListener('click', () => handleNext(false));
        
        elements.reviewNextBtn.addEventListener('click', () => handleNext(true));

        elements.exitExamBtn.addEventListener('click', () => {
            showConfirmModal(
                '退出考试',
                '当前考试进度将不会保存，确定要退出吗？',
                () => {
                    showPage('subjectDetail');
                }
            );
        });
        
        elements.exitReviewBtn.addEventListener('click', () => {
            showConfirmModal(
                '退出复习',
                '当前复习进度将不会保存，确定要退出吗？',
                () => {
                    showPage('subjectDetail');
                }
            );
        });

        if (elements.backHomeBtn) {
            elements.backHomeBtn.addEventListener('click', () => {
                showPage('home');
            });
        }

        if (elements.resultBackHomeBtn) {
            elements.resultBackHomeBtn.addEventListener('click', () => {
                showPage('home');
            });
        }
        
        if (elements.reviewWrongBtn) {
            elements.reviewWrongBtn.addEventListener('click', () => {
                startReview();
            });
        }

        if (elements.modalCancel) {
            elements.modalCancel.addEventListener('click', hideConfirmModal);
        }
        
        if (elements.modalConfirm) {
            elements.modalConfirm.addEventListener('click', () => {
                if (pendingAction) {
                    pendingAction();
                }
                hideConfirmModal();
            });
        }

        if (elements.confirmModal) {
            const modalOverlay = elements.confirmModal.querySelector('.modal-overlay');
            if (modalOverlay) {
                modalOverlay.addEventListener('click', hideConfirmModal);
            }
        }
        
        if (elements.answerCardBtn) {
            elements.answerCardBtn.addEventListener('click', showAnswerCard);
        }
        
        if (elements.correctCountBtn) {
            elements.correctCountBtn.addEventListener('click', showAnswerCard);
        }
        
        if (elements.wrongCountBtn) {
            elements.wrongCountBtn.addEventListener('click', showAnswerCard);
        }
        
        if (elements.closeAnswerCardBtn) {
            elements.closeAnswerCardBtn.addEventListener('click', hideAnswerCard);
        }
        
        if (elements.answerCardModal) {
            elements.answerCardModal.addEventListener('click', function(e) {
                if (e.target === elements.answerCardModal) {
                    hideAnswerCard();
                }
            });
        }
        
        if (elements.reviewAnswerCardBtn) {
            elements.reviewAnswerCardBtn.addEventListener('click', showReviewAnswerCard);
        }
        
        if (elements.reviewCorrectCount) {
            const reviewCorrectBtn = elements.reviewCorrectCount.parentElement;
            if (reviewCorrectBtn) {
                reviewCorrectBtn.addEventListener('click', showReviewAnswerCard);
            }
        }
        
        if (elements.reviewWrongCount) {
            const reviewWrongBtn = elements.reviewWrongCount.parentElement;
            if (reviewWrongBtn) {
                reviewWrongBtn.addEventListener('click', showReviewAnswerCard);
            }
        }
        
        if (elements.reviewCloseAnswerCard) {
            elements.reviewCloseAnswerCard.addEventListener('click', hideReviewAnswerCard);
        }
        
        if (elements.reviewAnswerCardModal) {
            elements.reviewAnswerCardModal.addEventListener('click', function(e) {
                if (e.target === elements.reviewAnswerCardModal) {
                    hideReviewAnswerCard();
                }
            });
        }
    }

    return {
        init,
        debug: {
            jumpToLast: function() {
                state.currentIndex = state.questions.length - 1;
                state.selectedAnswer = null;
                state.showFeedback = false;
                updateExamProgress();
                renderQuestion();
            },
            jumpTo: function(index) {
                state.currentIndex = Math.max(0, Math.min(index, state.questions.length - 1));
                state.selectedAnswer = null;
                state.showFeedback = false;
                updateExamProgress();
                renderQuestion();
            },
            quickFinishReview: function(wrongCount) {
                state.wrongAnswerMap = {};
                state.answerRecord = {};
                
                const total = state.questions.length;
                const actualWrongCount = Math.min(wrongCount, total);
                
                for (let i = 0; i < total; i++) {
                    const q = state.questions[i];
                    const isWrong = i < actualWrongCount;
                    const userAnswer = isWrong ? 'X' : q.answer;
                    
                    if (isWrong) {
                        state.wrongAnswerMap[q.id] = userAnswer;
                    }
                    
                    state.answerRecord[q.id] = {
                        answer: userAnswer,
                        isCorrect: !isWrong
                    };
                }
                
                finishExam(true);
                return {
                    total: total,
                    wrong: actualWrongCount,
                    correct: total - actualWrongCount
                };
            }
        }
    };
})();

document.addEventListener('DOMContentLoaded', function() {
    examApp.init();
});
