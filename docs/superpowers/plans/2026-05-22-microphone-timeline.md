# 麦克风 + 时间轴功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个完整的录音可视化界面，包含麦克风输入和时间轴显示功能

**Architecture:** 修改现有的 demo.html，添加 Web Audio API 麦克风处理，新增时间轴显示，保持条形柱从右向左流动的效果

**Tech Stack:** 纯 HTML/CSS/JavaScript + Web Audio API

---

## 任务分解

### Task 1: 更新数据结构，添加时间信息

**Files:**
- Modify: `demo.html:135-158`

**Goal:** 重构 volumes 数组，存储音量值 + 时间戳

- [ ] **Step 1: 修改 volumes 数据结构**

将现有代码：
```javascript
let volumes = Array(BAR_COUNT).fill(0);
```

修改为：
```javascript
const BAR_COUNT = 30;
const MIN_HEIGHT = 12;
const MAX_HEIGHT = 58;
const BAR_WIDTH = 4;
const BAR_GAP = 6;
const TIME_LABEL_INTERVAL = 5; // 每5个条形柱显示一个时间标签

let autoMode = false;
let autoInterval = null;
let volumes = Array(BAR_COUNT).fill(0).map(() => ({ value: 0, time: null }));
let recordingStartTime = null;
let animationFrameId = null;
```

- [ ] **Step 2: 修改 updateBars 函数**

将现有代码：
```javascript
function updateBars(newVolume) {
  volumes = [...volumes.slice(1), newVolume];
  
  const bars = container.querySelectorAll('.bar');
  bars.forEach((bar, index) => {
    const volume = volumes[index];
    const height = MIN_HEIGHT + volume * (MAX_HEIGHT - MIN_HEIGHT);
    bar.style.height = height + 'px';
  });
  
  volumeValue.textContent = newVolume.toFixed(2);
}
```

修改为：
```javascript
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

function updateBars(newVolume, isRecording = false) {
  let timeLabel = null;
  if (isRecording && recordingStartTime) {
    const elapsed = Date.now() - recordingStartTime;
    timeLabel = formatTime(elapsed);
  }
  
  volumes = [...volumes.slice(1), { value: newVolume, time: timeLabel }];
  
  const bars = container.querySelectorAll('.bar');
  bars.forEach((bar, index) => {
    const volume = volumes[index].value;
    const height = MIN_HEIGHT + volume * (MAX_HEIGHT - MIN_HEIGHT);
    bar.style.height = height + 'px';
  });
  
  volumeValue.textContent = newVolume.toFixed(2);
}
```

- [ ] **Step 3: 提交变更**

```bash
git add demo.html
git commit -m "feat: update data structure with time information"
```

---

### Task 2: 重写 HTML 结构，添加时间轴容器

**Files:**
- Modify: `demo.html:111-119` (HTML structure)
- Modify: `demo.html:31-44` (CSS)

**Goal:** 添加时间轴显示区域

- [ ] **Step 1: 更新 CSS，调整布局**

在 `<style>` 标签中，将 `.container` 和 `.bar` 的样式替换为：

```css
.wave-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}

.bars-container {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 60px;
}

.bar {
  width: 4px;
  background-color: #fff;
  border-radius: 2px;
  transition: height 0.1s ease-out;
  min-height: 12px;
}

.timeline-container {
  display: flex;
  gap: 6px;
  height: 20px;
  align-items: center;
}

.time-label {
  width: 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  text-align: center;
  white-space: nowrap;
  overflow: visible;
}
```

- [ ] **Step 2: 更新 HTML 结构**

将 `<body>` 中的 HTML 替换为：

```html
<h1>Sound Wave Demo</h1>

<div class="wave-container">
  <div class="bars-container" id="soundWaveContainer"></div>
  <div class="timeline-container" id="timelineContainer"></div>
</div>

<div class="controls">
  <div class="volume-display">Volume: <span id="volumeValue">0.00</span></div>
  <div class="time-display">Time: <span id="timeValue">00:00</span></div>
  <input type="range" class="volume-slider" id="volumeSlider" min="0" max="1" step="0.01" value="0.5">
  <div class="button-group">
    <button class="mic-button" id="micButton">🎤</button>
    <button class="auto-button" id="autoButton">Auto Mode</button>
  </div>
</div>
```

- [ ] **Step 3: 添加新的 CSS 样式**

在 `<style>` 标签末尾（`.auto-button.active` 之后）添加：

```css
.time-display {
  color: #fff;
  font-size: 16px;
}

.button-group {
  display: flex;
  gap: 15px;
}

.mic-button {
  width: 48px;
  height: 48px;
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mic-button:hover {
  opacity: 0.8;
}

.mic-button.recording {
  background-color: #ff3b30;
  color: #fff;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
```

- [ ] **Step 4: 提交变更**

```bash
git add demo.html
git commit -m "feat: update HTML structure for timeline"
```

---

### Task 3: 重写 createBars 和添加时间标记渲染

**Files:**
- Modify: `demo.html:137-145` (createBars)
- Add: 新函数 createTimeline 和 updateTimeline

**Goal:** 重构条形柱创建，添加时间标记功能

- [ ] **Step 1: 更新 JavaScript 中的元素引用**

将顶部的代码：
```javascript
const container = document.getElementById('soundWaveContainer');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const autoButton = document.getElementById('autoButton');
```

修改为：
```javascript
const barsContainer = document.getElementById('soundWaveContainer');
const timelineContainer = document.getElementById('timelineContainer');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const timeValue = document.getElementById('timeValue');
const autoButton = document.getElementById('autoButton');
const micButton = document.getElementById('micButton');
```

- [ ] **Step 2: 重写 createBars 函数**

将 `createBars()` 函数替换为：
```javascript
function createBars() {
  barsContainer.innerHTML = '';
  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.width = BAR_WIDTH + 'px';
    bar.style.height = MIN_HEIGHT + 'px';
    barsContainer.appendChild(bar);
  }
}
```

- [ ] **Step 3: 添加 createTimeline 函数**

在 `createBars()` 之后添加：
```javascript
function createTimeline() {
  timelineContainer.innerHTML = '';
  for (let i = 0; i < BAR_COUNT; i++) {
    const label = document.createElement('div');
    label.className = 'time-label';
    label.style.width = BAR_WIDTH + 'px';
    label.textContent = '';
    timelineContainer.appendChild(label);
  }
}
```

- [ ] **Step 4: 更新 updateBars 函数，添加时间轴更新**

修改 `updateBars` 函数，在最后添加时间轴更新：
```javascript
function updateBars(newVolume, isRecording = false) {
  let timeLabel = null;
  if (isRecording && recordingStartTime) {
    const elapsed = Date.now() - recordingStartTime;
    timeLabel = formatTime(elapsed);
    timeValue.textContent = formatTimeForDisplay(elapsed);
  }
  
  volumes = [...volumes.slice(1), { value: newVolume, time: timeLabel }];
  
  const bars = barsContainer.querySelectorAll('.bar');
  bars.forEach((bar, index) => {
    const volume = volumes[index].value;
    const height = MIN_HEIGHT + volume * (MAX_HEIGHT - MIN_HEIGHT);
    bar.style.height = height + 'px';
  });
  
  const timeLabels = timelineContainer.querySelectorAll('.time-label');
  timeLabels.forEach((label, index) => {
    const time = volumes[index].time;
    if (time && index % TIME_LABEL_INTERVAL === 0) {
      label.textContent = time;
    } else {
      label.textContent = '';
    }
  });
  
  volumeValue.textContent = newVolume.toFixed(2);
}
```

- [ ] **Step 5: 添加辅助函数**

在 `formatTime` 之后添加：
```javascript
function formatTimeForDisplay(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
```

- [ ] **Step 6: 修改初始化调用**

在脚本底部，将：
```javascript
createBars();
updateBars(0.5);
```

修改为：
```javascript
createBars();
createTimeline();
updateBars(0.5);
```

- [ ] **Step 7: 提交变更**

```bash
git add demo.html
git commit -m "feat: add timeline rendering functions"
```

---

### Task 4: 实现麦克风功能（Web Audio API）

**Files:**
- Modify: `demo.html` - 添加麦克风相关代码

**Goal:** 实现完整的麦克风输入和音频分析功能

- [ ] **Step 1: 添加麦克风相关变量**

在变量声明区域添加：
```javascript
let isRecording = false;
let audioContext = null;
let analyser = null;
let microphoneStream = null;
let dataArray = null;
let smoothedVolume = 0;
const NOISE_THRESHOLD = 0.05;
const SMOOTHING_FACTOR = 0.3;
```

- [ ] **Step 2: 添加 startMicrophone 函数**

在脚本中部添加：
```javascript
async function startMicrophone() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    microphoneStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false
      }
    });

    const source = audioContext.createMediaStreamSource(microphoneStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    dataArray = new Float32Array(analyser.fftSize);

    isRecording = true;
    recordingStartTime = Date.now();
    micButton.classList.add('recording');
    micButton.textContent = '🔴';

    stopAutoMode();
    volumeSlider.disabled = true;
    animate();
  } catch (error) {
    console.error('麦克风权限被拒绝:', error);
    alert('无法获取麦克风权限，请允许使用麦克风后重试。\n\n将继续使用手动滑块模式。');
  }
}
```

- [ ] **Step 3: 添加 stopMicrophone 函数**

在 `startMicrophone` 之后添加：
```javascript
function stopMicrophone() {
  if (!isRecording) return;

  isRecording = false;
  micButton.classList.remove('recording');
  micButton.textContent = '🎤';
  volumeSlider.disabled = false;

  if (microphoneStream) {
    microphoneStream.getTracks().forEach(track => track.stop());
    microphoneStream = null;
  }

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  smoothedVolume = 0;
}
```

- [ ] **Step 4: 添加 calculateVolume 函数**

添加：
```javascript
function calculateVolume() {
  if (!analyser || !dataArray) return 0;

  analyser.getFloatTimeDomainData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const amplitude = dataArray[i];
    sum += amplitude * amplitude;
  }

  const rms = Math.sqrt(sum / dataArray.length);
  const normalizedVolume = Math.min(rms * 3, 1);

  if (normalizedVolume < NOISE_THRESHOLD) {
    return 0;
  }

  smoothedVolume = smoothedVolume * SMOOTHING_FACTOR + normalizedVolume * (1 - SMOOTHING_FACTOR);

  return smoothedVolume;
}
```

- [ ] **Step 5: 添加 animate 函数**

添加：
```javascript
function animate() {
  if (!isRecording) return;

  const volume = calculateVolume();
  updateBars(volume, true);
  volumeSlider.value = volume;

  animationFrameId = requestAnimationFrame(animate);
}
```

- [ ] **Step 6: 添加麦克风按钮事件监听**

在现有事件监听器之后添加：
```javascript
micButton.addEventListener('click', () => {
  if (isRecording) {
    stopMicrophone();
  } else {
    startMicrophone();
  }
});
```

- [ ] **Step 7: 提交变更**

```bash
git add demo.html
git commit -m "feat: add microphone functionality with Web Audio API"
```

---

### Task 5: 调整 Auto Mode 和滑块逻辑

**Files:**
- Modify: `demo.html` - 更新 Auto Mode 和滑块交互

**Goal:** 确保各模式之间正确切换

- [ ] **Step 1: 修改 startAutoMode 函数**

更新 `startAutoMode`，添加停止麦克风逻辑：
```javascript
function startAutoMode() {
  if (autoMode) return;

  stopMicrophone();

  autoMode = true;
  autoButton.classList.add('active');
  autoButton.textContent = 'Stop';

  autoInterval = setInterval(() => {
    const randomVolume = Math.random();
    updateBars(randomVolume);
    volumeSlider.value = randomVolume;
  }, 100);
}
```

- [ ] **Step 2: 修改滑块事件监听器**

更新滑块监听器，添加停止录音逻辑：
```javascript
volumeSlider.addEventListener('input', (e) => {
  if (autoMode) {
    stopAutoMode();
  }
  if (isRecording) {
    stopMicrophone();
  }
  const volume = parseFloat(e.target.value);
  updateBars(volume);
});
```

- [ ] **Step 3: 测试所有功能**

在浏览器中打开 `demo.html`，测试以下功能：
1. 滑块控制 - 拖动滑块，条形柱高度变化
2. Auto Mode - 点击按钮，随机音量播放
3. 麦克风 - 点击麦克风按钮，允许权限，说话看音量变化
4. 模式切换 - 各模式之间正确切换
5. 时间轴 - 录音时时间标记跟随移动

- [ ] **Step 4: 提交变更**

```bash
git add demo.html
git commit -m "feat: complete mode switching logic"
```

---

## 验证清单

完成所有任务后，验证以下功能：
- [ ] 麦克风权限请求正常
- [ ] 录音时条形柱根据音量变化
- [ ] 时间标记显示并随条形柱移动
- [ ] 总时长正确显示
- [ ] 各模式之间正确切换
- [ ] 权限被拒绝时有降级处理
- [ ] 动画流畅，无明显卡顿
